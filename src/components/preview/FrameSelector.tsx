"use client";

import { formatPrice } from "@/config/products";

export interface FrameData {
  id: string;
  name: string;
  price_cents: number;
  overlay_url: string | null;
}

export interface FrameSelection {
  id: string;
  name: string;
  priceCents: number;
  overlayUrl: string | null;
}

interface FrameSelectorProps {
  frames: FrameData[];
  selectedFrameId: string;
  onSelect: (frame: FrameSelection) => void;
}

// Display names in Dutch
const FRAME_DISPLAY: Record<string, { label: string; color: string }> = {
  geen: { label: "Geen kader", color: "transparent" },
  zwart_modern: { label: "Zwart Modern", color: "#1a1a1a" },
  wit_modern: { label: "Wit Modern", color: "#f5f5f5" },
  klassiek_goud: { label: "Klassiek Goud", color: "#B8942A" },
  klassiek_walnoot: { label: "Klassiek Walnoot", color: "#3D2B1F" },
  antiek_zilver: { label: "Antiek Zilver", color: "#C0C0C0" },
};

export default function FrameSelector({
  frames,
  selectedFrameId,
  onSelect,
}: FrameSelectorProps) {
  return (
    <div>
      <h3 className="font-heading font-semibold text-lg text-royal-brown mb-3">
        Kies een kader{" "}
        <span className="text-sm font-body font-normal text-royal-brown/50">
          (optioneel)
        </span>
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {frames.map((frame) => {
          const isSelected = selectedFrameId === frame.id;
          const display = FRAME_DISPLAY[frame.id] || {
            label: frame.name,
            color: "#888",
          };

          return (
            <button
              key={frame.id}
              onClick={() =>
                onSelect({
                  id: frame.id,
                  name: display.label,
                  priceCents: frame.price_cents,
                  overlayUrl: frame.overlay_url,
                })
              }
              aria-label={`${display.label}${frame.price_cents > 0 ? ` +${formatPrice(frame.price_cents)}` : " Gratis"}`}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all min-w-[80px]
                ${
                  isSelected
                    ? "border-royal-gold bg-royal-gold/5 shadow-md"
                    : "border-royal-brown/10 bg-white hover:border-royal-brown/30"
                }`}
            >
              {/* Color swatch */}
              <div
                className={`w-14 h-14 rounded-md border ${
                  frame.id === "geen"
                    ? "border-dashed border-royal-brown/20 flex items-center justify-center"
                    : "border-royal-brown/10"
                }`}
                style={
                  frame.id !== "geen"
                    ? { backgroundColor: display.color }
                    : undefined
                }
              >
                {frame.id === "geen" && (
                  <svg
                    className="w-6 h-6 text-royal-brown/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                )}
              </div>

              {/* Label */}
              <span className="text-xs font-body text-royal-brown/80 text-center leading-tight">
                {display.label}
              </span>

              {/* Price */}
              <span className="text-xs font-body text-royal-brown/50">
                {frame.price_cents > 0
                  ? `+${formatPrice(frame.price_cents)}`
                  : "Gratis"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
