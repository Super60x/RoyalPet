import { Suspense } from "react";
import UploadSection from "@/components/upload/UploadSection";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-12 md:py-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-royal-brown mb-4">
          RoyalPet
        </h1>
        <p className="text-xl md:text-2xl font-heading text-royal-brown/80 mb-3">
          Vereeuw Uw Huisdier als Renaissance Meesterwerk
        </p>
        <p className="text-base md:text-lg font-body text-royal-brown/60">
          Upload een foto en ontvang binnen 60 seconden een prachtig
          AI-geschilderd portret.
        </p>
      </div>

      {/* Upload — Suspense needed for useSearchParams in UploadSection */}
      <Suspense fallback={
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-royal-gold border-t-transparent" />
        </div>
      }>
        <UploadSection />
      </Suspense>

      {/* Trust signals */}
      <div className="max-w-2xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <p className="font-heading text-lg text-royal-brown font-semibold mb-1">
            60 seconden
          </p>
          <p className="text-sm font-body text-royal-brown/50">
            Uw portret is binnen een minuut klaar
          </p>
        </div>
        <div>
          <p className="font-heading text-lg text-royal-brown font-semibold mb-1">
            Veilig verwerkt
          </p>
          <p className="text-sm font-body text-royal-brown/50">
            Uw foto wordt beveiligd opgeslagen
          </p>
        </div>
        <div>
          <p className="font-heading text-lg text-royal-brown font-semibold mb-1">
            Gratis preview
          </p>
          <p className="text-sm font-body text-royal-brown/50">
            Betaal alleen als u tevreden bent
          </p>
        </div>
      </div>
    </main>
  );
}
