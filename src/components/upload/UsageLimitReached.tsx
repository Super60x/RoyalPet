"use client";

export default function UsageLimitReached() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-xl border-2 border-royal-brown/20 bg-royal-cream/50 p-8 md:p-12 text-center">
        {/* Lock icon */}
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-royal-brown/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-heading text-royal-brown mb-2">
          Uw gratis portretten zijn op
        </h3>

        <p className="text-sm font-body text-royal-brown/60 mb-4">
          U heeft 3 gratis portretten gebruikt. Uw tegoed wordt over 30 dagen
          automatisch vernieuwd.
        </p>

        <p className="text-xs font-body text-royal-brown/40">
          Wilt u meer portretten? Neem contact met ons op via{" "}
          <a
            href="mailto:info@royalpet.app"
            className="text-royal-gold hover:underline"
          >
            info@royalpet.app
          </a>
        </p>
      </div>
    </div>
  );
}
