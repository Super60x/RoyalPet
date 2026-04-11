# Learnings — Dag 12: SEO Engine Live + Merge

> Sessie: 12 | Datum: 2026-04-08

---

## Wat is er gebouwd

### Content generatie (35 rassen)
- 31 nieuwe rassen gegenereerd met FLUX 2 Pro + productie Flemish Masters prompt
- 3 seed breeds gefixt: Unsplash foto + FLUX 2 Pro portret toegevoegd
- Chow Chow portret apart hergegenereerd (upload was gefaald)
- Alle afbeeldingen permanent in Supabase Storage (geen tijdelijke Replicate URLs)

### Template verbeterd
- Tekst-eerst layout (was: afbeeldingen bovenaan)
- Inline afbeeldingen: rasfoto float-right naast intro, portret float-left naast sectie 2
- Hogere portretkwaliteit: FLUX 2 Pro ipv flux-schnell, productie laying_down prompt

### Merge + Automation
- Eerste merge ooit: feature/seo-engine → main (fast-forward)
- GitHub Actions secrets ingesteld (4 keys)
- Publish workflow handmatig getest — werkt correct

## Wat ging goed
- Generatie script crash-safe: 1 upload failure (Chow Chow) maar script ging gewoon door
- Fast-forward merge zonder conflicten
- Publish workflow meteen succesvol na secrets instellen
- Dry-run approach (1 ras eerst) voorkwam problemen bij de volle batch

## Wat ging fout
- Chow Chow portret-upload faalde tijdens batch (`fetch failed` — waarschijnlijk Replicate URL al verlopen)
  - Fix: apart script geschreven om opnieuw te genereren + uploaden
- `tsx -e` inline scripts werken niet betrouwbaar op Windows — hangen zonder output
  - Fix: altijd een `.ts` bestand schrijven, niet inline `-e` gebruiken
- `node -e` kan geen env vars laden uit `.env.local` — gebruik `npx tsx --env-file=.env.local`

## Wat geleerd

### Git merge basics
- `git checkout main` → `git merge feature/seo-engine` → `git push origin main`
- Fast-forward merge = geen merge commit, schone history
- Feature branch commits worden onderdeel van main history

### Generatie optimalisatie
- FLUX 2 Pro levert significant betere kwaliteit dan flux-schnell voor Renaissance portretten
- Productie-prompt (laying_down + crimson cushion + ermine trim) essentieel voor authenticiteit
- Dry-run met 1 ras is altijd de juiste eerste stap
- Supabase upload direct na generatie voorkomt verlopen Replicate URLs

### GitHub Actions
- `workflow_dispatch` trigger maakt handmatig testen mogelijk
- Publish script correct: "No pages due for publishing today" als publishDate in de toekomst ligt
- Node.js 20 deprecation warning — moet voor juni 2026 naar v24 actions

---

## Voorbereiding volgende sessie

### Focus: Distribution (visitors → conversions)
Volgende sessie is NIET bouwen maar distribueren.

### Vooraf: accounts aanmaken
- Google Search Console — `royalpet.app` als property toevoegen
- Pinterest Business account aanmaken
- Bekijk welke Facebook/Reddit groepen relevant zijn

### Eerste taken sessie 13
1. Sitemap indienen bij Google Search Console
2. IndexNow API implementeren (auto-ping bij publish)
3. Pinterest autoposter script bouwen
4. Internal linking toevoegen (kennisbank ↔ homepage)
5. AI visibility: FAQ schema, robots.txt updates
