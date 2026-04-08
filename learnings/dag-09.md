# Learnings — Dag 09: Google Ads Setup + Ad Creatives

> Sessie: 9 | Datum: 2026-04-01

---

## Wat is er gebouwd

### Ad Creatives (9 ontwerpen + variaties)
- Before/After: Stafford foto → Stafford portret (matched breed/kleur)
- Solo Portrait: Stafford op gouden kussen (gallery hero)
- Lifestyle: Labrador bij raam (interieur/aspirerend)
- 3 formaten per concept: 1200x628 (landscape), 1080x1080 (square), 300x250 (banner)
- 4 extra before/after variaties (Golden Retriever, Border Collie, Stafford blauw)
- 4 extra solo portret variaties + 3 landscape variaties
- 2 extra lifestyle variaties (kaarslicht/avondsfeer)
- Download-als-PNG functionaliteit met html2canvas
- Logo generator: 1200x1200 vierkant logo met gouden kroon

### Google Ads Campaign Setup Documenten
- `docs/google-ads-campaign-setup.md` — volledig copy-paste document (3 campagnes, 4 ad groups, 100+ keywords, bidding plan)
- `docs/google-ads-creative-strategy.md` — 15 RSA headlines, 4 descriptions, sitelinks, callouts, structured snippets
- `docs/google-ads-launch-checklist.md` — 10-stappen walkthrough (~90 min)

### Google Ads Account & Campagne
- Nieuw adverteerder-account aangemaakt: 328-887-3588 (onder ejsdebakker@gmail.com)
- Eerste campagne aangemaakt (Performance Max / Search hybrid via guided setup)
- Google Ads tag: AW-18029967167
- .env.local geüpdatet met nieuw AW-ID
- .gitignore geüpdatet: ads/ en ads-source/ uitgesloten van deploy

### Negative Keywords
- 69 negative keywords geimporteerd in het oude RoyalPet Manager account (304-200-5249)
- Moet opnieuw in het nieuwe account (328-887-3588)

## Wat ging goed
- Ad creatives zien er professioneel uit — brand-consistent met goud/zwart palette
- Before/after concept is sterk: matched breed + kleur maakt het geloofwaardig
- html2canvas download werkt na object-fit:cover fix
- PPC strategie document is zeer gedetailleerd en beginner-friendly
- Budget realistisch gehouden: €10/dag ondanks Google's push naar €82/dag

## Wat ging fout
- Google Ads account structuur was verwarrend: MCC (Manager) vs adverteerder-account
- pxlstudio60@gmail.com heeft een policy violation → kan geen nieuw account aanmaken
- Moest switchen naar ejsdebakker@gmail.com account
- GA4 property (G-9RNXDQYSS0) is nog gekoppeld aan het oude account (304-200-5249), niet aan het nieuwe (328-887-3588)
- Cloudinary MCP ondersteunt geen lokale file uploads op Windows
- html2canvas ondersteunt geen object-fit:cover → moest workaround bouwen
- De guided setup van Google Ads maakte automatisch een Performance Max-achtige campagne ipv een pure Search campagne

## Wat geleerd

### Architectuur beslissingen
- Google Ads Manager (MCC) accounts kunnen zelf geen campagnes draaien — alleen sub-accounts
- Bij nieuw Google Ads account krijg je een nieuw AW-ID — alle env vars en GA4 koppelingen moeten opnieuw
- Google's guided setup maakt automatisch campagnes — je kunt dit niet overslaan, maar wel pauzeren en eigen campagnes aanmaken

### Tool tips
- html2canvas: object-fit:cover wordt genegeerd. Fix: converteer <img> tijdelijk naar <div> met background-image:cover voor capture
- `npx serve .` is handig voor lokale file preview met correcte relative paths
- Cloudinary MCP: lokale file:// uploads werken niet op Windows — gebruik remote URLs of base64

### API gotchas
- Google Ads account ID (328-887-3588) ≠ AW-tag ID (AW-18029967167) — net als vorige keer, verschillende nummers
- Google Ads policy violation op één account blokkeert ALLE nieuwe accounts onder dat Gmail-adres
- GA4 property kan maar aan één Google Ads account tegelijk gekoppeld zijn als primary link
- Negative keyword lists leven op account-niveau, niet cross-account — moeten opnieuw aangemaakt in nieuw account

---

## Voorbereiding volgende sessie

### Blockers (moet VOOR volgende sessie opgelost)
1. **GA4 koppelen aan nieuw account (328-887-3588):**
   - GA4 Admin → Google Ads Links → verwijder oude link (304-200-5249)
   - Maak nieuwe link naar 328-887-3588
2. **Vercel env var updaten:**
   - `NEXT_PUBLIC_GOOGLE_ADS_ID` → `AW-18029967167`
   - Redeploy na wijziging
3. **Purchase conversie importeren** in nieuw account (Goals → Conversions → Import GA4)

### Eerste taken volgende sessie
- Pauzeer de auto-generated campagne van Google's setup
- Maak de 3 geplande campagnes handmatig aan (NB Search, Brand, Remarketing)
- Importeer negative keywords in het nieuwe account
- Koppel de ad creatives aan de campagnes
- Negative keyword lijst opnieuw aanmaken in 328-887-3588
- Abandoned checkout recovery bouwen (Vercel Cron)
