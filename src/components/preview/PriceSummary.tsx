"use client";

import { useState } from "react";
import { formatPrice } from "@/config/products";

interface PriceSummaryProps {
  productLabel: string | null;
  productPriceCents: number;
  frameLabel: string;
  framePriceCents: number;
  portraitId: string;
  disabled: boolean;
}

export default function PriceSummary({
  productLabel,
  productPriceCents,
  frameLabel,
  framePriceCents,
  portraitId,
  disabled,
}: PriceSummaryProps) {
  const [showToast, setShowToast] = useState(false);
  const totalCents = productPriceCents + framePriceCents;

  const handleCheckout = () => {
    // Store selection in localStorage for now (Stripe checkout in later session)
    const selection = {
      portraitId,
      productLabel,
      productPriceCents,
      frameLabel,
      framePriceCents,
      totalCents,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      `royalpet_selection_${portraitId}`,
      JSON.stringify(selection)
    );

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      {/* Desktop: inline summary */}
      <div className="hidden md:block">
        <PriceContent
          productLabel={productLabel}
          productPriceCents={productPriceCents}
          frameLabel={frameLabel}
          framePriceCents={framePriceCents}
          totalCents={totalCents}
          disabled={disabled}
          onCheckout={handleCheckout}
        />
      </div>

      {/* Mobile: sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-sm border-t border-royal-brown/10 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div aria-live="polite">
            {!disabled ? (
              <div className="font-heading font-bold text-2xl text-royal-brown">
                {formatPrice(totalCents)}
              </div>
            ) : (
              <div className="text-sm font-body text-royal-brown/50">
                Kies een product
              </div>
            )}
          </div>
          <button
            onClick={handleCheckout}
            disabled={disabled}
            className={`px-6 py-3 rounded-lg font-body font-semibold text-white transition-all min-h-[48px]
              ${
                disabled
                  ? "bg-royal-brown/20 cursor-not-allowed"
                  : "bg-royal-gold hover:bg-royal-gold/90 active:scale-[0.98] shadow-lg"
              }`}
          >
            Bestel uw meesterwerk
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-royal-brown text-white px-6 py-3 rounded-lg shadow-xl font-body text-sm animate-fade-in">
          Selectie opgeslagen! Betaling wordt binnenkort beschikbaar.
        </div>
      )}
    </>
  );
}

// Shared price content (used inline on desktop)
function PriceContent({
  productLabel,
  productPriceCents,
  frameLabel,
  framePriceCents,
  totalCents,
  disabled,
  onCheckout,
}: {
  productLabel: string | null;
  productPriceCents: number;
  frameLabel: string;
  framePriceCents: number;
  totalCents: number;
  disabled: boolean;
  onCheckout: () => void;
}) {
  return (
    <div className="bg-royal-cream/50 rounded-lg p-4 border border-royal-brown/10">
      {!disabled ? (
        <div className="space-y-2 mb-4" aria-live="polite">
          <div className="flex justify-between text-sm font-body text-royal-brown/70">
            <span>{productLabel}</span>
            <span>{formatPrice(productPriceCents)}</span>
          </div>
          {framePriceCents > 0 && (
            <div className="flex justify-between text-sm font-body text-royal-brown/70">
              <span>{frameLabel}</span>
              <span>+{formatPrice(framePriceCents)}</span>
            </div>
          )}
          <div className="border-t border-royal-brown/10 pt-2 flex justify-between">
            <span className="font-heading font-bold text-lg text-royal-brown">
              Totaal
            </span>
            <span className="font-heading font-bold text-lg text-royal-brown">
              {formatPrice(totalCents)}
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-center text-sm font-body text-royal-brown/50">
          Kies hierboven een product om de prijs te zien
        </div>
      )}

      <button
        onClick={onCheckout}
        disabled={disabled}
        className={`w-full py-3.5 rounded-lg font-body font-semibold text-white transition-all min-h-[48px]
          ${
            disabled
              ? "bg-royal-brown/20 cursor-not-allowed"
              : "bg-royal-gold hover:bg-royal-gold/90 active:scale-[0.98] shadow-lg"
          }`}
      >
        Bestel uw meesterwerk
      </button>
    </div>
  );
}
