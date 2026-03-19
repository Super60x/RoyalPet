import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden — RoyalPet.app",
  description: "Algemene voorwaarden van RoyalPet.app voor het gebruik van onze dienst.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-royal-black text-[#FAF8F3]">
      <nav className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-bold text-[#FAF8F3] tracking-wider hover:text-royal-gold transition-colors">
          RoyalPet
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 font-body">
        <h1 className="text-3xl md:text-4xl font-heading mb-8">Algemene Voorwaarden</h1>
        <p className="text-[#FAF8F3]/50 text-sm mb-8">Laatst bijgewerkt: maart 2026</p>

        <div className="space-y-8 text-[#FAF8F3]/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">1. Definities</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[#FAF8F3]">Dienst</strong> — de website RoyalPet.app en alle bijbehorende functionaliteiten</li>
              <li><strong className="text-[#FAF8F3]">Gebruiker</strong> — iedere bezoeker of klant van de Dienst</li>
              <li><strong className="text-[#FAF8F3]">Portret</strong> — het door AI gegenereerde Renaissance-stijl portret van uw huisdier</li>
              <li><strong className="text-[#FAF8F3]">Product</strong> — een digitale download, fine art print of canvas print van een Portret</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">2. Toepasselijkheid</h2>
            <p>
              Deze voorwaarden zijn van toepassing op elk gebruik van de Dienst en op alle overeenkomsten
              die via de Dienst tot stand komen. Door gebruik te maken van RoyalPet.app gaat u akkoord met
              deze voorwaarden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">3. De dienst</h2>
            <p className="mb-3">RoyalPet.app biedt:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Gratis AI-generatie van een Renaissance-portret van uw huisdier (1 per gebruiker)</li>
              <li>Gratis digitale download van het gegenereerde portret (na opgave e-mailadres)</li>
              <li>Aanvullende generatiecredits (betaald)</li>
              <li>Fine art prints en canvas prints van uw portret (betaald)</li>
              <li>Optionele kaders bij print/canvas bestellingen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">4. Prijzen en betaling</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Alle prijzen zijn in euro&apos;s en inclusief BTW</li>
              <li>Betaling verloopt via Stripe (iDEAL, Bancontact of creditcard)</li>
              <li>Na succesvolle betaling ontvangt u een bevestiging per e-mail</li>
              <li>Generatiecredits zijn 1 jaar geldig na aankoop en niet restitueerbaar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">5. Levering</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-[#FAF8F3]">Digitale download:</strong> direct beschikbaar na opgave e-mailadres. Downloadlink is 7 dagen geldig.</li>
              <li><strong className="text-[#FAF8F3]">Fine art prints:</strong> levering binnen 7-9 werkdagen na betaling</li>
              <li><strong className="text-[#FAF8F3]">Canvas prints:</strong> levering binnen 7-9 werkdagen na betaling</li>
              <li>Verzending naar Nederland, België en Duitsland</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">6. Herroepingsrecht</h2>
            <p className="mb-3">
              Op grond van de Wet Koop op Afstand heeft u als consument het recht uw bestelling binnen
              <strong className="text-[#FAF8F3]"> 14 dagen</strong> na ontvangst zonder opgave van reden te retourneren.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Neem contact op via <a href="mailto:support@royalpet.app" className="text-royal-gold hover:underline">support@royalpet.app</a> om een retour te starten</li>
              <li>Het product moet in originele staat worden teruggestuurd</li>
              <li>Na ontvangst van de retour wordt het aankoopbedrag binnen 14 dagen teruggestort</li>
              <li>Digitale downloads en generatiecredits zijn uitgezonderd van het herroepingsrecht zodra de download is gestart of credits zijn gebruikt</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">7. Intellectueel eigendom</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Het gegenereerde portret is voor persoonlijk gebruik</li>
              <li>U mag het portret delen op sociale media met vermelding van RoyalPet.app</li>
              <li>Commercieel gebruik van het portret is niet toegestaan zonder schriftelijke toestemming</li>
              <li>De website, het merk en alle content van RoyalPet.app zijn eigendom van RoyalPet</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">8. Geüploade foto&apos;s</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>U garandeert dat u het recht heeft de foto te uploaden</li>
              <li>Upload uitsluitend foto&apos;s van uw eigen huisdier</li>
              <li>Geüploade foto&apos;s worden alleen gebruikt voor portretgeneratie</li>
              <li>Onbetaalde portretten worden na 30 dagen automatisch verwijderd</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">9. AI-generatie</h2>
            <p>
              Portretten worden gegenereerd door kunstmatige intelligentie. Het resultaat kan variëren en is
              afhankelijk van de kwaliteit van de geüploade foto. Wij garanderen geen specifiek resultaat.
              Bij ontevredenheid kunt u een nieuwe generatie starten (met credits) of contact opnemen voor
              een oplossing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">10. Aansprakelijkheid</h2>
            <p>
              RoyalPet.app is niet aansprakelijk voor indirecte schade, gevolgschade of schade door overmacht.
              Onze aansprakelijkheid is beperkt tot het bedrag van de betreffende bestelling. Wij streven naar
              een continue beschikbaarheid van de dienst, maar garanderen geen ononderbroken toegang.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">11. Geschillen</h2>
            <p>
              Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de
              bevoegde rechter in Nederland. Wij streven ernaar geschillen eerst in onderling overleg op te lossen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-heading text-[#FAF8F3] mb-3">12. Contact</h2>
            <p>
              Voor vragen over deze voorwaarden kunt u contact opnemen via{" "}
              <a href="mailto:support@royalpet.app" className="text-royal-gold hover:underline">support@royalpet.app</a>.
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
