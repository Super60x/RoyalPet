# Learnings — Dag 06: Launch Essentials + Retry Fixes

> Sessie: 6 | Datum: 2026-03-20

---

## Wat is er gebouwd

### Launch essentials
- `/privacy` pagina — AVG-compliant met 10 secties (wie, wat, cookies, rechten, bewaartermijnen)
- `/terms` pagina — 12 secties incl. herroepingsrecht, IP, levering, geschillen
- `robots.txt` — blokkeert /api/ en /admin/ voor crawlers
- Dynamische `sitemap.ts` — Next.js native, homepage + privacy + terms
- SVG favicon — gouden kroon op zwart (#0A0A0A + #B8942A)
- OG fallback image — voorbeeld portret als og:image voor homepage
- Footer — Privacybeleid, Voorwaarden, Contact mailto + betaalbadges (iDEAL/Bancontact/Visa)
- GA4 Analytics component — opt-in (AVG), laadt pas na cookie consent
- Cookie consent banner — "Accepteren" / "Alleen noodzakelijk", slideUp animatie
- `MAX_FREE_UPLOADS` dev override hersteld (999 in development, 1 in production)

### Retry panel fixes
- RetryPanel nu als fixed full-screen modal ipv absolute overlay in portrait (squish-proof)
- Credits logica herschreven: credits zijn primair, gratis eerste retry alleen als fallback bij 0 credits
- Inline credit purchase flow in RetryPanel (email + 3 packs, gaat naar Stripe)
- Email validatie-errors tonen inline in "Credits kopen" sectie, niet buiten de modal
- Generation progress screen nu dark mode (was onzichtbare witte tekst op crème)
- Sterkere kleur- en custom edit instructies in prompts ("IMPORTANT COLOR CHANGE" / "ADDITIONAL CHANGE")

## Wat ging goed
- Alle launch essentials in één commit, 0 build errors
- Privacy/terms pagina's zijn volledig Nederlandstalig en juridisch dekkend voor MVP
- Cookie consent is AVG-compliant (opt-in, niet opt-out)

## Wat ging fout
- RetryPanel was absolute overlay die squished op smalle schermen — had fixed modal moeten zijn
- Generation progress screen had crème achtergrond maar witte tekst (onzichtbaar) — dark mode vergeten
- Credits/retry logica was verwarrend: gratis retry werd getoond zelfs als gebruiker credits had
- "Koop credits" link ging naar homepage ipv purchase flow
- Email validatie error toonde buiten de modal (via onError callback) ipv inline

## Wat geleerd

### Bug fixes
- `.next` cache corrupts regelmatig op Windows — altijd `rm -rf .next` bij "Cannot find module" errors
- Fixed modal (`fixed inset-0 z-50`) is beter dan absolute overlay voor panels die responsive moeten zijn
- Error messages moeten inline tonen in de context waar ze ontstaan, niet via parent callbacks

### Architectuur beslissingen
- Credits zijn de primaire currency, gratis retry is alleen fallback voor users zonder credits
- Cookie consent moet opt-in zijn (AVG) — GA4 script pas laden na acceptatie
- `metadataBase` in layout.tsx zorgt dat relatieve OG image URLs correct worden resolved

### API gotchas
- GPT Image 1.5 met `input_fidelity: "high"` deprioritiseert late prompt-instructies
- Kleur/custom edit moet STERK geformuleerd worden ("MUST be", "Replace all") om effect te hebben
- `window.location.reload()` na cookie consent acceptatie is simpelste manier om GA4 te activeren

### Tool tips
- Next.js App Router: `icon.svg` in `src/app/` wordt automatisch als favicon geserveerd
- `sitemap.ts` in `src/app/` genereert dynamisch sitemap.xml
- Tailwind v3 heeft geen `animate-in`/`slide-in-from-bottom` — gebruik custom @keyframes

---

## Voorbereiding volgende sessie
- **GA4 property aanmaken** in Google Analytics en `NEXT_PUBLIC_GA_MEASUREMENT_ID` toevoegen aan env
- **Domein** `royalpet.app` registreren en koppelen aan Vercel
- **Stripe live keys** configureren in Vercel dashboard
- **Feature branch** `feature/post-launch` aanmaken voor: admin dashboard, abandoned checkout, taalwisselaar
- Overweeg: Sentry error tracking toevoegen voor productie monitoring
