import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import pages from "../../../data/seo-pages.json";

export const metadata: Metadata = {
  title: "Kennisbank — Hondenrassen & Kattenrassen | RoyalPet",
  description:
    "Ontdek alles over populaire hondenrassen en kattenrassen. Lees over karakter, verzorging en geschiedenis — en bekijk elk ras als Renaissance meesterwerk.",
  alternates: {
    canonical: "https://www.royalpet.app/kennisbank",
  },
  openGraph: {
    title: "Kennisbank — Hondenrassen & Kattenrassen | RoyalPet",
    description:
      "Ontdek alles over populaire hondenrassen en kattenrassen. Lees over karakter, verzorging en geschiedenis.",
    url: "https://www.royalpet.app/kennisbank",
    siteName: "RoyalPet.app",
    locale: "nl_NL",
    type: "website",
  },
};

export default function KennisbankIndex() {
  const publishedPages = pages.filter((p) => p.published);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "RoyalPet Kennisbank",
    description: metadata.description,
    url: "https://www.royalpet.app/kennisbank",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: publishedPages.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.naam,
        url: `https://www.royalpet.app/kennisbank/${p.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-royal-black text-[#FAF8F3]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5">
        <Link href="/">
          <span className="font-heading text-xl font-bold text-[#FAF8F3] tracking-wider">
            RoyalPet
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs text-[#FAF8F3]/40 font-body hover:text-[#FAF8F3]/70 transition-colors"
        >
          &larr; Terug naar home
        </Link>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#FAF8F3]/30 font-body">
          <Link href="/" className="hover:text-[#FAF8F3]/60 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#FAF8F3]/50">Kennisbank</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-8 pb-12 text-center">
        <p className="text-xs font-body text-royal-gold/60 tracking-widest uppercase mb-4">
          Kennisbank
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading leading-[1.15] mb-6">
          Ontdek Elk Ras als Meesterwerk
        </h1>
        <p className="text-base md:text-lg text-[#FAF8F3]/50 font-body max-w-xl mx-auto">
          Lees alles over karakter, verzorging en geschiedenis van populaire
          honden- en kattenrassen — en bekijk ze als Renaissance portret.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {publishedPages.map((page) => (
            <Link
              key={page.slug}
              href={`/kennisbank/${page.slug}`}
              className="group"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#FAF8F3]/5 group-hover:border-royal-gold/30 transition-colors duration-300">
                {page.photoUrl ? (
                  <Image
                    src={page.photoUrl}
                    alt={`${page.naam}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-heading text-[#FAF8F3]/20">
                      {page.naam[0]}
                    </span>
                  </div>
                )}
                {/* Dark gradient at bottom for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-royal-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-heading text-[#FAF8F3] leading-tight">
                    {page.naam}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-heading mb-4">
            Uw Huisdier als Renaissance Meesterwerk
          </h2>
          <p className="text-[#FAF8F3]/40 font-body mb-8 max-w-md mx-auto">
            Upload een foto en ontdek binnen 60 seconden hoe uw huisdier
            eruitziet als tijdloos kunstwerk. Gratis te proberen.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-royal-gold text-white rounded-lg font-body font-semibold text-lg hover:bg-royal-gold/90 transition-colors"
          >
            Probeer het gratis
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[#FAF8F3]/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#FAF8F3]/20 font-body">
              &copy; {new Date().getFullYear()} RoyalPet.app &mdash; Alle
              rechten voorbehouden
            </p>
            <nav className="flex items-center gap-6">
              <Link
                href="/kennisbank"
                className="text-xs text-[#FAF8F3]/30 hover:text-[#FAF8F3]/60 font-body transition-colors"
              >
                Kennisbank
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-[#FAF8F3]/30 hover:text-[#FAF8F3]/60 font-body transition-colors"
              >
                Privacybeleid
              </Link>
              <Link
                href="/terms"
                className="text-xs text-[#FAF8F3]/30 hover:text-[#FAF8F3]/60 font-body transition-colors"
              >
                Voorwaarden
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
