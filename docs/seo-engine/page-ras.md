# File: src/app/rassen/[ras]/page.tsx

Save this file at exactly this path in your repo:
`src/app/rassen/[ras]/page.tsx`

---

```tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import breeds from '../../../../data/breeds.json'

type Breed = typeof breeds[0]

function getBreed(slug: string): Breed | undefined {
  return breeds.find((b) => b.slug === slug)
}

// Generates static paths for all breeds at build time
export async function generateStaticParams() {
  return breeds.map((b) => ({ ras: b.slug }))
}

// Generates per-page SEO metadata from breeds.json
export async function generateMetadata(
  { params }: { params: { ras: string } }
): Promise<Metadata> {
  const breed = getBreed(params.ras)
  if (!breed) return {}

  return {
    title: breed.title,
    description: breed.metaDescription,
    alternates: {
      canonical: `https://royalpet.app/rassen/${breed.slug}`,
    },
    openGraph: {
      title: breed.title,
      description: breed.metaDescription,
      url: `https://royalpet.app/rassen/${breed.slug}`,
      siteName: 'RoyalPet.app',
      images: breed.portraitUrl
        ? [{ url: breed.portraitUrl, alt: breed.altText }]
        : [{ url: '/og-image.webp', alt: 'RoyalPet Renaissance portret' }],
      locale: 'nl_NL',
      type: 'website',
    },
  }
}

export default function RasPage({ params }: { params: { ras: string } }) {
  const breed = getBreed(params.ras)
  if (!breed) notFound()

  return (
    <main className="min-h-screen bg-royal-black text-[#FAF8F3]">

      {/* Navigation — matches existing site */}
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
          ← Maak jouw portret
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-10 text-center">
        <p className="text-xs font-body text-royal-gold/60 tracking-widest uppercase mb-4">
          Renaissance Portretten
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading leading-[1.1] mb-6">
          {breed.h1}
        </h1>
        <p className="text-base md:text-lg text-[#FAF8F3]/50 font-body max-w-2xl mx-auto mb-10">
          {breed.intro}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-royal-gold text-white rounded-lg font-body font-semibold text-lg hover:bg-royal-gold/90 transition-colors"
        >
          Maak nu jouw portret — vanaf €24,99
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </Link>
      </section>

      {/* Portrait image */}
      {breed.portraitUrl && (
        <section className="max-w-2xl mx-auto px-6 pb-16">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#FAF8F3]/5">
            <Image
              src={breed.portraitUrl}
              alt={breed.altText}
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-center text-xs text-[#FAF8F3]/20 font-body mt-3">
            Voorbeeld: {breed.naam} Renaissance portret — gegenereerd door RoyalPet
          </p>
        </section>
      )}

      {/* Trust signals — matches homepage */}
      <section className="px-4 py-8 border-y border-[#FAF8F3]/5">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2 text-[#FAF8F3]/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-body">Klaar in 60 seconden</span>
          </div>
          <div className="flex items-center gap-2 text-[#FAF8F3]/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-sm font-body">Geen creditcard nodig</span>
          </div>
          <div className="flex items-center gap-2 text-[#FAF8F3]/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <span className="text-sm font-body">1.000+ meesterwerken gemaakt</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-heading text-center mb-10">
          Veelgestelde vragen over{' '}
          <span className="text-royal-gold">{breed.naam}</span> portretten
        </h2>
        <div className="space-y-4">
          {breed.faq.map((item, i) => (
            <div
              key={i}
              className="bg-[#111111] rounded-xl p-6 border border-[#FAF8F3]/5 hover:border-[#FAF8F3]/10 transition-colors"
            >
              <h3 className="font-body font-semibold text-[#FAF8F3]/90 mb-2">
                {item.vraag}
              </h3>
              <p className="font-body text-[#FAF8F3]/50 text-sm leading-relaxed">
                {item.antwoord}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom — matches homepage CTA section */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading mb-4">
            Jouw {breed.naam} verdient het
          </h2>
          <p className="text-[#FAF8F3]/40 font-body mb-8 max-w-md mx-auto">
            Upload een foto en ontvang binnen 60 seconden een uniek Renaissance meesterwerk.
            Gratis te proberen — betaal alleen als je het mooi vindt.
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

      {/* Footer — matches existing site */}
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
            </nav>
          </div>
        </div>
      </footer>
    </main>
  )
}
```
