# Learnings — Dag 14: IndexNow, Taalfix, AI Crawlers, Pinterest Prep

> Sessie: 14 | Datum: 2026-04-11

---

## Wat is er gebouwd

### IndexNow API
- Publish script uitgebreid met automatische IndexNow ping na elke publicatie
- API key gegenereerd (UUID) + verificatiebestand in `/public/`
- Pingt Bing, Yandex en andere IndexNow-partners bij nieuwe kennisbank pagina's

### Taalcorrectie: Vereeuw → Vereeuwig
- "Vereeuw" was grammaticaal incorrect Nederlands — gecorrigeerd naar "Vereeuwig"
- 7 bestanden aangepast: homepage, layout (3x meta), share pagina, portret meta, email footer
- Email previews en seo-pages.json ook bijgewerkt
- "Vereeuwigd" (voltooid deelwoord) bleef ongewijzigd — dat was al correct

### AI Crawler Visibility
- robots.txt uitgebreid: GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, GoogleOther, Applebot-Extended expliciet toegestaan
- llms.txt aangemaakt: gestructureerd overzicht van wat RoyalPet biedt, key pages, contactinfo

### Pinterest voorbereiding
- Rich Pin meta tags toegevoegd aan kennisbank pagina's
- Export script (`npm run export-pins`) genereert CSV voor Pinterest bulk upload
- CSV format: Title, Description, Link, Media URL, Pinterest board, Keywords
- Logo gegenereerd via GPT Image 1.5 (gouden kroon + "RoyalPet" op zwart)
- About-tekst geschreven voor Pinterest profiel + board

### Google Ads documentatie
- Pet owner audience targeting gedocumenteerd (Affinity: Pet Lovers, In-market: Pet Food & Supplies)
- Stap-voor-stap instructies voor wanneer en hoe toe te voegen

## Wat ging goed
- Alle 4 taken afgerond in één sessie
- Build slaagt na alle wijzigingen — geen breaks
- Pinterest CSV eerste poging had verkeerde headers — snel gefixt na user feedback
- Logo generatie in één keer goed (~$0.003)

## Wat ging fout
- Pinterest CSV had verkeerde kolom headers ("Board" ipv "Pinterest board", "Image URL" ipv "Media URL")
  - Pinterest geeft onduidelijke foutmelding "Missing header column"
  - Fix: officiële Pinterest docs gecheckt voor exacte header namen

## Wat geleerd

### Tool tips
- Pinterest bulk upload vereist exacte header namen: `Title`, `Description`, `Link`, `Media URL`, `Pinterest board`, `Keywords`
- Pinterest CSV moet UTF-8 zijn
- IndexNow accepteert batch URLs via POST naar api.indexnow.org/indexnow
- IndexNow returns 202 (accepted) — niet 200

### Architectuur beslissingen
- IndexNow ingebouwd in publish script (niet apart) — automatisch bij elke drip publish
- llms.txt als statisch bestand in /public/ — geen dynamische generatie nodig
- Logo als PNG in /public/ — kan ook als og:image gebruikt worden later

### API gotchas
- IndexNow key moet als .txt bestand beschikbaar zijn op exact `https://domain/{key}.txt`
- GPT Image 1.5 voor logo: aspect_ratio "1:1" werkt goed, output is consistent

---

## Voorbereiding volgende sessie

### Focus: FAQ schema, meer kennisbank content, Pinterest live
1. FAQ structured data (JSON-LD) toevoegen aan kennisbank pagina's
2. Pinterest profiel inrichten (logo, about, board aanmaken, pins uploaden)
3. Meer rassen in drip queue (katten?)
4. Performance check: Lighthouse scores
5. Google Ads: pet owner audiences toevoegen als Observation
