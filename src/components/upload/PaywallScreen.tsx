"use client";

import { useState } from "react";
import { CREDIT_PACKS, type CreditPack } from "@/config/credit-packs";
import { formatPrice } from "@/config/products";

interface PaywallScreenProps {
  lastPortraitId?: string | null;
}

export default function PaywallScreen({ lastPortraitId }: PaywallScreenProps) {
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!selectedPack) return;

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Voer een geldig e-mailadres in.");
      return;
    }

    setLoading(true);
    setEmailError(null);

    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: selectedPack.id, email: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      window.location.href = data.url;
    } catch (err) {
      setLoading(false);
      alert(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <svg className="mx-auto h-14 w-14 text-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.09 4.26L19 8.27l-3.5 3.41.82 4.82L12 14.4l-4.32 2.1.82-4.82L5 8.27l4.91-1.01L12 3z" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-royal-brown mb-2">
          Uw gratis portret is gebruikt
        </h2>
        <p className="text-sm font-body text-royal-brown/60">
          Koop credits om meer meesterwerken te genereren van uw trouwe metgezel.
        </p>
      </div>

      {/* Quick CTA: buy existing portrait */}
      {lastPortraitId && (
        <div className="text-center mb-6">
          <a
            href={`/preview/${lastPortraitId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-royal-brown/5 text-royal-brown rounded-lg font-body text-sm font-medium hover:bg-royal-brown/10 transition-colors"
          >
            Al een mooi portret? Koop het direct
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 border-t border-royal-brown/10" />
        <span className="text-xs font-body text-royal-brown/40 whitespace-nowrap">
          of genereer meer portretten
        </span>
        <div className="flex-1 border-t border-royal-brown/10" />
      </div>

      {/* Credit Pack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {CREDIT_PACKS.map((pack) => (
          <button
            key={pack.id}
            onClick={() => setSelectedPack(pack)}
            className={`relative rounded-xl border-2 p-5 text-center transition-all
              ${selectedPack?.id === pack.id
                ? "border-royal-gold bg-royal-gold/5 shadow-lg"
                : "border-royal-brown/15 bg-white hover:border-royal-gold/50"
              }`}
          >
            {/* Badge */}
            {pack.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-royal-gold text-white text-xs font-body font-semibold rounded-full whitespace-nowrap">
                {pack.badge}
              </span>
            )}

            {/* Credits count */}
            <div className="text-4xl font-heading font-bold text-royal-brown mb-1">
              {pack.credits}
            </div>
            <div className="text-sm font-body text-royal-brown/60 mb-3">
              {pack.label}
            </div>

            {/* Price */}
            <div className="text-2xl font-heading font-bold text-royal-brown mb-1">
              {formatPrice(pack.priceCents)}
            </div>
            <div className="text-xs font-body text-royal-brown/50">
              {pack.perGenLabel}
            </div>

            {/* Selection indicator */}
            {selectedPack?.id === pack.id && (
              <div className="mt-3">
                <div className="inline-flex items-center gap-1 text-xs font-body text-royal-gold font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Geselecteerd
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Email + Purchase CTA (appears after pack selection) */}
      {selectedPack && (
        <div className="bg-royal-cream/50 rounded-xl border border-royal-brown/10 p-6 mb-8">
          <p className="text-sm font-body text-royal-brown/70 mb-3 text-center">
            Voer uw e-mailadres in — dit is uw sleutel tot uw tegoed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              placeholder="uw@email.nl"
              autoComplete="email"
              className="flex-1 px-4 py-3 rounded-lg border border-royal-brown/20 font-body text-royal-brown
                placeholder:text-royal-brown/30 focus:outline-none focus:ring-2 focus:ring-royal-gold/50 focus:border-royal-gold"
            />
            <button
              onClick={handlePurchase}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-body font-semibold text-white transition-all min-h-[48px] whitespace-nowrap
                ${loading
                  ? "bg-royal-gold/60 cursor-wait"
                  : "bg-royal-gold hover:bg-royal-gold/90 active:scale-[0.98] shadow-lg"
                }`}
            >
              {loading ? "Doorsturen..." : `Koop ${selectedPack.label}`}
            </button>
          </div>
          {emailError && (
            <p className="mt-2 text-sm font-body text-red-600 text-center">{emailError}</p>
          )}
        </div>
      )}

      {/* Existing credits? Reclaim */}
      <div className="text-center mb-10">
        <ReclaimCredits />
      </div>

      {/* Social Proof */}
      <SocialProofSection />

      {/* Mini FAQ */}
      <div className="mt-10 max-w-lg mx-auto">
        <h3 className="font-heading font-bold text-royal-brown text-center mb-4">
          Veelgestelde vragen
        </h3>
        <div className="space-y-3">
          <FaqItem
            question="Wat als ik mijn cookies verwijder?"
            answer="Geen zorgen — uw tegoed is gekoppeld aan uw e-mailadres, niet aan uw browser. Voer uw e-mail opnieuw in om uw credits te herstellen."
          />
          <FaqItem
            question="Hoe lang zijn mijn credits geldig?"
            answer="Uw credits zijn 1 jaar geldig vanaf aankoop."
          />
          <FaqItem
            question="Kan ik retries doen met credits?"
            answer="Ja! Uw eerste retry is gratis. Daarna kost elke retry 1 credit."
          />
        </div>
      </div>
    </div>
  );
}

// --- Reclaim credits by email ---
function ReclaimCredits() {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "none">("idle");
  const [credits, setCredits] = useState(0);

  const handleCheck = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/credits/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (data.credits > 0) {
        setCredits(data.credits);
        setStatus("success");
        // Reload after short delay so cookie is set and page refreshes
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setStatus("none");
      }
    } catch {
      setStatus("none");
    }
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="text-xs font-body text-royal-gold hover:underline"
      >
        Al credits gekocht? Herstel uw tegoed
      </button>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="uw@email.nl"
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-royal-brown/20 font-body"
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        />
        <button
          onClick={handleCheck}
          disabled={status === "loading"}
          className="px-4 py-2 text-sm rounded-lg bg-royal-brown/10 font-body font-medium text-royal-brown hover:bg-royal-brown/20 transition-colors"
        >
          {status === "loading" ? "..." : "Controleer"}
        </button>
      </div>
      {status === "success" && (
        <p className="mt-2 text-sm font-body text-green-600">
          {credits} credit(s) gevonden! Pagina wordt herladen...
        </p>
      )}
      {status === "none" && (
        <p className="mt-2 text-sm font-body text-royal-brown/50">
          Geen credits gevonden voor dit e-mailadres.
        </p>
      )}
    </div>
  );
}

// --- Social Proof Section ---
function SocialProofSection() {
  const testimonials = [
    {
      text: "Mijn Max hangt nu als edelman boven de schouw!",
      name: "Sandra",
      city: "Amsterdam",
    },
    {
      text: "Binnen 2 minuten het mooiste portret van Luna. Perfect op canvas.",
      name: "Erik",
      city: "Antwerpen",
    },
    {
      text: "Perfect cadeau voor mijn moeder. Ze was sprakeloos toen ze het zag.",
      name: "Lisa",
      city: "Rotterdam",
    },
  ];

  return (
    <div className="bg-royal-cream/30 rounded-xl border border-royal-brown/10 p-6">
      {/* Stat */}
      <div className="text-center mb-6">
        <div className="text-2xl font-heading font-bold text-royal-brown mb-1">
          +500 klanten kozen voor canvas
        </div>
        <div className="flex items-center justify-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} className="w-5 h-5 text-royal-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-royal-brown/5">
            <p className="text-sm font-body text-royal-brown/80 italic mb-3">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-3 h-3 text-royal-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-body text-royal-brown/50">
                {t.name}, {t.city}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FAQ Item ---
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-royal-brown/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-body font-medium text-royal-brown">{question}</span>
        <svg
          className={`w-4 h-4 text-royal-brown/40 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-3">
          <p className="text-sm font-body text-royal-brown/60">{answer}</p>
        </div>
      )}
    </div>
  );
}
