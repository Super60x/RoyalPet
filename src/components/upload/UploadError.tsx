"use client";

interface UploadErrorProps {
  message: string;
  onRetry?: () => void;
}

export default function UploadError({ message, onRetry }: UploadErrorProps) {
  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <div className="p-6 rounded-xl bg-red-900/20 border border-red-500/30">
        <svg
          className="mx-auto h-10 w-10 text-red-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <p className="text-base font-body text-red-300 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-royal-gold text-white font-body font-semibold px-6 py-2.5 rounded-lg hover:bg-royal-gold/90 transition-colors"
          >
            Probeer opnieuw
          </button>
        )}
      </div>
    </div>
  );
}
