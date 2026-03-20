"use client";

import { useState, useEffect } from "react";
import { CREDIT_PACKS } from "@/config/credit-packs";
import StyleSelector from "./StyleSelector";

interface RetryPanelProps {
  portraitId: string;
  currentStyle: string;
  retryCount: number;
  onRetryStart: () => void;
  onClose: () => void;
  onError: (message: string) => void;
}

export default function RetryPanel({
  portraitId,
  currentStyle,
  retryCount,
  onRetryStart,
  onClose,
  onError,
}: RetryPanelProps) {
  const [showStyles, setShowStyles] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(currentStyle);
  const [gender, setGender] = useState<string | null>(null);
  const [customEdit, setCustomEdit] = useState("");
  const [pose, setPose] = useState<"laying_down" | "standing">("laying_down");
  const [colorPreference, setColorPreference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [credits, setCredits] = useState(0);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [creditEmail, setCreditEmail] = useState("");
  const [buyingPack, setBuyingPack] = useState<string | null>(null);
  const [creditError, setCreditError] = useState<string | null>(null);

  // Credits are the primary currency. Free first retry is a fallback only when no credits.
  const isFirstRetry = retryCount === 0;
  const hasFreeRetry = isFirstRetry && credits === 0;
  const canRetry = credits > 0 || hasFreeRetry;

  // Fetch credits on mount
  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setCredits(data.credits || 0))
      .catch(() => {});
  }, []);

  const retryLabel = credits > 0
    ? `${credits} credit${credits !== 1 ? "s" : ""} — 1 wordt gebruikt`
    : hasFreeRetry
      ? "1 gratis retry beschikbaar"
      : "Geen credits — koop credits om te bewerken";

  async function handleBuyCredits(packId: string) {
    setCreditError(null);
    if (!creditEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creditEmail)) {
      setCreditError("Vul een geldig e-mailadres in.");
      return;
    }
    setBuyingPack(packId);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, email: creditEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setCreditError(err instanceof Error ? err.message : "Aankoop mislukt.");
      setBuyingPack(null);
    }
  }

  async function handleRetry() {
    if (!canRetry) {
      setShowBuyCredits(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/generate/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portrait_id: portraitId,
          style: selectedStyle,
          gender,
          pose,
          color_preference: colorPreference || undefined,
          custom_edit: customEdit || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error || "Er ging iets mis. Probeer het opnieuw.");
        setIsSubmitting(false);
        return;
      }

      onRetryStart();
    } catch {
      onError("Verbinding mislukt. Probeer het opnieuw.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[#1a1a1a] backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden text-white max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div>
          <h3 className="font-heading text-lg font-bold">Opnieuw proberen</h3>
          <p className="text-xs text-white/50">
            {retryLabel}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Top row: Retry + Upload New */}
        <div className="flex gap-2">
          <button
            onClick={handleRetry}
            disabled={!canRetry || isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-body font-semibold px-4 py-3 rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Opnieuw
            {hasFreeRetry && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">Gratis</span>
            )}
          </button>
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white font-body font-medium px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div className="text-left">
              <span className="block text-sm font-semibold">Nieuwe foto</span>
              <span className="block text-[10px] text-white/50">Voor betere gelijkenis</span>
            </div>
          </a>
        </div>

        {/* Change Style — collapsible */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => { setShowStyles(!showStyles); setShowEdit(false); setShowColor(false); }}
            className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
              <div className="text-left">
                <span className="block text-sm font-semibold">Stijl wijzigen</span>
                <span className="block text-[10px] text-white/50">Probeer een andere kunststijl</span>
              </div>
            </div>
            <svg className={`w-4 h-4 text-white/40 transition-transform ${showStyles ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {showStyles && (
            <div className="p-3 pt-0">
              <StyleSelector
                currentStyle={selectedStyle}
                onSelect={(id) => setSelectedStyle(id)}
                darkMode
              />
            </div>
          )}
        </div>

        {/* Divider text */}
        <p className="text-xs text-white/30 text-center">of bewerk uw portret</p>

        {/* Pose toggle — standing checkbox */}
        <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={pose === "standing"}
            onChange={(e) => setPose(e.target.checked ? "standing" : "laying_down")}
            className="w-4 h-4 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0"
          />
          <div>
            <span className="block text-sm font-semibold">Staand portret</span>
            <span className="block text-[10px] text-white/50">Pet staat op alle vier de poten</span>
          </div>
        </label>

        {/* Gender toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setGender(gender === "masculine" ? null : "masculine")}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border font-body font-medium transition-colors ${
              gender === "masculine"
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                : "border-white/10 text-white/70 hover:bg-white/5"
            }`}
          >
            <span className="text-lg">&#9794;</span>
            Mannelijk
          </button>
          <button
            onClick={() => setGender(gender === "feminine" ? null : "feminine")}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border font-body font-medium transition-colors ${
              gender === "feminine"
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                : "border-white/10 text-white/70 hover:bg-white/5"
            }`}
          >
            <span className="text-lg">&#9792;</span>
            Vrouwelijk
          </button>
        </div>

        {/* Color preference — collapsible */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => { setShowColor(!showColor); setShowStyles(false); setShowEdit(false); }}
            className="w-full flex items-center gap-2 p-3 hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
            </svg>
            <div className="text-left">
              <span className="block text-sm font-semibold">Kleur aanpassen</span>
              <span className="block text-[10px] text-white/50">Verander kleding- en achtergrondkleuren</span>
            </div>
          </button>
          {showColor && (
            <div className="p-3 pt-0">
              <input
                type="text"
                value={colorPreference}
                onChange={(e) => setColorPreference(e.target.value)}
                maxLength={100}
                placeholder="bijv. bordeauxrood, marineblauw, smaragdgroen..."
                className="w-full rounded-lg bg-white/10 border border-white/10 p-3 font-body text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
              <p className="text-[10px] text-white/30 mt-1">
                {colorPreference.length}/100 tekens
              </p>
            </div>
          )}
        </div>

        {/* Custom edit — collapsible */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => { setShowEdit(!showEdit); setShowStyles(false); setShowColor(false); }}
            className="w-full flex items-center gap-2 p-3 hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <div className="text-left">
              <span className="block text-sm font-semibold">Eigen aanpassing</span>
              <span className="block text-[10px] text-white/50">Verander kleuren, voeg details toe, etc.</span>
            </div>
          </button>
          {showEdit && (
            <div className="p-3 pt-0">
              <textarea
                value={customEdit}
                onChange={(e) => setCustomEdit(e.target.value)}
                maxLength={200}
                rows={2}
                placeholder="bijv. voeg een gouden kroon toe, verwijder de kraag..."
                className="w-full rounded-lg bg-white/10 border border-white/10 p-3 font-body text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
              />
              <p className="text-[10px] text-white/30 mt-1">
                {customEdit.length}/200 tekens
              </p>
            </div>
          )}
        </div>

        {!canRetry && !isFirstRetry && !showBuyCredits && (
          <div className="text-center">
            <button
              onClick={() => setShowBuyCredits(true)}
              className="text-xs text-emerald-400 hover:underline"
            >
              Koop credits voor meer retries →
            </button>
          </div>
        )}

        {showBuyCredits && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
            <h4 className="text-sm font-semibold text-white">Credits kopen</h4>
            <input
              type="email"
              value={creditEmail}
              onChange={(e) => { setCreditEmail(e.target.value); setCreditError(null); }}
              placeholder="uw@email.nl"
              className={`w-full rounded-lg bg-white/10 border px-3 py-2 font-body text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 ${
                creditError ? "border-red-500" : "border-white/10"
              }`}
            />
            {creditError && (
              <p className="text-xs text-red-400 mt-1">{creditError}</p>
            )}
            <div className="space-y-2">
              {CREDIT_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => handleBuyCredits(pack.id)}
                  disabled={buyingPack !== null}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 hover:border-emerald-500/50 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  <div className="text-left">
                    <span className="block text-sm font-semibold">{pack.label}</span>
                    <span className="block text-[10px] text-white/50">{pack.perGenLabel}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400">
                      €{(pack.priceCents / 100).toFixed(2).replace(".", ",")}
                    </span>
                    {pack.badge && (
                      <span className="block text-[9px] text-emerald-400/70">{pack.badge}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
