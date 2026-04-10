import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import UploadSection from "@/components/upload/UploadSection";

const SHOWCASE = [
  { src: "/examples/showcase-1.jpg", alt: "Border Collie als Renaissance edelman", name: "Max" },
  { src: "/examples/showcase-2.png", alt: "Stafford als Renaissance koning", name: "Duke" },
  { src: "/examples/showcase-3.png", alt: "Pomeranian als Renaissance hertog", name: "Floki" },
];


const TESTIMONIALS = [
  {
    image: "/interiors/shelf-golden.jpg",
    name: "Marloes",
    location: "Amsterdam",
    text: "Ik had dit voor de verjaardag van mijn vriend laten maken. Hij moest echt even twee keer kijken — het lijkt echt op een oud schilderij. Hangt nu boven de bank.",
    pet: "Beau, Golden Retriever",
  },
  {
    image: "/interiors/shelf-pom.jpg",
    name: "Thomas",
    location: "Utrecht",
    text: "Onze Floki is 14 en begint langzaam wat trager te worden. Dit portret is precies hoe we hem willen onthouden. Waardig, trots, en een beetje eigenwijs.",
    pet: "Floki, Pomeranian",
  },
  {
    image: "/interiors/living-5.jpg",
    name: "Annemiek",
    location: "Den Haag",
    text: "Mijn moeder snapte eerst niet wat het was. Toen ze beter keek en Beau herkende begon ze te lachen. Staat nu in haar woonkamer, naast de echte familiefoto's.",
    pet: "Beau, Labrador",
  },
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
        <div className="hidden sm:flex items-center gap-3 text-xs text-[#FAF8F3]/40 font-body tracking-wide">
          <Link href="/kennisbank" className="text-[#FAF8F3]/40 hover:text-[#FAF8F3]/70 transition-colors">
            Kennisbank
          </Link>
          <span className="text-[#FAF8F3]/15">|</span>
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

      {/* Showcase — Competitor-style 3-up portraits */}
      <section className="px-4 pt-16 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4">
              Trouwe Metgezellen,{" "}
              <span className="text-royal-gold">Voor Altijd Vereeuwigd</span>
            </h2>
            <p className="text-[#FAF8F3]/40 font-body max-w-lg mx-auto">
              Elk portret vertelt het verhaal van een onvoorwaardelijke band — getransformeerd tot tijdloze kunst.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
            {SHOWCASE.map((item, i) => (
              <div key={i} className="group relative">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1A]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  {/* Subtle gold border on hover */}
                  <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-royal-gold/30 transition-colors duration-500" />
                </div>
                <p className="mt-3 text-center text-sm font-body text-[#FAF8F3]/30">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interior Hero — Full-width lifestyle shot */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="relative aspect-square sm:aspect-[4/3] md:aspect-[4/3]">
              <Image
                src="/interiors/living-2.jpg"
                alt="Renaissance huisdier portret in een eetkamer"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              {/* Subtle overall tint + strong bottom fade for text */}
              <div className="absolute inset-0 bg-royal-black/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-black via-royal-black/60 via-[35%] to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14">
              <p className="text-lg sm:text-xl md:text-2xl font-heading text-[#FAF8F3] max-w-md leading-snug">
                &ldquo;Niet zomaar een print aan de muur —{" "}
                <span className="text-royal-gold">een gespreksstarter.</span>&rdquo;
              </p>
              <p className="text-sm font-body text-[#FAF8F3]/40 mt-2">
                Canvas 45x60cm met Klassiek Goud kader
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof — Testimonials with real interior photos */}
      <section className="px-4 pt-8 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading mb-3">
              Wat Onze Klanten Delen
            </h2>
            <p className="text-[#FAF8F3]/40 font-body text-sm max-w-md mx-auto">
              Echte portretten, echte huizen, echte reacties.
            </p>
          </div>

          {/* Masonry-style testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-[#111111] rounded-xl overflow-hidden border border-[#FAF8F3]/5 hover:border-[#FAF8F3]/10 transition-colors duration-300"
              >
                {/* Interior photo */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={t.image}
                    alt={`${t.pet} portret in huis van ${t.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Review content */}
                <div className="p-5">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-royal-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-sm font-body text-[#FAF8F3]/70 leading-relaxed mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-body font-medium text-[#FAF8F3]/90">
                        {t.name}
                      </p>
                      <p className="text-xs font-body text-[#FAF8F3]/30">
                        {t.location}
                      </p>
                    </div>
                    <p className="text-xs font-body text-royal-gold/60 italic">
                      {t.pet}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading mb-4">
            Uw Huisdier Verdient Het
          </h2>
          <p className="text-[#FAF8F3]/40 font-body mb-8 max-w-md mx-auto">
            Upload een foto, kies uw stijl, en ontvang binnen een minuut een uniek meesterwerk. Gratis te proberen.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-royal-gold text-white rounded-lg font-body font-semibold text-lg hover:bg-royal-gold/90 transition-colors"
          >
            Begin Nu
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </Link>
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
              <Link href="/kennisbank" className="text-xs text-[#FAF8F3]/30 hover:text-[#FAF8F3]/60 font-body transition-colors">
                Kennisbank
              </Link>
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
