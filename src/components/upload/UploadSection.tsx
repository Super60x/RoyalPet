"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import DropZone from "./DropZone";
import GenerationProgress from "./GenerationProgress";
import UploadError from "./UploadError";
import UsageLimitReached from "./UsageLimitReached";

type State = "idle" | "uploading" | "generating" | "error";

export default function UploadSection() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [portraitId, setPortraitId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  // Fetch usage on mount
  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setRemaining(data.remaining))
      .catch(() => {
        // On error, allow usage (don't block due to usage check failure)
        setRemaining(3);
      });
  }, []);

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

      setPortraitId(data.id);
      setState("generating");
    } catch {
      setErrorMessage("Verbinding mislukt. Controleer uw internet en probeer het opnieuw.");
      setState("error");
    }
  }, []);

  const handleComplete = useCallback(
    (id: string) => {
      router.push(`/preview/${id}`);
    },
    [router]
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

  // Show limit reached when remaining is 0
  if (remaining === 0 && state === "idle") {
    return (
      <section className="max-w-2xl mx-auto">
        <UsageLimitReached />
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
      {state === "idle" && (
        <DropZone onFileSelected={handleFileSelected} remaining={remaining} />
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
