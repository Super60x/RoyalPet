import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import PreviewClient from "./PreviewClient";

interface PreviewPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: PreviewPageProps) {
  const supabase = createAdminClient();

  const { data: portrait, error } = await supabase
    .from("portraits")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !portrait) {
    notFound();
  }

  return (
    <PreviewClient
      portrait={{
        id: portrait.id,
        status: portrait.status,
        image_url: portrait.image_url,
        style: portrait.style,
        retry_count: portrait.retry_count,
      }}
    />
  );
}
