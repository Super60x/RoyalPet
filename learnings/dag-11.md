# Learnings — Dag 11: Programmatic SEO Engine

> Sessie: 11 | Datum: 2026-04-08

---

## Wat is er gebouwd

### SEO Engine (feature/seo-engine branch)
- Kennisbank template (`/kennisbank/[slug]`) met SSG, Article + BreadcrumbList JSON-LD
- Blog-lengte content: 5 informatieve secties per ras (karakter, geschiedenis, verzorging, NL/BE, Renaissance)
- Content generatie script: Claude API (content) + Replicate FLUX (portret) + Unsplash (rasfoto) + Supabase upload (permanent)
- Twee afbeeldingen per pagina: normale rasfoto (Unsplash) + Renaissance portret (Replicate met productie-prompt)
- Drip campaign: publishDate + published vlag, dagelijkse GitHub Action publiceert op schema
- Weekly generatie workflow: maakt PR aan voor review
- 35 rassen (30 honden + 5 katten) klaargezet in generatie script
- Expandable: zelfde systeem werkt voor breed, gift, en occasion pagina types

## Wat ging goed
- Template UI goedgekeurd door gebruiker na eerste review + aanpassingen
- Build slaagt probleemloos met alle 3 seed pagina's (SSG)
- Sitemap update automatisch op basis van published pagina's
- Architectuur is future-proof: `/kennisbank/` in plaats van `/rassen/` maakt expansion makkelijk
- Replicate URL expiratie probleem direct geïdentificeerd en opgelost (Supabase upload)

## Wat ging fout
- `.next` cache corrupt na template wijziging — "Cannot find module './948.js'" error
  - Fix: `rm -rf .next` (bekende Windows gotcha)
- Dev server port 3000 bleef bezet na meerdere start/stop cycli
  - Fix: `taskkill //pid [PID] //f` of gebruik een alternatieve port (`-p 3001`)

## Wat geleerd

### Architectuur beslissingen
- `/kennisbank/` is beter dan `/rassen/` voor SEO — bredere content hub, niet beperkt tot rassen
- Blog-lengte content (800-1000 woorden, 5 secties) scoort veel beter voor SEO dan korte landing pages
- FAQ sectie niet nodig voor informatieve artikelen — beter om secties met echte content te gebruiken
- Article JSON-LD is beter dan FAQPage JSON-LD voor long-form content
- Social proof ("500 trouwe klanten") hoort onderaan bij CTA, niet in de body

### Tool tips
- `tsx --env-file=.env.local` laadt env vars voor standalone scripts (Next.js env loading werkt niet buiten Next.js)
- Replicate `flux-schnell` output type varieert — altijd Array + String + object fallback afhandelen
- `npm run generate-pages -- --batch-size 5` — dubbele `--` nodig om flags door te geven via npm scripts

### API gotchas
- Replicate image URLs verlopen na ~1 uur — ALTIJD downloaden en opslaan in Supabase Storage
- Claude Sonnet kan soms markdown code fences toevoegen aan JSON output — strip ```` ```json ````  fences als fallback
- Supabase Storage `upsert: true` overschrijft bestaande bestanden — handig voor retries

### Content strategie
- Informative > salesy: Google beloont informatieve content hubs
- CTA moet subtiel: "Benieuwd hoe jouw [ras] eruitziet?" werkt beter dan "Bestel nu"
- Drip campaign (5 pagina's per 2 dagen) is beter voor Google indexering dan alles tegelijk

---

## Voorbereiding volgende sessie

### Vooraf: accounts/keys
- Unsplash developer account aanmaken (gratis) → `UNSPLASH_ACCESS_KEY` in `.env.local`
- Zonder Unsplash key draait het script nog steeds, maar dan zonder rasfoto's

### Eerste taak
1. Unsplash key toevoegen aan `.env.local`
2. `npm run generate-pages -- --start-date 2026-04-10 --interval-days 2` draaien (~10 min, ~$0.50)
3. Lokaal reviewen, merge `feature/seo-engine` naar main
4. GitHub secrets toevoegen: `ANTHROPIC_API_KEY`, `REPLICATE_API_TOKEN`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
5. Sitemap indienen bij Google Search Console

### Daarna
- Pinterest automation script bouwen
- Abandoned checkout recovery (Vercel Cron + Resend)
- Of: eerste echte iDEAL/Bancontact test betaling

### Build tip
- Windows kan OOM geven bij `npm run build` → gebruik `NODE_OPTIONS="--max-old-space-size=4096" npm run build`
