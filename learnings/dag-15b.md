# Learnings — Dag 15b: Hotfix Boxer breed photo

> Sessie: 15b (hotfix) | Datum: 2026-04-19

---

## Wat is er gebouwd

### Root-cause fix Unsplash query
- `scripts/generate-pages.ts` — `fetchUnsplashPhoto()` detecteert nu dog vs cat op basis van `nameEn`
  - Dog breeds: query wordt `${nameEn} dog breed` (e.g. "Boxer dog breed")
  - Cat breeds: ongewijzigd (nameEn bevat al "cat")
- `content_filter=high` toegevoegd aan API call als extra safety net

### Nieuw targeted fix-script
- `scripts/fix-photo.ts` — standalone script voor single-breed photo re-fetch
- `npm run fix-photo -- <slug>` — bv. `npm run fix-photo -- boxer-portret`
- Optionele `--query "custom search"` flag als default nog steeds mis is
- Raakt GEEN AI-portret en GEEN article content — alleen de Unsplash foto
- Supabase upsert overschrijft bestaand bestand op zelfde path, dus `seo-pages.json` blijft ongewijzigd

### Boxer foto vervangen
- Oude foto: menselijke bokser (de sport) — Unsplash rankte sport/personen hoger voor query "Boxer"
- Nieuwe foto: Boxer hond via query "Boxer dog breed" + content_filter=high
- Storage path: `portraits-public/breeds/photos/boxer-portret.jpg`

### Branch/commit flow
- Commit `5e515f8` (rebased SHA) op main
- Rebase op origin/main (was 4 commits behind door auto-publishes)
- Push naar origin succesvol, Vercel auto-deploy

## Wat ging goed
- Explore agent vond meteen alle relevante code (generate-pages, template, data JSON)
- Plan-mode workflow: eerst exploratie, dan plan, dan execute — geen verspilde moves
- Build + lint groen bij eerste poging, geen regressies
- Rebase verliep clean (mijn script-changes botsten niet met auto-publish JSON changes)

## Wat ging fout
- Eerste Unsplash image download faalde met "fetch failed" — transient netwerk hikje, tweede poging werkte meteen
- Niets structureels

## Wat geleerd

### Bug fixes
- **Unsplash search ranking**: ambiguë breed namen ("Boxer", "Pug", "Beagle", "Poodle") returnen sport/objecten voor hondenfoto's. Altijd "dog breed" appenden voor honden en `content_filter=high` gebruiken.

### Architectuur beslissingen
- **Targeted hotfix > full pipeline re-run**: nieuwe `fix-photo.ts` doet 1 ding (foto vervangen) — geen Replicate-cost, geen Claude-cost. Voor elk toekomstig foto-probleem is dit het go-to script.
- **Supabase path stability**: omdat path = `breeds/photos/{slug}.jpg` en we `upsert: true` gebruiken, hoeft `photoUrl` in `seo-pages.json` nooit geüpdatet te worden bij een re-fetch — alleen de bytes in storage wijzigen.

### Tool tips
- `git pull --rebase origin main` werkt clean als local en remote verschillende files raken (mijn scripts vs auto-publish JSON changes — geen conflict mogelijk)
- `npm run fix-photo -- boxer-portret` → dubbele `--` om CLI args door npm heen te pipen
- Next.js cache bypass bij visuele verify: `?v=2` query string toevoegen aan URL

### API gotchas
- Unsplash `content_filter=high` filtert expliciete content, helpt óók tegen irrelevante sport/object resultaten (niet gedocumenteerd maar merkbaar)
- Unsplash `regular` URL = 1080px wide, goed genoeg voor kennisbank pagina's (we tonen op 300px)

---

## Voorbereiding volgende sessie

### Sessie 16 — oorspronkelijk plan (nog niet uitgevoerd)
- Homepage performance fix: lazy-load GA4 + Google Ads tags (score 58 → target 80+)
- Button contrast fix: goud `#B8942A` op wit (2.87:1 → ≥3:1 WCAG AA)
- Pinterest live (logo, about, board, eerste pins)
- Google Ads: negative keywords importeren + pet owner audiences

### Visuele audit aanbevolen
Voor Sessie 16: check deze 3 pagina's op prod, zelfde fix als Boxer als foto niet klopt:
- `/kennisbank/mopshond-portret` (Pug)
- `/kennisbank/beagle-portret`
- `/kennisbank/poedel-portret` (Poodle)

### Blockers
- Geen technische blockers
- Vercel deploy draait nog bij commit van deze learnings
