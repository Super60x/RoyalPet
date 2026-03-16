"use client";

import Image from "next/image";

// CSS-based frame styles with passe-partout effect
// Structure: outer frame border → cream mat → image
const FRAME_STYLES: Record<
  string,
  { frame: React.CSSProperties; mat: boolean }
> = {
  geen: { frame: {}, mat: false },
  zwart_modern: {
    frame: {
      border: "10px solid #1a1a1a",
      boxShadow: "inset 0 0 0 1px #333, 0 4px 24px rgba(0,0,0,0.35)",
    },
    mat: true,
  },
  wit_modern: {
    frame: {
      border: "10px solid #f5f5f5",
      boxShadow: "inset 0 0 0 1px #e0e0e0, 0 4px 20px rgba(0,0,0,0.12)",
    },
    mat: true,
  },
  klassiek_goud: {
    frame: {
      border: "12px solid #B8942A",
      boxShadow:
        "inset 0 0 0 2px #DAC06A, inset 0 0 0 4px #8B6D1F, 0 4px 24px rgba(0,0,0,0.35)",
    },
    mat: true,
  },
  klassiek_walnoot: {
    frame: {
      border: "12px solid #3D2B1F",
      boxShadow:
        "inset 0 0 0 2px #5C3D2E, inset 0 0 0 4px #2A1A10, 0 4px 24px rgba(0,0,0,0.35)",
    },
    mat: true,
  },
  antiek_zilver: {
    frame: {
      border: "12px solid #C0C0C0",
      boxShadow:
        "inset 0 0 0 2px #D8D8D8, inset 0 0 0 4px #A0A0A0, 0 4px 24px rgba(0,0,0,0.25)",
    },
    mat: true,
  },
};

interface PortraitHeroProps {
  imageUrl: string;
  frameId: string;
  frameOverlayUrl: string | null;
  showRetryOverlay?: boolean;
  children?: React.ReactNode;
}

export default function PortraitHero({
  imageUrl,
  frameId,
  frameOverlayUrl,
  showRetryOverlay = false,
  children,
}: PortraitHeroProps) {
  const frameConfig = FRAME_STYLES[frameId] || FRAME_STYLES.geen;
  const hasOverlayPng = !!frameOverlayUrl;
  const hasCssFrame = frameId !== "geen" && !hasOverlayPng;

  return (
    <div className="relative max-w-lg mx-auto">
      {/* Outer frame */}
      <div
        className={`transition-all duration-300 ${
          hasCssFrame ? "rounded-sm" : ""
        }`}
        style={hasCssFrame ? frameConfig.frame : undefined}
      >
        {/* Passe-partout mat (cream border inside the frame) */}
        <div
          className={hasCssFrame && frameConfig.mat ? "p-4 bg-[#FAF5EC]" : ""}
        >
          {/* Image container */}
          <div
            className={`relative overflow-hidden ${
              hasCssFrame
                ? "shadow-inner"
                : "rounded-lg border-4 border-royal-brown/10 shadow-xl"
            }`}
          >
            {/* Portrait image — natural aspect ratio */}
            <Image
              src={imageUrl}
              alt="Renaissance portret van uw huisdier"
              width={1024}
              height={1536}
              className="w-full h-auto block"
              priority
              sizes="(max-width: 768px) 90vw, 512px"
            />

            {/* Frame overlay PNG (when real PNGs exist) */}
            {hasOverlayPng && (
              <div className="absolute inset-0">
                <Image
                  src={frameOverlayUrl}
                  alt="Kader preview"
                  fill
                  className="object-cover pointer-events-none"
                  sizes="(max-width: 768px) 90vw, 512px"
                />
              </div>
            )}

            {/* Dark overlay for retry panel */}
            {showRetryOverlay && (
              <div className="absolute inset-0 bg-black/60 z-10" />
            )}
          </div>
        </div>
      </div>

      {/* Retry panel overlay (children) */}
      {children}
    </div>
  );
}
