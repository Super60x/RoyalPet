"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/config/products";

// Product ID to readable label
function getProductLabel(productId: string): string {
  const labels: Record<string, string> = {
    digital: "Digitale Download — High-res",
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
    frameName: string | null;
  } | null;
  isDigital: boolean;
  downloadUrl: string | null;
}

export default function SuccessClient({
  portrait,
  order,
  isDigital,
  downloadUrl,
}: SuccessClientProps) {
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
          {isDigital ? "Uw meesterwerk is gereed!" : "Bestelling ontvangen!"}
        </h1>

        <p className="text-base font-body text-royal-brown/60 mb-8">
          {isDigital
            ? "Uw Renaissance portret is klaar om te downloaden."
            : "Uw portret wordt met zorg geprint en verzonden. U ontvangt een e-mail bij elke statuswijziging."}
        </p>

        {/* Portrait preview */}
        {portrait.image_url && (
          <div className="relative w-64 mx-auto mb-8 rounded-lg overflow-hidden shadow-xl border-4 border-royal-gold/30">
            <div className="aspect-[2/3]">
              <Image
                src={portrait.image_url}
                alt="Uw Renaissance portret"
                fill
                className="object-cover"
                sizes="256px"
              />
            </div>
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

        {/* Digital download button */}
        {isDigital && downloadUrl && (
          <div className="mb-8">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-2 px-8 py-4 bg-royal-gold text-white rounded-lg font-body font-semibold text-lg hover:bg-royal-gold/90 active:scale-[0.98] transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download portret (High-res)
            </a>
            <p className="mt-2 text-xs font-body text-royal-brown/40">
              Link geldig voor 24 uur. Een kopie is ook per e-mail verstuurd.
            </p>
          </div>
        )}

        {/* Print/canvas order info */}
        {!isDigital && (
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
        )}

        {/* Order reference */}
        {order && (
          <p className="text-xs font-body text-royal-brown/40 mb-6">
            Ordernummer: {order.id} | Bevestiging verstuurd naar {order.customer_email}
          </p>
        )}

        {/* CTA: Make another */}
        <div className="space-y-3">
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
