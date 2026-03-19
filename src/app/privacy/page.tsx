import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacybeleid — RoyalPet.app",
  description: "Privacybeleid van RoyalPet.app — hoe wij omgaan met uw persoonsgegevens.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-royal-black text-[#FAF8F3]">
      <nav className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-bold text-[#FAF8F3] tracking-wider hover:text-royal-gold transition-colors">
          RoyalPet
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 font-body">
        <h1 className="text-3xl md:text-4xl font-heading mb-8">Privacybeleid</h1>
        <p className="text-[#FAF8F3]/50 text-sm mb-8">Laatst bijgewerkt: maart 2026</p>

        <div className="space-y-8 text-[#FAF8F3]/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">1. Wie zijn wij?</h2>
            <p>
              RoyalPet.app is een dienst die AI-gegenereerde Renaissance-stijl portretten maakt van huisdieren.
              De dienst wordt aangeboden door RoyalPet, gevestigd in Nederland.
              Voor vragen over privacy kunt u contact opnemen via{" "}
              <a href="mailto:support@royalpet.app" className="text-royal-gold hover:underline">support@royalpet.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">2. Welke gegevens verzamelen wij?</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[#FAF8F3]">E-mailadres</strong> — bij het downloaden van uw portret of het plaatsen van een bestelling</li>
              <li><strong className="text-[#FAF8F3]">Foto van uw huisdier</strong> — om het Renaissance-portret te genereren</li>
              <li><strong className="text-[#FAF8F3]">Verzendadres en telefoonnummer</strong> — alleen bij print/canvas bestellingen, verzameld via Stripe</li>
              <li><strong className="text-[#FAF8F3]">IP-adres</strong> — voor beveiliging en misbruikpreventie (rate limiting)</li>
              <li><strong className="text-[#FAF8F3]">Cookies</strong> — functionele cookies voor gebruikslimieten en e-mailkoppeling</li>
              <li><strong className="text-[#FAF8F3]">Betalingsgegevens</strong> — verwerkt door Stripe; wij slaan geen kaartgegevens op</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">3. Waarvoor gebruiken wij uw gegevens?</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Het genereren en leveren van uw portret</li>
              <li>Het verwerken van betalingen en bestellingen</li>
              <li>Het versturen van orderbevestigingen en statusupdates per e-mail</li>
              <li>Het voorkomen van misbruik van de dienst</li>
              <li>Het verbeteren van onze dienstverlening (anonieme statistieken)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">4. Cookies</h2>
            <p className="mb-3">Wij gebruiken de volgende cookies:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[#FAF8F3]">rp_usage</strong> — functioneel, houdt bij hoeveel gratis generaties u heeft gebruikt (30 dagen geldig)</li>
              <li><strong className="text-[#FAF8F3]">rp_credit_email</strong> — functioneel, koppelt uw credits aan uw e-mailadres (1 jaar geldig)</li>
              <li><strong className="text-[#FAF8F3]">Google Analytics (_ga, _gid)</strong> — analytisch, helpt ons begrijpen hoe bezoekers de site gebruiken</li>
            </ul>
            <p className="mt-3">
              U kunt cookies blokkeren via uw browserinstellingen. Functionele cookies zijn noodzakelijk voor het correct
              functioneren van de dienst.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">5. Derde partijen</h2>
            <p className="mb-3">Wij delen uw gegevens met de volgende dienstverleners:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[#FAF8F3]">Stripe</strong> — betalingsverwerking (PCI-DSS gecertificeerd)</li>
              <li><strong className="text-[#FAF8F3]">Supabase</strong> — database en bestandsopslag (EU servers)</li>
              <li><strong className="text-[#FAF8F3]">Replicate</strong> — AI-portretgeneratie</li>
              <li><strong className="text-[#FAF8F3]">Resend</strong> — e-mailverzending</li>
              <li><strong className="text-[#FAF8F3]">Vercel</strong> — hosting</li>
              <li><strong className="text-[#FAF8F3]">Google Analytics</strong> — websiteanalyse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">6. Bewaartermijnen</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Onbetaalde portretten en bijbehorende bestanden worden na <strong className="text-[#FAF8F3]">30 dagen</strong> automatisch verwijderd</li>
              <li>Betaalde portretten worden bewaard zolang nodig voor de dienstverlening</li>
              <li>Ordergegevens worden bewaard conform de wettelijke bewaarplicht (7 jaar)</li>
              <li>Generatiecredits verlopen na <strong className="text-[#FAF8F3]">1 jaar</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">7. Uw rechten (AVG)</h2>
            <p className="mb-3">Op grond van de Algemene Verordening Gegevensbescherming (AVG) heeft u het recht op:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[#FAF8F3]">Inzage</strong> — welke gegevens wij van u bewaren</li>
              <li><strong className="text-[#FAF8F3]">Rectificatie</strong> — onjuiste gegevens laten corrigeren</li>
              <li><strong className="text-[#FAF8F3]">Verwijdering</strong> — uw gegevens laten verwijderen</li>
              <li><strong className="text-[#FAF8F3]">Beperking</strong> — de verwerking van uw gegevens beperken</li>
              <li><strong className="text-[#FAF8F3]">Overdraagbaarheid</strong> — uw gegevens in een gangbaar formaat ontvangen</li>
              <li><strong className="text-[#FAF8F3]">Bezwaar</strong> — bezwaar maken tegen de verwerking</li>
            </ul>
            <p className="mt-3">
              Neem contact op via{" "}
              <a href="mailto:support@royalpet.app" className="text-royal-gold hover:underline">support@royalpet.app</a>{" "}
              om een van deze rechten uit te oefenen. Wij reageren binnen 30 dagen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">8. Beveiliging</h2>
            <p>
              Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen,
              waaronder versleutelde verbindingen (HTTPS/TLS), veilige opslag, en beperkte toegang tot persoonsgegevens.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">9. Klachten</h2>
            <p>
              Heeft u een klacht over hoe wij met uw gegevens omgaan? Neem dan contact met ons op via{" "}
              <a href="mailto:support@royalpet.app" className="text-royal-gold hover:underline">support@royalpet.app</a>.
              U heeft ook het recht een klacht in te dienen bij de{" "}
              <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-royal-gold hover:underline">
                Autoriteit Persoonsgegevens
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">10. Wijzigingen</h2>
            <p>
              Wij behouden het recht dit privacybeleid te wijzigen. De meest recente versie is altijd
              beschikbaar op deze pagina. Bij ingrijpende wijzigingen informeren wij u per e-mail.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#FAF8F3]/10">
          <Link href="/" className="text-royal-gold hover:underline font-body text-sm">
            ← Terug naar homepage
          </Link>
        </div>
      </article>
    </main>
  );
}
