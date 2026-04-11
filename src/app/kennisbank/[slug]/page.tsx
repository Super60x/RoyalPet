import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import pages from "../../../../data/seo-pages.json";

type SeoPage = (typeof pages)[0];

function getPage(slug: string): SeoPage | undefined {
  return pages.find((p) => p.slug === slug && p.published);
}

export async function generateStaticParams() {
  return pages
    .filter((p) => p.published)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = getPage(params.slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://www.royalpet.app/kennisbank/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `https://www.royalpet.app/kennisbank/${page.slug}`,
      siteName: "RoyalPet.app",
      images: page.portraitUrl
        ? [{ url: page.portraitUrl, alt: page.altText }]
        : [{ url: "/og-image.webp", alt: "RoyalPet Renaissance portret" }],
      locale: "nl_NL",
      type: "article",
    },
    other: {
      "pinterest-rich-pin": "true",
      ...(page.pinterestTitle && { "pin:description": page.pinterestDescription }),
    },
  };
}

export default function KennisbankPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getPage(params.slug);
  if (!page) notFound();

  // Related breeds: pick 3 other published pages (deterministic based on slug)
  const otherPages = pages.filter((p) => p.published && p.slug !== params.slug);
  const seed = params.slug.length + params.slug.charCodeAt(0);
  const related = otherPages
    .sort((a, b) => {
      const hashA = (a.slug.charCodeAt(0) * 31 + seed) % 1000;
      const hashB = (b.slug.charCodeAt(0) * 31 + seed) % 1000;
      return hashA - hashB;
    })
    .slice(0, 3);

  // JSON-LD: BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.royalpet.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kennisbank",
        item: "https://www.royalpet.app/kennisbank",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.naam,
        item: `https://royalpet.app/kennisbank/${page.slug}`,
      },
    ],
  };

  // JSON-LD: Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    image: page.portraitUrl || undefined,
    author: {
      "@type": "Organization",
      name: "RoyalPet",
      url: "https://www.royalpet.app",
    },
    publisher: {
      "@type": "Organization",
      name: "RoyalPet",
      url: "https://www.royalpet.app",
    },
    datePublished: page.publishDate,
    mainEntityOfPage: `https://www.royalpet.app/kennisbank/${page.slug}`,
  };

  // JSON-LD: FAQPage schema (only if FAQ items exist)
  const faqSchema =
    page.faq && page.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map((item: { question: string; answer: string }) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <main className="min-h-screen bg-royal-black text-[#FAF8F3]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5">
        <Link href="/">
          <span className="font-heading text-xl font-bold text-[#FAF8F3] tracking-wider">
            RoyalPet
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs text-[#FAF8F3]/60 font-body hover:text-[#FAF8F3]/80 transition-colors"
        >
          &larr; Terug naar home
        </Link>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 pb-4">
        <nav className="flex items-center gap-2 text-xs text-[#FAF8F3]/50 font-body">
          <Link href="/" className="underline decoration-[#FAF8F3]/20 hover:text-[#FAF8F3]/70 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/kennisbank" className="underline decoration-[#FAF8F3]/20 hover:text-[#FAF8F3]/70 transition-colors">
            Kennisbank
          </Link>
          <span>/</span>
          <span className="text-[#FAF8F3]/50">{page.naam}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-8 pb-10 text-center">
        <p className="text-xs font-body text-royal-gold/80 tracking-widest uppercase mb-4">
          {page.type === "breed"
            ? "Renaissance Portretten"
            : page.type === "gift"
              ? "Cadeau Inspiratie"
              : "Bijzondere Momenten"}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading leading-[1.15] mb-8">
          {page.h1}
        </h1>
      </section>

      {/* Article body — text first, images inline */}
      <article className="max-w-3xl mx-auto px-6 pb-8">
        {/* Intro with breed photo floated inline */}
        <div className="mb-12">
          {page.photoUrl && (
            <div className="float-right ml-6 mb-4 w-[200px] sm:w-[260px] md:w-[300px]">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#FAF8F3]/5">
                <Image
                  src={page.photoUrl}
                  alt={`${page.naam} — foto`}
                  fill
                  className="object-cover"
                  sizes="300px"
                  priority
                />
              </div>
            </div>
          )}
          <p className="text-base md:text-lg text-[#FAF8F3]/60 font-body leading-relaxed">
            {page.intro}
          </p>
          <div className="clear-both" />
        </div>

        {/* Content sections — portrait inline at section 2 */}
        {page.sections.map((section, i) => (
          <section key={i} className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading mb-5 text-[#FAF8F3]/90">
              {section.title}
            </h2>
            {i === 1 && page.portraitUrl ? (
              <div>
                <div className="float-left mr-6 mb-4 w-[200px] sm:w-[260px] md:w-[300px]">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-[#FAF8F3]/5">
                    <Image
                      src={page.portraitUrl}
                      alt={page.altText}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>
                  <p className="text-center text-[10px] text-[#FAF8F3]/50 font-body mt-2">
                    {page.naam} als Renaissance portret
                  </p>
                </div>
                <p className="text-base md:text-lg text-[#FAF8F3]/60 font-body leading-relaxed">
                  {section.content}
                </p>
                <div className="clear-both" />
              </div>
            ) : (
              <p className="text-base md:text-lg text-[#FAF8F3]/60 font-body leading-relaxed">
                {section.content}
              </p>
            )}
          </section>
        ))}
      </article>

      {/* FAQ Section */}
      {page.faq && page.faq.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="text-2xl sm:text-3xl font-heading mb-8 text-[#FAF8F3]/90">
            Veelgestelde vragen over {page.naam}
          </h2>
          <dl className="space-y-6">
            {page.faq.map((item: { question: string; answer: string }, i: number) => (
              <div
                key={i}
                className="border-b border-[#FAF8F3]/5 pb-6 last:border-b-0"
              >
                <dt className="text-base md:text-lg font-heading text-[#FAF8F3]/80 mb-2">
                  {item.question}
                </dt>
                <dd className="text-sm md:text-base text-[#FAF8F3]/50 font-body leading-relaxed">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Subtle CTA — at the end, not in body */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-heading mb-4">
            Benieuwd hoe jouw {page.naam} eruitziet?
          </h2>
          <p className="text-[#FAF8F3]/60 font-body mb-8 max-w-md mx-auto">
            Upload een foto en ontdek binnen 60 seconden hoe jouw huisdier
            eruitziet als Renaissance meesterwerk. Gratis te proberen.
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

          {/* Social proof */}
          <p className="text-sm text-[#FAF8F3]/50 font-body mt-6">
            We verzenden gratis in Nederland en Belgi&euml;. Meer dan 500 trouwe
            klanten gingen jou voor.
          </p>
        </div>
      </section>

      {/* Related breeds */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h3 className="text-xl sm:text-2xl font-heading mb-6 text-center text-[#FAF8F3]/70">
            Meer uit de Kennisbank
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/kennisbank/${r.slug}`}
                className="group"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#FAF8F3]/5 group-hover:border-royal-gold/30 transition-colors duration-300">
                  {r.photoUrl ? (
                    <Image
                      src={r.photoUrl}
                      alt={r.naam}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 33vw, 200px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-heading text-[#FAF8F3]/20">
                        {r.naam[0]}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                    <p className="text-xs sm:text-sm font-heading text-[#FAF8F3] leading-tight">
                      {r.naam}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/kennisbank"
              className="text-sm font-body text-royal-gold/80 underline decoration-royal-gold/30 hover:text-royal-gold transition-colors"
            >
              Bekijk alle rassen &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 border-t border-[#FAF8F3]/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#FAF8F3]/50 font-body">
              &copy; {new Date().getFullYear()} RoyalPet.app &mdash; Alle
              rechten voorbehouden
            </p>
            <nav className="flex items-center gap-6">
              <Link
                href="/kennisbank"
                className="text-xs text-[#FAF8F3]/50 underline decoration-[#FAF8F3]/20 hover:text-[#FAF8F3]/70 font-body transition-colors"
              >
                Kennisbank
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-[#FAF8F3]/50 underline decoration-[#FAF8F3]/20 hover:text-[#FAF8F3]/70 font-body transition-colors"
              >
                Privacybeleid
              </Link>
              <Link
                href="/terms"
                className="text-xs text-[#FAF8F3]/50 underline decoration-[#FAF8F3]/20 hover:text-[#FAF8F3]/70 font-body transition-colors"
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
