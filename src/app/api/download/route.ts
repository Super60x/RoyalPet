import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { portraitId, email } = await request.json();

    if (!portraitId || !email) {
      return NextResponse.json(
        { error: "portraitId en email zijn verplicht" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verify portrait exists
    const { data: portrait, error: portraitError } = await supabase
      .from("portraits")
      .select("id, clean_url")
      .eq("id", portraitId)
      .single();

    if (portraitError || !portrait) {
      return NextResponse.json(
        { error: "Portret niet gevonden" },
        { status: 404 }
      );
    }

    // Save email for lead capture
    await supabase
      .from("portraits")
      .update({ customer_email: email.toLowerCase() })
      .eq("id", portraitId);

    // Generate signed URL for clean image (7 days)
    const { data: signed, error: signError } = await supabase.storage
      .from("portraits-private")
      .createSignedUrl(`${portraitId}.png`, 604800); // 7 days

    if (signError || !signed?.signedUrl) {
      return NextResponse.json(
        { error: "Kon downloadlink niet genereren" },
        { status: 500 }
      );
    }

    return NextResponse.json({ downloadUrl: signed.signedUrl });
  } catch {
    return NextResponse.json(
      { error: "Er is iets misgegaan" },
      { status: 500 }
    );
  }
}
