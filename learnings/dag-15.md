# Learnings — Dag 15: FAQ Schema + Lighthouse Audit

> Sessie: 15 | Datum: 2026-04-11

---

## Wat is er gebouwd

### FAQ Structured Data (JSON-LD)
- FAQPage schema toegevoegd aan kennisbank template
- 140 FAQ items geschreven (4 per ras, 35 rassen incl. 5 katten)
- Visuele FAQ sectie met dl/dt/dd markup onderaan elk artikel
- Klaar voor Google rich snippets (al werkt dat minder sinds 2023)

### Accessibility fixes (kennisbank)
- Contrast ratio verbeterd: tekst opacity /20→/50, /30→/50, /40→/60
- Links voorzien van underline voor non-color distinguishability (WCAG)
- Canonical URL fix in Article schema (www.royalpet.app)

### Lighthouse Audit
- Homepage: 58/100/96/100 (perf/seo/a11y/bp)
- Kennisbank: 82/100/92/100
- Performance bottleneck geïdentificeerd: GA4 + Google Ads tags (~126KB unused JS)

### Sessie 14 gemerged
- Feature branch gecommit en fast-forward gemerged naar main
- Pushed naar GitHub, Vercel auto-deploy

## Wat ging goed
- FAQ template + schema in één keer correct (geen build errors)
- Lighthouse audit gaf concrete, actionable feedback
- Alle 35 rassen FAQ content in één sessie afgerond
- Katten-prompts bevestigd: al pet-agnostisch, geen aanpassing nodig

## Wat ging fout
- Niets significant — korte, focused sessie

## Wat geleerd

### Architectuur beslissingen
- FAQ rich results zijn beperkt door Google (sinds 2023) — alleen nog voor autoritaire sites
- Wél nog nuttig voor: Bing, DuckDuckGo, AI crawlers (Perplexity, ChatGPT), en on-page UX
- Performance bottleneck homepage is onvermijdelijk trade-off (tracking vs snelheid)

### Tool tips
- Lighthouse via npx werkt goed op Windows met --headless --no-sandbox
- WCAG AA contrast: 4.5:1 normal text, 3:1 large text (18px+ of 14px+ bold)
- #FAF8F3 op #0A0A0A: /50 opacity = ~7.2:1 ratio (ruim voldoende)
- #B8942A (royal-gold) op wit = 2.87:1 — net onder 3:1 voor large text

### API gotchas
- Google FAQ rich results deprecation: tonen nu alleen voor "well-known authoritative" sites
- Lighthouse performance scores lokaal zijn lager dan op productie (cold start, geen CDN)

---

## Voorbereiding volgende sessie

### Focus: meer katten content, Pinterest live, performance tweaks
1. Katten-content genereren (5 rassen al in data, maar content+images nodig?)
2. Pinterest profiel live zetten (handmatig: logo, about, board, pins uploaden)
3. Optional: lazy-load GA4/Ads tags na user interaction (performance boost)
4. Optional: Google Ads pet owner audiences configureren
