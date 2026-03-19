"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface GenerationProgressProps {
  portraitId: string;
  onComplete: (id: string) => void;
  onError: (message: string) => void;
}

const WAIT_TEXTS = [
  "Uw metgezel neemt plaats voor het portret...",
  "De hofschilder mengt zijn verfpaletten...",
  "Fijne penseelstreken worden aangebracht...",
  "De gouden details worden afgewerkt...",
  "Het meesterwerk krijgt de finishing touch...",
  "Nog even geduld, perfectie kost tijd...",
];

const POLL_INTERVAL = 2500;
const TIMEOUT = 240000;
const TEXT_ROTATE_INTERVAL = 5000;

export default function GenerationProgress({
  portraitId,
  onComplete,
  onError,
}: GenerationProgressProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const textRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (textRef.current) clearInterval(textRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - startTime.current) / 1000);
      setElapsed(seconds);
      if (now - startTime.current > TIMEOUT) {
        cleanup();
        onError("Het genereren duurt langer dan verwacht. Probeer het opnieuw.");
      }
    }, 1000);

    textRef.current = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % WAIT_TEXTS.length);
    }, TEXT_ROTATE_INTERVAL);

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate/status?id=${portraitId}`);
        const data = await res.json();
        if (data.status === "completed") {
          cleanup();
          onComplete(portraitId);
        } else if (data.status === "failed") {
          cleanup();
          onError(
            data.error ||
              "De AI kon geen portret maken van deze foto. Probeer een andere foto."
          );
        }
      } catch {
        // Network error — continue polling
      }
    }, POLL_INTERVAL);

    return cleanup;
  }, [portraitId, onComplete, onError, cleanup]);

  const progress = Math.min((elapsed / 60) * 100, 95);

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[#FAF8F3]/10 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-royal-gold rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Rotating text */}
      <p className="text-lg font-heading text-[#FAF8F3]/70 italic mb-3 min-h-[1.75rem] transition-opacity duration-500">
        {WAIT_TEXTS[textIndex]}
      </p>

      {/* Elapsed time */}
      <p className="text-sm font-body text-[#FAF8F3]/30">
        {elapsed < 60
          ? `${elapsed} seconden...`
          : `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")} minuten...`}
      </p>
    </div>
  );
}
