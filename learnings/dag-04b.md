# Learnings — Dag 04b: E-mail Modal + Stripe Checkout + Paywall + Credits

> Sessie: 4 (deel 2) | Datum: 2026-03-16

---

## Wat is er gebouwd

### Stripe Checkout Flow
- EmailModal → `/api/checkout` → Stripe hosted page → `/api/webhook` → `/success/[id]`
- Inline `price_data` (geen pre-created Stripe products nodig)
- Shipping only voor fysieke producten (NL/BE/DE)
- Abandoned checkout tracking bij elke checkout creatie

### Paywall + Generation Credits
- Competitor-inspired paywall na 1 gratis generatie
- 3 credit packs via Stripe Checkout (email-based, geen auth)
- FIFO credit afschrijving (oudste pack eerst)
- PaywallScreen met testimonials, FAQ, email reclaim
- Credits werken voor zowel nieuwe uploads als retries

### Success Page
- Order samenvatting (product, maat, kader, prijs)
- Cache-bust images na retries
- Signed URL download voor digitale producten (24h)
- Levertijd info voor print/canvas

## Wat ging goed
- Stripe `price_data` mode = geen producten aanmaken in dashboard
- Email-based credits = simpel, overleven cookie-clearing
- Webhook idempotency via `stripe_session_id` check = elegant
- Hele checkout flow in 1 sessie gebouwd en werkend getest

## Wat ging fout

### Browser cache na retry
- **Probleem:** Watermarked image URL is altijd `{id}.webp` (upsert). Na retry toont browser het oude beeld.
- **Fix:** Cache-bust `?t=Date.now()` op image URL in PreviewClient + success page.
- **Les:** Bij file overwriting (upsert), altijd cache-busting toevoegen.

### Redirect na generatie faalde
- **Probleem:** `router.push(/preview/id)` werkte niet betrouwbaar na generatie completion. Pagina bleef op homepage.
- **Fix:** `window.location.href` in plaats van `router.push` voor volledige page load.
- **Les:** Next.js client-side routing is onbetrouwbaar na async state changes in useCallback. Gebruik `window.location.href` voor kritieke redirects.

### Poort mismatch
- **Probleem:** `NEXT_PUBLIC_BASE_URL=localhost:3000` maar server draaide op 3001. Stripe redirect ging naar verkeerde poort → 404.
- **Fix:** Base URL updaten in `.env.local`.
- **Les:** Altijd controleren of de poort in env vars matcht met de draaiende server.

### Dubbele webhook events
- **Probleem:** Stripe CLI stuurt webhook events soms 2x → dubbele orders + dubbele credits.
- **Fix:** Idempotency check: query `orders`/`generation_credits` op `stripe_session_id` voordat je insert.
- **Les:** Webhooks zijn NOOIT gegarandeerd exact-once. Altijd idempotency implementeren.

### Feminine AI output
- **Probleem:** Rococo stijl genereert roze jurk + parels zonder gender selectie.
- **Fix:** Default masculine prompt modifier: "military doublet, dark bold colors" tenzij expliciet feminine.
- **Les:** AI prompts zonder gender bias = altijd testen. Default naar de meest verwachte output.

### Dev mode bypass
- **Probleem:** `isDev` check in RetryPanel + retry route maakte credits-systeem onzichtbaar in development.
- **Fix:** Dev bypass verwijderd. `MAX_FREE_UPLOADS` hardcoded op 1 voor echte test.
- **Les:** Dev bypasses maskeren bugs. Test zo dicht mogelijk bij productie.

## Wat geleerd

### Stripe Checkout
- `price_data` mode = geen Products/Prices aanmaken in Stripe dashboard
- `metadata` op de sessie = de manier om context door te geven aan webhooks
- `metadata.type` discriminator = elegant voor meerdere checkout types op 1 webhook
- Webhook signature verificatie: `request.text()` (niet `.json()`) voor raw body

### Stripe API versie
- De TypeScript types zijn strikt — `apiVersion` moet exact matchen met de geïnstalleerde SDK
- v2026: `shipping_details` bestaat niet meer op `Session` type → cast via `unknown`

### Credit systeem zonder auth
- Email-based is de sweet spot: simpeler dan magic links, betrouwbaarder dan cookies
- `rp_credit_email` cookie = convenience layer, niet security boundary
- FIFO afschrijving via `ORDER BY created_at ASC LIMIT 1` = simpel + auditeerbaar

### Next.js
- `useSearchParams()` vereist `<Suspense>` boundary in App Router
- `export const dynamic = "force-dynamic"` voorkomt caching op server-rendered pages
- `window.location.href` > `router.push` voor post-async redirects

---

## Voorbereiding volgende sessie
- Commit alle wijzigingen
- Zet `MAX_FREE_UPLOADS` terug naar dev override (999) voor development comfort
- Volgende: Sessie 5 — Share URL + Virale Loop + eventueel Resend emails
- Frame overlay PNGs bestellen/uploaden naar Supabase Storage
