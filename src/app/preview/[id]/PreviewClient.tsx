"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import GenerationProgress from "@/components/upload/GenerationProgress";
import RetryPanel from "@/components/preview/RetryPanel";
import PortraitHero from "@/components/preview/PortraitHero";
import ProductSelector, {
  type ProductSelection,
} from "@/components/preview/ProductSelector";
import FrameSelector, {
  type FrameData,
  type FrameSelection,
} from "@/components/preview/FrameSelector";
import PriceSummary from "@/components/preview/PriceSummary";
import SocialProof from "@/components/preview/SocialProof";
import { trackViewItem, trackAddToCart, trackEmailCaptured } from "@/components/Analytics";

interface PortraitData {
  id: string;
  status: string;
  image_url: string | null;
  style: string;
  retry_count: number;
}

interface PreviewClientProps {
  portrait: PortraitData;
  frames: FrameData[];
}

export default function PreviewClient({
  portrait: initialPortrait,
  frames,
}: PreviewClientProps) {
  const [portrait, setPortrait] = useState(initialPortrait);
  const [isRegenerating, setIsRegenerating] = useState(
    initialPortrait.status !== "completed" && initialPortrait.status !== "failed"
  );
  const [showRetry, setShowRetry] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Credits
  const [credits, setCredits] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setCredits(data.credits || 0))
      .catch(() => {});
  }, []);

  // GA4: track view_item when portrait is completed
  const viewTracked = useRef(false);
  useEffect(() => {
    if (portrait.status === "completed" && portrait.image_url && !viewTracked.current) {
      viewTracked.current = true;
      trackViewItem({ itemId: portrait.id, itemName: "Renaissance Portret", priceCents: 8900 });
    }
  }, [portrait.status, portrait.image_url, portrait.id]);

  // Product + Frame selection state
  const [selectedProduct, setSelectedProduct] =
    useState<ProductSelection | null>(null);

  // Default frame: "geen" (first in list, price 0)
  const geenFrame = frames.find((f) => f.id === "geen");
  const noFrame: FrameSelection = {
    id: geenFrame?.id || "geen",
    name: "Geen kader",
    priceCents: 0,
    overlayUrl: null,
  };
  const [selectedFrame, setSelectedFrame] = useState<FrameSelection>(noFrame);

  // Download state
  const [downloadEmail, setDownloadEmail] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleProductSelect = useCallback(
    (product: ProductSelection) => {
      setSelectedProduct(product);
      trackAddToCart({ itemId: product.sizeId, itemName: product.sizeLabel, priceCents: product.priceCents });
    },
    []
  );

  const handleFreeDownload = async () => {
    if (!downloadEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(downloadEmail)) {
      setDownloadError("Vul een geldig e-mailadres in");
      return;
    }
    setIsDownloading(true);
    setDownloadError(null);
    trackEmailCaptured("download");
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portraitId: portrait.id, email: downloadEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Download mislukt");
      // Trigger download
      window.open(data.downloadUrl, "_blank");
      setShowDownloadModal(false);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Download mislukt");
    } finally {
      setIsDownloading(false);
    }
  };

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
        // Cache-bust: append timestamp to force browser to fetch new image
        const bustUrl = data.image_url.includes("?")
          ? `${data.image_url}&t=${Date.now()}`
          : `${data.image_url}?t=${Date.now()}`;
        setPortrait((prev) => ({
          ...prev,
          status: "completed",
          image_url: bustUrl,
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
      <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-royal-black">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-[#FAF8F3] mb-2">
              {portrait.retry_count > 0
                ? "Nieuw portret wordt gegenereerd"
                : "Uw portret wordt geschilderd"}
            </h1>
            <p className="text-base font-body text-[#FAF8F3]/60">
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

  // Completed — show portrait + product/frame selection
  return (
    <main className="min-h-screen px-4 py-8 md:py-16 pb-28 md:pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          {credits !== null && credits > 0 && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/10 text-royal-gold text-xs font-body font-semibold">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {credits} credit{credits !== 1 ? "s" : ""} resterend
              </span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-royal-brown mb-2">
            Uw Renaissance Meesterwerk
          </h1>
          <p className="text-base font-body text-royal-brown/60">
            Een waardig portret van uw trouwe metgezel
          </p>
        </div>

        {/* Two-column layout on desktop */}
        <div className="md:grid md:grid-cols-[1fr_1fr] md:gap-10 lg:gap-14">
          {/* LEFT COLUMN: Portrait + Retry */}
          <div>
            {/* Portrait with frame overlay */}
            {portrait.image_url && (
              <PortraitHero
                imageUrl={portrait.image_url}
                frameId={selectedFrame.id}
                frameOverlayUrl={selectedFrame.overlayUrl}
                showRetryOverlay={showRetry}
              >
                {/* Retry panel overlay — hidden on mobile, shown as modal on desktop */}
                {showRetry && (
                  <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <RetryPanel
                      portraitId={portrait.id}
                      currentStyle={portrait.style}
                      retryCount={portrait.retry_count}
                      onRetryStart={handleRetryStart}
                      onClose={() => setShowRetry(false)}
                      onError={(msg) => {
                        setShowRetry(false);
                        setError(msg);
                      }}
                    />
                  </div>
                )}
              </PortraitHero>
            )}

            {/* Mobile retry bottom sheet — full width, below portrait */}
            {showRetry && (
              <div className="md:hidden mt-4">
                <RetryPanel
                  portraitId={portrait.id}
                  currentStyle={portrait.style}
                  retryCount={portrait.retry_count}
                  onRetryStart={handleRetryStart}
                  onClose={() => setShowRetry(false)}
                  onError={(msg) => {
                    setShowRetry(false);
                    setError(msg);
                  }}
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm font-body text-red-700 text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Retry button — subtle, below portrait */}
            {!showRetry && (
              <div className="flex justify-center mt-4 mb-6 md:mb-0">
                <button
                  onClick={() => setShowRetry(true)}
                  className="inline-flex items-center gap-2 bg-royal-brown/5 text-royal-brown/70 font-body text-sm px-4 py-2 rounded-lg hover:bg-royal-brown/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                    />
                  </svg>
                  Niet tevreden? Bewerk
                </button>
                <a
                  href={`/portret/${portrait.id}`}
                  className="inline-flex items-center gap-2 bg-royal-brown/5 text-royal-brown/70 font-body text-sm px-4 py-2 rounded-lg hover:bg-royal-brown/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Delen
                </a>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Download + Print upsell */}
          <div className="space-y-6">
            {/* Free digital download section */}
            <div className="bg-royal-cream/50 rounded-lg p-5 border border-royal-gold/20">
              <h2 className="font-heading font-bold text-lg text-royal-brown mb-1">
                Download uw portret
              </h2>
              <p className="text-sm font-body text-royal-brown/60 mb-4">
                High-res bestand, direct beschikbaar
              </p>
              <button
                onClick={() => setShowDownloadModal(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-royal-gold text-white rounded-lg font-body font-semibold text-base hover:bg-royal-gold/90 active:scale-[0.98] transition-all shadow-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Digitaal — Gratis
              </button>
            </div>

            {/* Download email modal */}
            {showDownloadModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                  <h3 className="font-heading font-bold text-xl text-royal-brown mb-2">
                    Uw e-mailadres
                  </h3>
                  <p className="text-sm font-body text-royal-brown/60 mb-4">
                    Vul uw e-mailadres in om het portret te downloaden.
                  </p>
                  <input
                    type="email"
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFreeDownload()}
                    placeholder="uw@email.nl"
                    className="w-full px-4 py-3 border-2 border-royal-brown/20 rounded-lg font-body text-base focus:border-royal-gold focus:outline-none mb-3"
                    autoFocus
                  />
                  {downloadError && (
                    <p className="text-sm text-red-600 mb-3">{downloadError}</p>
                  )}
                  <button
                    onClick={handleFreeDownload}
                    disabled={isDownloading}
                    className="w-full px-6 py-3 bg-royal-gold text-white rounded-lg font-body font-semibold hover:bg-royal-gold/90 disabled:opacity-50 transition-all"
                  >
                    {isDownloading ? "Bezig..." : "Download portret"}
                  </button>
                  <button
                    onClick={() => setShowDownloadModal(false)}
                    className="w-full mt-2 px-6 py-2 text-royal-brown/50 font-body text-sm hover:text-royal-brown transition-colors"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-royal-brown/10" />
              <span className="text-sm font-body text-royal-brown/40">Laat uw portret drukken</span>
              <div className="flex-1 h-px bg-royal-brown/10" />
            </div>

            {/* Product selector (print/canvas only) */}
            <ProductSelector
              selected={selectedProduct}
              onSelect={handleProductSelect}
            />

            {/* Frame selector */}
            <FrameSelector
              frames={frames}
              selectedFrameId={selectedFrame.id}
              onSelect={setSelectedFrame}
            />

            {/* Social proof */}
            <SocialProof />

            {/* Price summary — desktop only (mobile uses sticky bar) */}
            <PriceSummary
              productLabel={selectedProduct?.sizeLabel || null}
              productPriceCents={selectedProduct?.priceCents || 0}
              productId={selectedProduct?.sizeId || null}
              frameId={selectedFrame.id}
              frameLabel={selectedFrame.name}
              framePriceCents={selectedFrame.priceCents}
              portraitId={portrait.id}
              disabled={!selectedProduct}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
