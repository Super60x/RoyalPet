"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { formatPrice } from "@/config/products";
import PortraitHero from "@/components/preview/PortraitHero";
import { trackAdsConversion } from "@/components/Analytics";

// Product ID to readable label
function getProductLabel(productId: string): string {
  const labels: Record<string, string> = {
    fine_art_20x25: "Fine Art Print — 20x25cm",
    fine_art_30x40: "Fine Art Print — 30x40cm",
    fine_art_45x60: "Fine Art Print — 45x60cm",
    fine_art_60x90: "Fine Art Print — 60x90cm",
    canvas_30x40: "Canvas — 30x40cm",
    canvas_45x60: "Canvas — 45x60cm",
    canvas_60x90: "Canvas — 60x90cm",
    canvas_100x150: "Canvas — 100x150cm",
  };
  return labels[productId] || productId;
}

interface SuccessClientProps {
  portrait: {
    id: string;
    paid: boolean;
    image_url: string | null;
    style: string;
  };
  order: {
    id: string;
    product: string;
    status: string;
    customer_email: string;
    frame_id: string | null;
    frame_price_cents: number | null;
    price_cents: number;
    order_number: number | null;
    frameName: string | null;
    frameOverlayUrl: string | null;
  } | null;
}

export default function SuccessClient({
  portrait,
  order,
}: SuccessClientProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!portrait.paid || !order || tracked.current) return;
    tracked.current = true;

    const totalCents = (order.price_cents || 0) + (order.frame_price_cents || 0);
    trackAdsConversion({
      valueCents: totalCents,
      orderId: order.order_number
        ? `RP-${String(order.order_number).padStart(5, "0")}`
        : order.id,
      email: order.customer_email,
    });
  }, [portrait.paid, order]);

  if (!portrait.paid) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-heading font-bold text-royal-brown mb-4">
            Betaling niet gevonden
          </h1>
          <p className="font-body text-royal-brown/60 mb-6">
            We hebben nog geen betaling ontvangen voor dit portret.
            Als u net heeft betaald, kan het enkele seconden duren.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-royal-gold text-white rounded-lg font-body font-semibold hover:bg-royal-gold/90 transition-colors"
          >
            Pagina vernieuwen
          </button>
        </div>
      </main>
    );
  }

  const totalCents = (order?.price_cents || 0) + (order?.frame_price_cents || 0);

  return (
    <main className="min-h-screen px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-royal-brown mb-3">
          Bestelling ontvangen!
        </h1>

        <p className="text-base font-body text-royal-brown/60 mb-8">
          Uw portret wordt met zorg geprint en verzonden. U ontvangt een e-mail bij elke statuswijziging.
        </p>

        {/* Portrait preview with frame overlay */}
        {portrait.image_url && (
          <div className="max-w-xs mx-auto mb-8">
            <PortraitHero
              imageUrl={portrait.image_url}
              frameId={order?.frame_id || "geen"}
              frameOverlayUrl={order?.frameOverlayUrl || null}
            />
          </div>
        )}

        {/* Order summary */}
        {order && (
          <div className="mb-8 bg-royal-cream/50 rounded-lg p-5 border border-royal-brown/10 max-w-sm mx-auto">
            <h2 className="font-heading font-bold text-royal-brown mb-3 text-left">
              Uw bestelling
            </h2>
            <div className="space-y-2 text-sm font-body text-left">
              <div className="flex justify-between text-royal-brown/70">
                <span>{getProductLabel(order.product)}</span>
                <span>{formatPrice(order.price_cents)}</span>
              </div>
              {order.frameName && order.frame_price_cents && order.frame_price_cents > 0 && (
                <div className="flex justify-between text-royal-brown/70">
                  <span>Kader: {order.frameName}</span>
                  <span>+{formatPrice(order.frame_price_cents)}</span>
                </div>
              )}
              <div className="border-t border-royal-brown/10 pt-2 flex justify-between font-heading font-bold text-royal-brown">
                <span>Totaal</span>
                <span>{formatPrice(totalCents)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Print/canvas order info */}
        <div className="mb-8 bg-royal-cream/50 rounded-lg p-6 border border-royal-brown/10 text-left">
          <h2 className="font-heading font-bold text-lg text-royal-brown mb-3">
            Wat kunt u verwachten?
          </h2>
          <ul className="space-y-3 font-body text-sm text-royal-brown/70">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-royal-gold/20 text-royal-gold text-xs font-bold flex items-center justify-center mt-0.5">1</span>
              <span>Uw portret wordt met vakmanschap geprint op museumkwaliteit materiaal.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-royal-gold/20 text-royal-gold text-xs font-bold flex items-center justify-center mt-0.5">2</span>
              <span>U ontvangt een e-mail zodra uw bestelling in productie gaat.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-royal-gold/20 text-royal-gold text-xs font-bold flex items-center justify-center mt-0.5">3</span>
              <span>Verwachte levertijd: <strong>7-9 werkdagen</strong> na productie.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-royal-gold/20 text-royal-gold text-xs font-bold flex items-center justify-center mt-0.5">4</span>
              <span>Bij verzending ontvangt u een track &amp; trace code.</span>
            </li>
          </ul>
        </div>

        {/* Order reference */}
        {order && (
          <p className="text-xs font-body text-royal-brown/40 mb-6">
            Ordernummer: {order.order_number ? `RP-${String(order.order_number).padStart(5, "0")}` : order.id} | Bevestiging verstuurd naar {order.customer_email}
          </p>
        )}

        {/* CTA: Share + Make another */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/portret/${portrait.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-royal-gold text-white rounded-lg font-body font-semibold hover:bg-royal-gold/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Deel dit portret
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-royal-brown/5 text-royal-brown rounded-lg font-body font-medium hover:bg-royal-brown/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Maak nog een meesterwerk
          </Link>
        </div>
      </div>
    </main>
  );
}
