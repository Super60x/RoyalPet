import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  checkGeneration,
  startFallbackGeneration,
  startUpscale,
  pollUntilDone,
  MODEL_PRIMARY,
} from "@/lib/replicate";
import { buildPrompt } from "@/config/prompts";
import { applyWatermark } from "@/lib/watermark";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Geen portret ID opgegeven." }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch portrait
    const { data: portrait, error: fetchError } = await supabase
      .from("portraits")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !portrait) {
      return NextResponse.json({ error: "Portret niet gevonden." }, { status: 404 });
    }

    // 2. Already completed or failed — return immediately
    if (portrait.status === "completed") {
      return NextResponse.json({
        status: "completed",
        image_url: portrait.image_url,
      });
    }

    if (portrait.status === "failed") {
      return NextResponse.json({
        status: "failed",
        error: "De AI kon geen portret maken van deze foto. Probeer een andere foto.",
      });
    }

    // 3. Still processing — check Replicate
    if (!portrait.prediction_id) {
      return NextResponse.json({ status: "pending" });
    }

    const prediction = await checkGeneration(portrait.prediction_id);

    // 4. Still running
    if (prediction.status === "starting" || prediction.status === "processing") {
      return NextResponse.json({ status: "processing" });
    }

    // 5. Failed — try fallback if primary model was used
    if (prediction.status === "failed" || prediction.status === "canceled") {
      if (portrait.model_used === MODEL_PRIMARY) {
        try {
          const didFallback = await startFallbackWithOriginal(supabase, portrait);
          if (didFallback) {
            return NextResponse.json({ status: "processing" });
          }
        } catch (fallbackError) {
          console.error("Fallback generation failed to start:", fallbackError);
        }
      }

      // No fallback possible or fallback also failed to start
      await supabase
        .from("portraits")
        .update({ status: "failed" })
        .eq("id", id)
        .eq("status", "processing");

      return NextResponse.json({
        status: "failed",
        error: "De AI kon geen portret maken van deze foto. Probeer een andere foto.",
      });
    }

    // 6. Succeeded — pipeline: upscale → watermark → store
    if (prediction.status === "succeeded" && prediction.output) {
      // Step 1: Upscale the generated image via Real-ESRGAN
      let finalImageUrl = prediction.output;
      try {
        const upscaleId = await startUpscale(prediction.output);
        finalImageUrl = await pollUntilDone(upscaleId, 45000);
      } catch (upscaleError) {
        // If upscale fails, proceed with original resolution
        console.warn("Upscale failed, using original resolution:", upscaleError);
      }

      // Step 2: Download the (upscaled) image
      const imageResponse = await fetch(finalImageUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to download generated image");
      }
      const cleanBuffer = Buffer.from(await imageResponse.arrayBuffer());

      // Step 3: Apply watermark (Sharp → WebP for preview)
      const watermarkedBuffer = await applyWatermark(cleanBuffer);

      // Step 4: Upload watermarked to portraits-public (WebP)
      const { error: publicUploadError } = await supabase.storage
        .from("portraits-public")
        .upload(`${id}.webp`, watermarkedBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (publicUploadError) {
        console.error("Public upload error:", publicUploadError);
        throw new Error("Failed to upload watermarked image");
      }

      // Step 5: Upload clean to portraits-private (PNG for max quality downloads)
      const { error: privateUploadError } = await supabase.storage
        .from("portraits-private")
        .upload(`${id}.png`, cleanBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (privateUploadError) {
        console.error("Private upload error:", privateUploadError);
        throw new Error("Failed to upload clean image");
      }

      // Step 6: Get public URL for watermarked preview
      const { data: publicUrlData } = supabase.storage
        .from("portraits-public")
        .getPublicUrl(`${id}.webp`);

      const imageUrl = publicUrlData.publicUrl;
      const cleanUrl = `${id}.png`;

      // Step 7: Update portrait — race condition guard
      const { error: updateError } = await supabase
        .from("portraits")
        .update({
          status: "completed",
          image_url: imageUrl,
          clean_url: cleanUrl,
        })
        .eq("id", id)
        .eq("status", "processing");

      if (updateError) {
        console.error("Portrait update error:", updateError);
      }

      return NextResponse.json({
        status: "completed",
        image_url: imageUrl,
      });
    }

    // Fallback
    return NextResponse.json({ status: "processing" });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het controleren. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Fallback: rebuild prompt from stored fields, start fallback model
// ---------------------------------------------------------------------------

async function startFallbackWithOriginal(
  supabase: ReturnType<typeof createAdminClient>,
  portrait: Record<string, string | number | null>
): Promise<boolean> {
  const portraitId = portrait.id as string;

  // Find original uploaded file
  const { data: files } = await supabase.storage
    .from("portraits-private")
    .list("originals", { search: portraitId });

  if (!files || files.length === 0) {
    return false;
  }

  const originalPath = `originals/${files[0].name}`;
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("portraits-private")
    .createSignedUrl(originalPath, 3600);

  if (signedUrlError || !signedUrlData?.signedUrl) {
    return false;
  }

  // Rebuild prompt from stored portrait fields
  const prompt = buildPrompt({
    styleId: (portrait.style as string) || "flemish_masters",
    pose: (portrait.pose as "laying_down" | "standing") || "laying_down",
    gender: portrait.gender as string | null,
    customEdit: portrait.custom_edit as string | null,
  });

  const { predictionId, model } = await startFallbackGeneration(
    signedUrlData.signedUrl,
    prompt
  );

  await supabase
    .from("portraits")
    .update({
      prediction_id: predictionId,
      model_used: model,
    })
    .eq("id", portraitId)
    .eq("status", "processing");

  return true;
}
