# Learnings — Dag 13: Distribution — GSC, Internal Linking, Drip Fix

> Sessie: 13 | Datum: 2026-04-10

---

## Wat is er gebouwd

### GitHub Actions fix
- Publish workflow faalde met exit code 128 (git push geen schrijfrechten)
- Fix: `permissions: contents: write` toegevoegd aan publish-pages.yml
- Zelfde fix preventief toegevoegd aan generate-pages.yml (`contents: write` + `pull-requests: write`)
- Overbodige `GH_TOKEN` env var verwijderd uit publish workflow

### Drip schedule aangepast
- Van 5 rassen per batch naar 2 rassen per batch
- Interval: elke 2 dagen
- Nieuw schema: 12 april t/m 6 mei (13 batches)
- 9 pagina's al live, 26 nog te publiceren

### Google Search Console
- Property `www.royalpet.app` aangemaakt en geverifieerd (DNS TXT record via Namecheap)
- Sitemap ingediend — 12 pagina's ontdekt
- URL's gefixed: `royalpet.app` → `www.royalpet.app` in sitemap.ts en robots.txt

### Internal linking (4 onderdelen)
1. **Kennisbank indexpagina** (`/kennisbank`) — raster met rasfoto's, CollectionPage JSON-LD
2. **Gerelateerde rassen** — 3 andere rassen onderaan elk artikel (deterministic hash)
3. **Homepage links** — "Kennisbank" in navigatie + footer
4. **Breadcrumb fix** — "Kennisbank" nu klikbare link naar /kennisbank
5. **Canonical URL fix** — alle kennisbank URL's naar www.royalpet.app

## Wat ging goed
- Systematische debugging: exit code 128 direct herkend als permissions issue
- Preventief ook generate workflow gefixt (zou bij eerste run ook gefaald hebben)
- Build bleef slagen na elke wijziging — geen breaks
- Sitemap direct herkend als fout (non-www vs www mismatch)

## Wat ging fout
- Inline tsx `-e` script schreef niet naar disk (Windows issue) — moest apart .ts bestand maken
- Eerste drip update gaf per-dag batches ipv per-2-dagen — logica fout in modulo + date increment
- Internal linking direct op main gecommit ipv feature branch — user feedback ontvangen

## Wat geleerd

### Bug fixes
- GitHub Actions `GITHUB_TOKEN` heeft standaard **read-only** permissions — altijd `permissions: contents: write` toevoegen als je `git push` doet
- `actions/checkout@v4` configureert de git credential helper — extra `GH_TOKEN` env var niet nodig voor `git push`

### Architectuur beslissingen
- Gerelateerde rassen: deterministic hash op slug (geen random) zodat SSG consistent is
- Kennisbank index als aparte pagina, niet als sectie op homepage — beter voor SEO
- CollectionPage JSON-LD voor de indexpagina

### Tool tips
- Namecheap TXT record: host = `@` voor root domain
- GSC "Couldn't fetch" bij nieuwe sitemap is normaal — lost zichzelf op in minuten/uren
- `Date` constructor op Windows: gebruik `T12:00:00` suffix om timezone issues te voorkomen

### Workflow
- **Altijd feature branches gebruiken voor nieuwe features** — niet direct op main

---

## Voorbereiding volgende sessie

### Focus: meer distribution + SEO optimalisatie
1. Pinterest Business account aanmaken (vooraf)
2. IndexNow API implementeren (auto-ping bij publish)
3. FAQ schema toevoegen aan kennisbank pagina's
4. Pinterest autoposter script bouwen
5. AI visibility: robots.txt voor AI crawlers (ChatGPT, Perplexity)
