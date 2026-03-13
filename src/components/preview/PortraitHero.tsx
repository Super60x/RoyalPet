"use client";

import Image from "next/image";

interface PortraitHeroProps {
  imageUrl: string;
  frameOverlayUrl: string | null;
  showRetryOverlay?: boolean;
  children?: React.ReactNode; // For retry panel overlay
}

export default function PortraitHero({
  imageUrl,
  frameOverlayUrl,
  showRetryOverlay = false,
  children,
}: PortraitHeroProps) {
  return (
    <div className="relative max-w-lg mx-auto">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl border-4 border-royal-brown/10">
        {/* Portrait image */}
        <Image
          src={imageUrl}
          alt="Renaissance portret van uw huisdier"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 90vw, 512px"
        />

        {/* Frame overlay */}
        {frameOverlayUrl && (
          <Image
            src={frameOverlayUrl}
            alt="Kader preview"
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 90vw, 512px"
          />
        )}

        {/* Dark overlay for retry panel */}
        {showRetryOverlay && (
          <div className="absolute inset-0 bg-black/60 z-10" />
        )}
      </div>

      {/* Retry panel overlay (children) */}
      {children}
    </div>
  );
}
