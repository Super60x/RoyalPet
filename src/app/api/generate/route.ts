import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generatePortraitId } from "@/lib/generate-id";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  checkUsageLimit,
  incrementUsage,
  parseCookie,
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from "@/lib/usage-limit";
import { startGeneration } from "@/lib/replicate";
import { getRandomStyle, buildPrompt } from "@/config/prompts";
import { getCredits, deductCredit, CREDIT_EMAIL_COOKIE } from "@/lib/credits";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

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
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetInSeconds),
          },
        }
      );
    }

    // 1b. Usage limit check (1 free upload per 30 days, IP + cookie)
    const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
    const usageLimit = checkUsageLimit(ip, cookieValue);

    // Track whether this generation uses a credit (not free usage)
    let usedCredit = false;

    if (!usageLimit.allowed) {
      // Free limit reached — check for purchased credits
      const creditEmail = request.cookies.get(CREDIT_EMAIL_COOKIE)?.value;
      if (creditEmail) {
        const credits = await getCredits(creditEmail);
        if (credits > 0) {
          const deducted = await deductCredit(creditEmail);
          if (deducted) {
            usedCredit = true;
            // Continue with generation — credit consumed
          } else {
            return NextResponse.json(
              { error: "Er ging iets mis bij het afschrijven van uw credit.", limitReached: true },
              { status: 403 }
            );
          }
        } else {
          return NextResponse.json(
            { error: "Uw gratis portret is gebruikt. Koop credits om meer portretten te genereren.", limitReached: true },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Uw gratis portret is gebruikt. Koop credits om meer portretten te genereren.", limitReached: true },
          { status: 403 }
        );
      }
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Geen afbeelding ontvangen." },
        { status: 400 }
      );
    }

    // 3. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Alleen JPG, PNG of WebP bestanden zijn toegestaan." },
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Bestand is te groot. Maximum 10MB toegestaan." },
        { status: 400 }
      );
    }

    // 5. Generate ID and prepare file
    const id = generatePortraitId();
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];

    // 6. Upload original to portraits-private
    const supabase = createAdminClient();
    const storagePath = `originals/${id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("portraits-private")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Er ging iets mis bij het opslaan. Probeer het opnieuw." },
        { status: 500 }
      );
    }

    // 7. Get signed URL for Replicate (1 hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("portraits-private")
      .createSignedUrl(storagePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Signed URL error:", signedUrlError);
      return NextResponse.json(
        { error: "Er ging iets mis bij het verwerken. Probeer het opnieuw." },
        { status: 500 }
      );
    }

    // 8. Pick random style and insert portrait row
    const style = getRandomStyle();
    const { error: insertError } = await supabase.from("portraits").insert({
      id,
      status: "pending",
      style,
      pose: "laying_down",
    });

    if (insertError) {
      console.error("DB insert error:", insertError);
      return NextResponse.json(
        { error: "Er ging iets mis bij het opslaan. Probeer het opnieuw." },
        { status: 500 }
      );
    }

    // 9. Start generation with style prompt (GPT Image 1.5 primary, FLUX.2 fallback)
    const prompt = buildPrompt({ styleId: style, pose: "laying_down" });
    const { predictionId, model } = await startGeneration(signedUrlData.signedUrl, prompt);

    // 10. Update portrait with prediction ID and model
    await supabase
      .from("portraits")
      .update({ prediction_id: predictionId, status: "processing", model_used: model })
      .eq("id", id);

    // Increment free usage (only if not using credits)
    const response = NextResponse.json(
      { id, remaining: usedCredit ? 0 : usageLimit.remaining - 1, usedCredit },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );

    if (!usedCredit) {
      const cookie = parseCookie(cookieValue);
      const { newCookieValue } = incrementUsage(ip, cookie);
      response.cookies.set(COOKIE_NAME, newCookieValue, COOKIE_OPTIONS);
    }

    return response;
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het genereren. Probeer het later opnieuw." },
      { status: 500 }
    );
  }
}
