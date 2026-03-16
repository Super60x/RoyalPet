import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import SuccessClient from "./SuccessClient";

interface PageProps {
  params: { id: string };
}

export default async function SuccessPage({ params }: PageProps) {
  const supabase = createAdminClient();

  // Fetch portrait
  const { data: portrait, error } = await supabase
    .from("portraits")
    .select("id, paid, image_url, style")
    .eq("id", params.id)
    .single();

  if (error || !portrait) return notFound();

  // Fetch latest order for this portrait
  const { data: order } = await supabase
    .from("orders")
    .select("id, product, status, customer_email")
    .eq("portrait_id", params.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Determine product type
  const isDigital = order?.product?.startsWith("digital");

  // Generate signed download URL for digital purchases (24h)
  let downloadUrl: string | null = null;
  if (portrait.paid && isDigital) {
    // Find the clean file in portraits-private
    const { data: files } = await supabase.storage
      .from("portraits-private")
      .list("clean", { search: params.id });

    const cleanFile = files?.find((f) => f.name.startsWith(params.id));
    if (cleanFile) {
      const { data: signed } = await supabase.storage
        .from("portraits-private")
        .createSignedUrl(`clean/${cleanFile.name}`, 86400); // 24 hours
      downloadUrl = signed?.signedUrl || null;
    }
  }

  return (
    <SuccessClient
      portrait={portrait}
      order={order}
      isDigital={isDigital || false}
      downloadUrl={downloadUrl}
    />
  );
}
