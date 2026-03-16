"use client";

import { useState, useRef, useEffect } from "react";

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  loading: boolean;
}

export default function EmailModal({
  open,
  onClose,
  onSubmit,
  loading,
}: EmailModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      // Small delay so the modal is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Voer een geldig e-mailadres in.");
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="E-mailadres invoeren"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-royal-brown/40 hover:text-royal-brown transition-colors"
          aria-label="Sluiten"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-royal-brown mb-2">
            Bijna klaar!
          </h2>
          <p className="text-sm font-body text-royal-brown/60">
            Voer uw e-mailadres in om door te gaan naar de betaling.
            U ontvangt hier ook uw bestelling.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="checkout-email"
              className="block text-sm font-body font-medium text-royal-brown mb-1"
            >
              E-mailadres
            </label>
            <input
              ref={inputRef}
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="uw@email.nl"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg border border-royal-brown/20 font-body text-royal-brown
                placeholder:text-royal-brown/30 focus:outline-none focus:ring-2 focus:ring-royal-gold/50 focus:border-royal-gold
                transition-colors"
            />
            {error && (
              <p className="mt-1 text-sm font-body text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-body font-semibold text-white transition-all min-h-[48px]
              ${loading
                ? "bg-royal-gold/60 cursor-wait"
                : "bg-royal-gold hover:bg-royal-gold/90 active:scale-[0.98] shadow-lg"
              }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Doorsturen naar betaling...
              </span>
            ) : (
              "Ga verder naar betaling"
            )}
          </button>

          <p className="text-xs font-body text-royal-brown/40 text-center">
            Adres en betaling worden veilig afgehandeld via Stripe.
          </p>
        </form>
      </div>
    </div>
  );
}
