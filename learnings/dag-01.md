# Learnings — Dag 01: Project Foundation

> Sessie: 1 | Datum: 2026-03-09

---

## Wat is er gebouwd
- Next.js 14 + TypeScript + Tailwind v3 project opgezet
- Design system: Cormorant Garamond (headings) + Inter (body) via next/font/google
- Kleurenpalet als Tailwind custom colors: royal-black, royal-gold, royal-cream, royal-brown
- Supabase client library: browser (client.ts), server (server.ts), admin (admin.ts)
- Health check API route `/api/health` — test Supabase connectie
- SQL migraties: 4 tabellen (portraits, orders, frames, abandoned_checkouts) + RLS policies
- 3 Storage buckets: portraits-public, portraits-private, frames
- Frames seed data: 6 kaderopties met prijzen
- Eerste succesvolle Vercel deploy

## Wat ging goed
- Handmatige Next.js setup gaf meer controle dan create-next-app
- Build + lint slaagden meteen zonder errors
- Supabase connectie werkte direct na SQL migraties
- Vercel auto-deploy via GitHub push werkte perfect

## Wat ging fout
- `create-next-app` faalde: mapnaam `RoyalPet_app` bevat hoofdletters, npm staat dat niet toe
- Tailwind v4 werd geïnstalleerd (incompatibel met Next.js 14) — moest downgraden naar v3
- eslint-config-next v16 incompatibel met Next.js 14 — moest v14 + eslint v8 installeren

## Wat geleerd

### Bug fixes
- npm project naam mag geen hoofdletters bevatten — gebruik package.json met lowercase naam
- Next.js 14 vereist Tailwind v3, niet v4 (v4 heeft andere config structuur)
- Next.js 14 vereist eslint v8 + eslint-config-next v14

### Architectuur
- next/font/google laadt fonts optimaal via CSS variabelen (--font-heading, --font-body)
- Tailwind fontFamily moet CSS var() referenties bevatten voor next/font integratie
- Supabase @supabase/ssr is de juiste library voor Next.js App Router (niet @supabase/auth-helpers)
- Admin client gebruikt service role key — alleen server-side, nooit in client components

### Vercel
- Push naar main → automatische deploy
- Preview deploys voor andere branches
- Environment variables moeten apart in Vercel dashboard ingesteld worden

---

## Voorbereiding volgende sessie
- Stripe: iDEAL + Bancontact + EUR activeren in Dashboard (nog open)
- Sessie 2: drag-and-drop upload, Replicate FLUX.1 Pro integratie, polling, watermark met Sharp
