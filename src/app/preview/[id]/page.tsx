import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import PreviewClient from "./PreviewClient";

interface PreviewPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: PreviewPageProps) {
  const supabase = createAdminClient();

  // Fetch portrait and frames in parallel
  const [portraitResult, framesResult] = await Promise.all([
    supabase.from("portraits").select("*").eq("id", params.id).single(),
    supabase
      .from("frames")
      .select("id, name, price_cents, overlay_url")
      .eq("active", true)
      .order("price_cents", { ascending: true }),
  ]);

  if (portraitResult.error || !portraitResult.data) {
    notFound();
  }

  const portrait = portraitResult.data;
  const frames = framesResult.data || [];

  return (
    <PreviewClient
      portrait={{
        id: portrait.id,
        status: portrait.status,
        image_url: portrait.image_url,
        style: portrait.style,
        retry_count: portrait.retry_count,
      }}
      frames={frames}
    />
  );
}
