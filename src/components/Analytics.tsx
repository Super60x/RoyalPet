"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export function Analytics() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("rp_cookie_consent");
    if (stored === "true") setConsent(true);
    else if (stored === "false") setConsent(false);
  }, []);

  // Need at least one tag ID and consent
  const primaryId = GA_ID || GADS_ID;
  if (!primaryId) return null;
  if (consent !== true) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${GA_ID ? `gtag('config', '${GA_ID}', { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });` : ""}
          ${GADS_ID ? `gtag('config', '${GADS_ID}');` : ""}
        `}
      </Script>
    </>
  );
}

/**
 * Fire a Google Ads conversion event.
 * Call this on the success page after a confirmed purchase.
 */
export function trackAdsConversion({
  valueCents,
  orderId,
  email,
}: {
  valueCents: number;
  orderId: string;
  email?: string;
}) {
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  if (!GADS_ID || !conversionLabel) return;
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "conversion", {
    send_to: `${GADS_ID}/${conversionLabel}`,
    value: valueCents / 100,
    currency: "EUR",
    transaction_id: orderId,
  });

  // Enhanced conversions — hashed email helps Google match the conversion
  // to the ad click even without third-party cookies
  if (email) {
    window.gtag("set", "user_data", { email: email.toLowerCase().trim() });
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rp_cookie_consent");
    if (stored === null) {
      // Small delay so it doesn't flash immediately
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("rp_cookie_consent", "true");
    setVisible(false);
    // Reload to activate GA4
    window.location.reload();
  }

  function handleDecline() {
    localStorage.setItem("rp_cookie_consent", "false");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4" style={{ animation: "slideUp 0.3s ease-out" }}>
      <div className="max-w-lg mx-auto bg-[#1A1A1A] border border-[#FAF8F3]/10 rounded-xl p-5 shadow-2xl font-body">
        <p className="text-sm text-[#FAF8F3]/70 mb-4 leading-relaxed">
          Wij gebruiken cookies om onze website te verbeteren. Functionele cookies zijn altijd actief.
          Analytische cookies worden alleen geplaatst met uw toestemming.{" "}
          <a href="/privacy" className="text-royal-gold hover:underline">
            Meer info
          </a>
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-royal-gold text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-royal-gold/90 transition-colors"
          >
            Accepteren
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-transparent text-[#FAF8F3]/50 text-sm py-2.5 px-4 rounded-lg border border-[#FAF8F3]/10 hover:border-[#FAF8F3]/20 transition-colors"
          >
            Alleen noodzakelijk
          </button>
        </div>
      </div>
    </div>
  );
}
