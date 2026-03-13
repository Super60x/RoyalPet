import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { startGeneration } from "@/lib/replicate";
import { buildPrompt, STYLES } from "@/config/prompts";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limit check
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      const minutes = Math.ceil(rateLimit.resetInSeconds / 60);
      return NextResponse.json(
        {
          error: `U heeft het maximum aantal portretten bereikt. Probeer het over ${minutes} minuten opnieuw.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { portrait_id, style, gender, custom_edit, pose, color_preference } = body;

    if (!portrait_id) {
      return NextResponse.json(
        { error: "Geen portret ID opgegeven." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 3. Fetch existing portrait
    const { data: portrait, error: fetchError } = await supabase
      .from("portraits")
      .select("*")
      .eq("id", portrait_id)
      .single();

    if (fetchError || !portrait) {
      return NextResponse.json(
        { error: "Portret niet gevonden." },
        { status: 404 }
      );
    }

    // 4. Check retry count (1 free retry allowed)
    if (portrait.retry_count >= 1) {
      return NextResponse.json(
        {
          error:
            "Uw gratis poging is gebruikt. Betaalde retries worden binnenkort beschikbaar.",
        },
        { status: 403 }
      );
    }

    // 5. Find the original uploaded photo in storage
    const { data: files } = await supabase.storage
      .from("portraits-private")
      .list("originals", { search: portrait_id });

    const originalFile = files?.find((f) => f.name.startsWith(portrait_id));
    if (!originalFile) {
      return NextResponse.json(
        { error: "Originele foto niet gevonden. Upload een nieuwe foto." },
        { status: 404 }
      );
    }

    // 6. Get signed URL for the original photo
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("portraits-private")
      .createSignedUrl(`originals/${originalFile.name}`, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      return NextResponse.json(
        { error: "Er ging iets mis bij het ophalen van de foto." },
        { status: 500 }
      );
    }

    // 7. Build prompt with all options (style, pose, gender, color, custom edit)
    const selectedStyle = style && STYLES[style] ? style : portrait.style;
    const selectedPose = pose === "standing" ? "standing" : (portrait.pose || "laying_down");
    const prompt = buildPrompt({
      styleId: selectedStyle,
      pose: selectedPose,
      gender,
      colorPreference: color_preference,
      customEdit: custom_edit,
    });

    // 8. Reset portrait for regeneration (overwrite existing)
    await supabase
      .from("portraits")
      .update({
        status: "pending",
        style: selectedStyle,
        pose: selectedPose,
        gender: gender || null,
        custom_edit: custom_edit?.slice(0, 200) || null,
        prediction_id: null,
        image_url: null,
        clean_url: null,
        retry_count: portrait.retry_count + 1,
      })
      .eq("id", portrait_id);

    // 9. Start new generation (GPT Image 1.5 primary, FLUX.2 fallback handled in status route)
    const { predictionId, model } = await startGeneration(signedUrlData.signedUrl, prompt);

    // 10. Update with new prediction ID and model
    await supabase
      .from("portraits")
      .update({ prediction_id: predictionId, status: "processing", model_used: model })
      .eq("id", portrait_id);

    return NextResponse.json({ id: portrait_id });
  } catch (error) {
    console.error("Retry error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het opnieuw genereren. Probeer het later opnieuw." },
      { status: 500 }
    );
  }
}
