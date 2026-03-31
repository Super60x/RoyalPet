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

/**
 * Update Google consent state. Call when user accepts/declines cookies.
 */
export function updateConsent(granted: boolean) {
  if (typeof window === "undefined" || !window.gtag) return;
  const state = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  });
}

export function Analytics() {
  const [consentLoaded, setConsentLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rp_cookie_consent");
    if (stored === "true") {
      updateConsent(true);
    }
    setConsentLoaded(true);
  }, []);

  // Need at least one tag ID
  const primaryId = GA_ID || GADS_ID;
  if (!primaryId) return null;

  // Always load gtag with Consent Mode v2 defaults (denied until user accepts)
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

          // Consent Mode v2: deny all by default (GDPR/AVG compliant)
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });

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

/**
 * GA4 ecommerce: view_item — fire when preview page loads with a completed portrait.
 */
export function trackViewItem({ itemId, itemName, priceCents }: {
  itemId: string;
  itemName: string;
  priceCents: number;
}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "view_item", {
    currency: "EUR",
    value: priceCents / 100,
    items: [{ item_id: itemId, item_name: itemName, price: priceCents / 100 }],
  });
}

/**
 * GA4 ecommerce: add_to_cart — fire when user selects a product/size.
 */
export function trackAddToCart({ itemId, itemName, priceCents }: {
  itemId: string;
  itemName: string;
  priceCents: number;
}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "add_to_cart", {
    currency: "EUR",
    value: priceCents / 100,
    items: [{ item_id: itemId, item_name: itemName, price: priceCents / 100 }],
  });
}

/**
 * GA4 ecommerce: begin_checkout — fire when user clicks "Bestel uw meesterwerk".
 */
export function trackBeginCheckout({ itemId, itemName, priceCents }: {
  itemId: string;
  itemName: string;
  priceCents: number;
}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "begin_checkout", {
    currency: "EUR",
    value: priceCents / 100,
    items: [{ item_id: itemId, item_name: itemName, price: priceCents / 100 }],
  });
}

/**
 * Micro-conversion: upload_complete — fire when portrait generation finishes.
 */
export function trackUploadComplete(portraitId: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "upload_complete", { portrait_id: portraitId });
}

/**
 * Micro-conversion: email_captured — fire when user submits email (download or checkout).
 */
export function trackEmailCaptured(method: "download" | "checkout") {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "email_captured", { method });
}

/**
 * GA4 ecommerce: purchase — fire on success page alongside trackAdsConversion.
 */
export function trackPurchase({ orderId, valueCents, itemId, itemName }: {
  orderId: string;
  valueCents: number;
  itemId: string;
  itemName: string;
}) {
  if (!GA_ID) return;
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "purchase", {
    transaction_id: orderId,
    value: valueCents / 100,
    currency: "EUR",
    items: [{ item_id: itemId, item_name: itemName, price: valueCents / 100 }],
  });
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
    // Update consent state — no reload needed with Consent Mode v2
    updateConsent(true);
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
