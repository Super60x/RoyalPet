"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Style display names
const STYLE_NAMES: Record<string, string> = {
  baroque_military: "Barok Militair",
  renaissance_noble: "Renaissance Edelman",
  rococo_pastoral: "Rococo Pastoraal",
  flemish_master: "Vlaamse Meester",
};

interface SharePortrait {
  id: string;
  image_url: string;
  pet_name: string | null;
  style: string;
  share_count: number;
}

export default function ShareClient({
  portrait,
}: {
  portrait: SharePortrait;
}) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://royalpet.app/portret/${portrait.id}`;

  const petName = portrait.pet_name || "dit huisdier";
  const styleName =
    STYLE_NAMES[portrait.style] || portrait.style || "Renaissance";

  const shareText = `Kijk dit prachtige Renaissance portret van ${petName}! 🎨👑 Laat ook jouw huisdier vereeuwigen als meesterwerk op RoyalPet.app`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${shareText}\n\n${shareUrl}`
  )}`;

  const emailUrl = `mailto:?subject=${encodeURIComponent(
    `Renaissance portret van ${petName} 🎨`
  )}&body=${encodeURIComponent(`${shareText}\n\nBekijk het hier: ${shareUrl}`)}`;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#FAF8F3]">
      {/* Header */}
      <header className="text-center pt-8 pb-4 px-4">
        <Link href="/" className="inline-block">
          <h2 className="font-heading text-xl text-[#B8942A] tracking-widest uppercase">
            RoyalPet
          </h2>
        </Link>
      </header>

      {/* Portrait with ornate gold frame */}
      <section className="px-4 pb-6">
        <div className="max-w-lg mx-auto">
          {/* Ornate gold frame */}
          <div
            className="rounded-sm"
            style={{
              border: "14px solid #B8942A",
              boxShadow:
                "inset 0 0 0 2px #DAC06A, inset 0 0 0 5px #8B6D1F, inset 0 0 0 7px #DAC06A, 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px #6B5520",
              background:
                "linear-gradient(135deg, #C9A832 0%, #B8942A 25%, #9A7B1E 50%, #B8942A 75%, #C9A832 100%)",
              padding: "3px",
            }}
          >
            {/* Inner gold accent */}
            <div
              style={{
                border: "2px solid #DAC06A",
                padding: "0",
              }}
            >
              {/* Passe-partout mat */}
              <div className="p-4 bg-[#FAF5EC]">
                <div className="relative overflow-hidden shadow-inner">
                  <Image
                    src={portrait.image_url}
                    alt={`Renaissance portret van ${petName}`}
                    width={1024}
                    height={1536}
                    className="w-full h-auto block"
                    priority
                    sizes="(max-width: 768px) 90vw, 512px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pet name plate */}
          <div className="text-center mt-6 mb-2">
            {portrait.pet_name && (
              <h1 className="font-heading text-3xl md:text-4xl text-[#B8942A] mb-1">
                {portrait.pet_name}
              </h1>
            )}
            <p className="text-[#FAF8F3]/60 text-sm tracking-wider uppercase">
              {styleName} — door RoyalPet.app
            </p>
          </div>
        </div>
      </section>

      {/* Share buttons */}
      <section className="px-4 pb-8">
        <div className="max-w-sm mx-auto space-y-3">
          <p className="text-center text-[#FAF8F3]/50 text-sm mb-4">
            Deel dit meesterwerk
          </p>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#20BD5A] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Deel via WhatsApp
          </a>

          {/* Email */}
          <a
            href={emailUrl}
            className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-lg bg-[#3D2B1F] text-[#FAF8F3] font-medium hover:bg-[#5C3D2E] transition-colors border border-[#B8942A]/30"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Deel via e-mail
          </a>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-3 w-full py-3 px-6 rounded-lg font-medium transition-all border ${
              copied
                ? "bg-[#B8942A]/20 border-[#B8942A] text-[#B8942A]"
                : "bg-transparent border-[#FAF8F3]/20 text-[#FAF8F3]/70 hover:border-[#B8942A]/50 hover:text-[#FAF8F3]"
            }`}
          >
            {copied ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Link gekopieerd!
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Kopieer link
              </>
            )}
          </button>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-sm mx-auto px-4">
        <div className="border-t border-[#B8942A]/20" />
      </div>

      {/* CTA */}
      <section className="px-4 py-10 text-center">
        <h2 className="font-heading text-2xl md:text-3xl text-[#FAF8F3] mb-3">
          Vereeuwig ook uw huisdier
        </h2>
        <p className="text-[#FAF8F3]/60 mb-6 max-w-md mx-auto">
          Verander uw trouwe metgezel in een tijdloos Renaissance meesterwerk.
          Binnen 60 seconden klaar.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#B8942A] text-white font-medium rounded-lg hover:bg-[#9A7B1E] transition-colors shadow-lg shadow-[#B8942A]/20"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Maak uw portret — gratis proberen
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-[#FAF8F3]/30 text-xs">
        <p>&copy; {new Date().getFullYear()} RoyalPet.app — Alle rechten voorbehouden</p>
      </footer>
    </main>
  );
}
