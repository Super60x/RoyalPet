import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ShareClient from "./ShareClient";
import type { Metadata } from "next";

interface SharePageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const supabase = createAdminClient();
  const { data: portrait } = await supabase
    .from("portraits")
    .select("id, image_url, pet_name, style")
    .eq("id", params.id)
    .single();

  if (!portrait) return {};

  const title = portrait.pet_name
    ? `${portrait.pet_name} — Renaissance Meesterwerk | RoyalPet`
    : "Renaissance Huisdierportret | RoyalPet";

  const description = portrait.pet_name
    ? `Bewonder het prachtige Renaissance portret van ${portrait.pet_name}. Vereeuwig ook uw huisdier als edelman!`
    : "Bewonder dit prachtige AI-gegenereerd Renaissance huisdierportret. Vereeuwig ook uw huisdier!";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: portrait.image_url,
          width: 1024,
          height: 1536,
          alt: title,
        },
      ],
      type: "website",
      siteName: "RoyalPet.app",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [portrait.image_url],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const supabase = createAdminClient();

  const { data: portrait, error } = await supabase
    .from("portraits")
    .select("id, image_url, pet_name, style, share_count")
    .eq("id", params.id)
    .single();

  if (error || !portrait) {
    notFound();
  }

  // Increment share_count (fire-and-forget, don't block render)
  supabase
    .from("portraits")
    .update({ share_count: (portrait.share_count || 0) + 1 })
    .eq("id", params.id)
    .then(() => {});

  return <ShareClient portrait={portrait} />;
}
