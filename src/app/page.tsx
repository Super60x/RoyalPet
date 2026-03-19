import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import UploadSection from "@/components/upload/UploadSection";

const EXAMPLES = [
  { src: "/examples/example-1.webp", alt: "Renaissance hond portret" },
  { src: "/examples/example-2.webp", alt: "Renaissance kat portret" },
  { src: "/examples/example-3.webp", alt: "Renaissance huisdier portret" },
  { src: "/examples/example-4.webp", alt: "Renaissance hond schilderij" },
  { src: "/examples/example-5.webp", alt: "Renaissance kat schilderij" },
  { src: "/examples/example-6.webp", alt: "Renaissance huisdier schilderij" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-royal-black text-[#FAF8F3]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5">
        <div>
          <span className="font-heading text-xl font-bold text-[#FAF8F3] tracking-wider">
            RoyalPet
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs text-[#FAF8F3]/40 font-body tracking-wide">
          <span className="text-[#FAF8F3]/70">Upload</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span>Preview</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span>Download of Bestel Print</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pt-12 md:pt-20 pb-8 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading leading-[1.1] mb-6">
          <em className="text-royal-gold not-italic font-heading" style={{ fontStyle: "italic" }}>
            Vereeuw
          </em>
          <br />
          Uw Huisdier als Tijdloos
          <br className="hidden sm:block" />{" "}
          Meesterwerk
        </h1>
        <p className="text-base md:text-lg text-[#FAF8F3]/50 font-body max-w-xl mx-auto mb-10">
          Upload een foto en ontvang binnen 60 seconden een prachtig
          AI-geschilderd Renaissance portret.
        </p>
      </section>

      {/* Upload Section */}
      <section className="px-4 pb-6">
        <Suspense
          fallback={
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-royal-gold border-t-transparent" />
            </div>
          }
        >
          <UploadSection />
        </Suspense>
      </section>

      {/* Trust Signals */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <TrustSignal icon="clock" text="Klaar in 60 seconden" />
          <TrustSignal icon="shield" text="Geen creditcard nodig" />
          <TrustSignal icon="star" text="1.000+ meesterwerken gemaakt" />
        </div>
      </section>

      {/* Example Gallery */}
      <section className="px-4 pt-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {EXAMPLES.map((ex, i) => (
              <div
                key={i}
                className="relative aspect-[2/3] rounded-lg overflow-hidden group"
              >
                <Image
                  src={ex.src}
                  alt={ex.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[#FAF8F3]/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#FAF8F3]/20 font-body">
              &copy; {new Date().getFullYear()} RoyalPet.app — Alle rechten voorbehouden
            </p>
            <nav className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-[#FAF8F3]/30 hover:text-[#FAF8F3]/60 font-body transition-colors">
                Privacybeleid
              </Link>
              <Link href="/terms" className="text-xs text-[#FAF8F3]/30 hover:text-[#FAF8F3]/60 font-body transition-colors">
                Voorwaarden
              </Link>
              <a href="mailto:support@royalpet.app" className="text-xs text-[#FAF8F3]/30 hover:text-[#FAF8F3]/60 font-body transition-colors">
                Contact
              </a>
            </nav>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-[10px] text-[#FAF8F3]/15 font-body">Betaal veilig met</span>
            <span className="text-[10px] text-[#FAF8F3]/25 font-body font-medium">iDEAL</span>
            <span className="text-[10px] text-[#FAF8F3]/25 font-body font-medium">Bancontact</span>
            <span className="text-[10px] text-[#FAF8F3]/25 font-body font-medium">Visa / Mastercard</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function TrustSignal({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[#FAF8F3]/40">
      {icon === "clock" && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {icon === "shield" && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )}
      {icon === "star" && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )}
      <span className="text-sm font-body">{text}</span>
    </div>
  );
}
