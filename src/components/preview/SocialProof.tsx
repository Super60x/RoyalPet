export default function SocialProof() {
  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center gap-2 text-sm font-body text-royal-brown/50">
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Gratis preview — betaal alleen als u tevreden bent</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-body text-royal-brown/50">
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Uw portret is 30 dagen beschikbaar</span>
      </div>
    </div>
  );
}
