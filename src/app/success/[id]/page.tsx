import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import SuccessClient from "./SuccessClient";

interface PageProps {
  params: { id: string };
}

// Force dynamic rendering — never cache this page
export const dynamic = "force-dynamic";

export default async function SuccessPage({ params }: PageProps) {
  const supabase = createAdminClient();

  // Fetch portrait
  const { data: portrait, error } = await supabase
    .from("portraits")
    .select("id, paid, image_url, style")
    .eq("id", params.id)
    .single();

  if (error || !portrait) return notFound();

  // Cache-bust the image URL to always show the latest version
  const imageUrl = portrait.image_url
    ? `${portrait.image_url}${portrait.image_url.includes("?") ? "&" : "?"}t=${Date.now()}`
    : null;

  // Fetch latest order for this portrait (with frame info)
  const { data: order } = await supabase
    .from("orders")
    .select("id, product, status, customer_email, frame_id, frame_price_cents, price_cents")
    .eq("portrait_id", params.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch frame name if selected
  let frameName: string | null = null;
  if (order?.frame_id) {
    const { data: frame } = await supabase
      .from("frames")
      .select("name")
      .eq("id", order.frame_id)
      .single();
    frameName = frame?.name || null;
  }

  // Determine product type
  const isDigital = order?.product?.startsWith("digital");

  // Generate signed download URL for digital purchases (24h)
  let downloadUrl: string | null = null;
  if (portrait.paid && isDigital) {
    // Clean files are stored directly as {id}.png
    const { data: signed } = await supabase.storage
      .from("portraits-private")
      .createSignedUrl(`${params.id}.png`, 86400); // 24 hours
    downloadUrl = signed?.signedUrl || null;
  }

  return (
    <SuccessClient
      portrait={{ ...portrait, image_url: imageUrl }}
      order={order ? { ...order, frameName } : null}
      isDigital={isDigital || false}
      downloadUrl={downloadUrl}
    />
  );
}
