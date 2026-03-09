# Learnings — Dag 00: Voorbereiding & Setup

> Sessie: 0 | Datum: 2026-03-09

---

## Wat is er gebouwd
- Volledige projectdocumentatie: CLAUDE.md, prd.md, saas_plan.md, checklist.md
- Slash commands: /start-session, /recap, /deploy-check, /debug, /learn
- Session-prompts.md met workflow overzicht
- Learnings template
- .env.local met alle API keys (Supabase, Replicate, Stripe test, Resend)
- .gitignore correct geconfigureerd
- GitHub repo opgezet + initial commit gepusht

## Wat ging goed
- Alle 14 architectuurbeslissingen in 1 ronde genomen en consistent doorgevoerd in alle docs
- Documentatie is 100% consistent across CLAUDE.md, prd.md, saas_plan.md en checklist.md
- Slash commands werken goed als sessie-workflow

## Wat ging fout
- Stripe CLI installatie: choco faalde (geen admin), winget werkte maar PATH niet gerefresht
- Claude Code Write tool vereist eerst Read — vergeten bij lege bestanden
- Edit tool faalt als bestand niet eerder gelezen is in context

## Wat geleerd

### Bug fixes
- Claude Code Write tool: altijd eerst Read uitvoeren, ook bij lege bestanden
- Edit tool: altijd eerst Read uitvoeren in dezelfde context

### Architectuur beslissingen
- Upload op homepage (geen aparte /upload route) — minder clicks, hogere conversie
- FLUX.1 Pro via Replicate (~€0.05/gen) — config-based prompt, geen hardcoded strings
- Client-side polling (2-3 sec) — simpeler dan webhooks/SSE voor MVP
- 2 Supabase buckets: portraits-public (watermarked) + portraits-private (clean)
- NL-only bij launch — i18n pas in Sessie 5
- Mobile-first design approach
- 1 gratis retry, daarna €4.99
- Auto-delete onbetaalde portretten na 30 dagen
- Rate limiting: 5 generaties per IP per uur

### Tool tips
- Stripe CLI: `C:\Users\Gebruiker\stripe-cli\stripe.exe` — voeg toe aan PATH
- `stripe listen --forward-to localhost:3000/api/webhook` geeft lokale whsec_

### API gotchas
- Stripe webhook secret verschilt per omgeving: CLI (lokaal) vs Dashboard (productie)
- Vercel env vars moeten apart ingesteld worden met productie-waarden

---

## Voorbereiding volgende sessie
- Stripe: iDEAL + Bancontact + EUR activeren in Dashboard
- Vercel: account aanmaken en koppelen aan GitHub
- Stripe CLI: toevoegen aan system PATH (optioneel, werkt ook met volledig pad)
- Sessie 1 start: Next.js 14 + TypeScript + Tailwind installeren
