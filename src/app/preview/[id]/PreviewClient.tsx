"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import GenerationProgress from "@/components/upload/GenerationProgress";
import RetryPanel from "@/components/preview/RetryPanel";

interface PortraitData {
  id: string;
  status: string;
  image_url: string | null;
  style: string;
  retry_count: number;
}

interface PreviewClientProps {
  portrait: PortraitData;
}

export default function PreviewClient({ portrait: initialPortrait }: PreviewClientProps) {
  const [portrait, setPortrait] = useState(initialPortrait);
  const [isRegenerating, setIsRegenerating] = useState(
    initialPortrait.status !== "completed" && initialPortrait.status !== "failed"
  );
  const [showRetry, setShowRetry] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetryStart = useCallback(() => {
    setShowRetry(false);
    setIsRegenerating(true);
    setError(null);
    setPortrait((prev) => ({ ...prev, retry_count: prev.retry_count + 1 }));
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      const res = await fetch(`/api/generate/status?id=${portrait.id}`);
      const data = await res.json();
      if (data.status === "completed" && data.image_url) {
        setPortrait((prev) => ({
          ...prev,
          status: "completed",
          image_url: data.image_url,
        }));
      }
    } catch {
      window.location.reload();
    }
    setIsRegenerating(false);
  }, [portrait.id]);

  const handleGenerationError = useCallback((message: string) => {
    setIsRegenerating(false);
    setError(message);
  }, []);

  // Still generating (initial or retry)
  if (isRegenerating) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-royal-brown mb-2">
              {portrait.retry_count > 0
                ? "Nieuw portret wordt gegenereerd"
                : "Uw portret wordt geschilderd"}
            </h1>
            <p className="text-base font-body text-royal-brown/60">
              Even geduld, de hofschilder is aan het werk...
            </p>
          </div>
          <GenerationProgress
            portraitId={portrait.id}
            onComplete={handleComplete}
            onError={handleGenerationError}
          />
        </div>
      </main>
    );
  }

  // Completed — show portrait with retry overlay
  return (
    <main className="min-h-screen px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-royal-brown mb-2">
            Uw Renaissance Meesterwerk
          </h1>
          <p className="text-base font-body text-royal-brown/60">
            Een waardig portret van uw trouwe metgezel
          </p>
        </div>

        {/* Portrait image with retry overlay */}
        <div className="relative max-w-lg mx-auto mb-8">
          {portrait.image_url && (
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl border-4 border-royal-brown/10">
              <Image
                src={portrait.image_url}
                alt="Renaissance portret van uw huisdier"
                fill
                className="object-cover"
                priority
              />

              {/* Dark overlay when retry panel is open */}
              {showRetry && (
                <div className="absolute inset-0 bg-black/60 z-10" />
              )}
            </div>
          )}

          {/* Retry overlay panel — positioned over the portrait */}
          {showRetry && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
              <RetryPanel
                portraitId={portrait.id}
                currentStyle={portrait.style}
                retryCount={portrait.retry_count}
                onRetryStart={handleRetryStart}
                onClose={() => setShowRetry(false)}
                onError={(msg) => { setShowRetry(false); setError(msg); }}
              />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm font-body text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Retry/Edit button (below portrait, opens overlay) */}
        {!showRetry && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowRetry(true)}
              className="inline-flex items-center gap-2 bg-royal-brown/10 text-royal-brown font-body font-medium px-5 py-2.5 rounded-lg hover:bg-royal-brown/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Opnieuw proberen of bewerken
              {portrait.retry_count < 1 && (
                <span className="text-xs bg-royal-gold/20 text-royal-gold px-2 py-0.5 rounded-full">
                  1 gratis
                </span>
              )}
            </button>
          </div>
        )}

        {/* Placeholder for Sessie 3: product selector, frame selector, pricing */}
        <div className="text-center">
          <p className="text-sm font-body text-royal-brown/40">
            Product- en kaderselectie wordt binnenkort toegevoegd
          </p>
        </div>
      </div>
    </main>
  );
}
