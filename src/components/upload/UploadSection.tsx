"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DropZone from "./DropZone";
import GenerationProgress from "./GenerationProgress";
import UploadError from "./UploadError";
import PaywallScreen from "./PaywallScreen";

type State = "idle" | "uploading" | "generating" | "error";

export default function UploadSection() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<State>("idle");
  const [portraitId, setPortraitId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [creditToast, setCreditToast] = useState(false);

  // Fetch usage on mount
  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        setRemaining(data.remaining);
        setCredits(data.credits || 0);
      })
      .catch(() => {
        setRemaining(1);
      });
  }, []);

  // Handle return from credit purchase
  useEffect(() => {
    const creditsParam = searchParams.get("credits");
    const emailParam = searchParams.get("email");

    if (creditsParam === "success" && emailParam) {
      // Set the credit email cookie via API
      fetch("/api/credits/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.credits > 0) {
            setCredits(data.credits);
            setRemaining(0); // Free is used, but credits available
            setCreditToast(true);
            setTimeout(() => setCreditToast(false), 4000);
          }
        })
        .catch(() => {});

      // Clean URL
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  const handleFileSelected = useCallback(async (file: File) => {
    setState("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if usage limit reached
        if (data.limitReached) {
          setRemaining(0);
          setCredits(0);
          setState("idle");
          return;
        }
        setErrorMessage(data.error || "Er ging iets mis. Probeer het opnieuw.");
        setState("error");
        return;
      }

      // Update remaining from response
      if (typeof data.remaining === "number") {
        setRemaining(data.remaining);
      }
      // If a credit was used, decrement local count
      if (data.usedCredit) {
        setCredits((prev) => Math.max(0, prev - 1));
      }

      // Store last portrait ID for paywall CTA
      if (data.id) {
        localStorage.setItem("rp_last_portrait", data.id);
      }

      setPortraitId(data.id);
      setState("generating");
    } catch {
      setErrorMessage("Verbinding mislukt. Controleer uw internet en probeer het opnieuw.");
      setState("error");
    }
  }, []);

  const handleComplete = useCallback(
    (id: string) => {
      // Use window.location for reliable redirect after generation
      window.location.href = `/preview/${id}`;
    },
    []
  );

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
    setState("error");
  }, []);

  const handleRetry = useCallback(() => {
    setState("idle");
    setPortraitId(null);
    setErrorMessage("");
  }, []);

  // Show paywall when no free uploads AND no credits
  if (remaining === 0 && credits === 0 && state === "idle") {
    const lastPortrait = typeof window !== "undefined"
      ? localStorage.getItem("rp_last_portrait")
      : null;
    return (
      <section className="max-w-3xl mx-auto">
        <PaywallScreen lastPortraitId={lastPortrait} />
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
      {/* Credit purchase success toast */}
      {creditToast && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-center">
          <p className="text-sm font-body text-green-700">
            Credits toegevoegd! U kunt nu meer portretten genereren.
          </p>
        </div>
      )}

      {/* Credit balance indicator */}
      {credits > 0 && remaining === 0 && state === "idle" && (
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/10 text-royal-gold text-xs font-body font-semibold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {credits} credit{credits !== 1 ? "s" : ""} resterend
          </span>
        </div>
      )}

      {state === "idle" && (
        <DropZone onFileSelected={handleFileSelected} remaining={remaining !== null ? (remaining > 0 ? remaining : credits) : null} />
      )}

      {state === "uploading" && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-royal-gold border-t-transparent mb-4" />
          <p className="text-lg font-body text-royal-brown/70">
            Foto wordt voorbereid...
          </p>
        </div>
      )}

      {state === "generating" && portraitId && (
        <GenerationProgress
          portraitId={portraitId}
          onComplete={handleComplete}
          onError={handleError}
        />
      )}

      {state === "error" && (
        <UploadError message={errorMessage} onRetry={handleRetry} />
      )}
    </section>
  );
}
