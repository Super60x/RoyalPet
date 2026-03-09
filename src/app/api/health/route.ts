import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("portraits").select("id").limit(1);

    // Table doesn't exist yet — that's fine, we just want to test the connection
    if (error && !error.message.includes("does not exist")) {
      return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "ok", message: "Supabase connection successful" });
  } catch (e) {
    return NextResponse.json(
      { status: "error", message: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
