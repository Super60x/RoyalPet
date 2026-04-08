# Learnings — Dag 07: Launch — Domain + Stripe Live + Landing Page

> Sessie: 7 | Datum: 2026-03-20

---

## Wat is er gebouwd

### Landing page redesign
- Competitor-style 3-up portrait showcase ("Trouwe Metgezellen, Voor Altijd Vereeuwigd")
- Full-width interior hero image with gradient fade overlay + quote
- Social proof testimonials (3 cards) with real interior photos + genuine Dutch reviews
- "Uw Huisdier Verdient Het" CTA section
- Replaced example images with actual generated portraits (Border Collie, Stafford, Pomeranian)

### Google Ads conversion tracking
- Analytics.tsx: supports both GA4 + Google Ads tags (AW-XXXXXXX)
- trackAdsConversion() function exported for success page
- SuccessClient.tsx: fires conversion on page load (value, order ID, enhanced conversions with email)
- Window.gtag type declaration added
- New env vars: NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL

### Domain + Deployment
- royalpet.app domain connected to Vercel (www.royalpet.app live)
- SSL active (automatic via Vercel)
- NEXT_PUBLIC_BASE_URL added to Vercel env vars
- Missing env vars added to Vercel (RESEND_API_KEY, RESEND_FROM_EMAIL, OWNER_EMAIL)

### Stripe live mode
- Live webhook created: https://www.royalpet.app/api/webhook
- Event: checkout.session.completed
- API version: 2026-02-25.clover (matches code)
- Live keys (pk_live, sk_live, whsec) ready to add to Vercel

## Wat ging goed
- Domain + Vercel deploy worked smoothly
- Build error caught immediately (missing RESEND_API_KEY in Vercel)
- Webhook endpoint created correctly on first try
- Landing page testimonials feel genuine (not salesy)

## Wat ging fout
- Build failed on Vercel because RESEND_API_KEY wasn't in env vars (only in local .env.local)
- Dev server on Windows had curl connection issues (IPv4/IPv6 mismatch) — not a real problem
- Port 3000 EADDRINUSE when trying to restart — killed old process, used port 3001

## Wat geleerd

### Bug fixes
- Vercel needs ALL env vars that are used at build time, not just runtime
- Resend constructor throws at import time if API key is missing → breaks build

### Architectuur beslissingen
- Google Ads + GA4 can share the same gtag.js script (load with primary ID, config both)
- Enhanced conversions (user_data with email) improve attribution without third-party cookies
- useRef guard prevents double-firing conversion events in React strict mode

### Tool tips
- `object-contain` shows full image without cropping (vs `object-cover` which crops)
- Gradient overlays: `via-[35%]` controls where the midpoint of the gradient sits
- Vercel env vars need manual redeploy after changes (not automatic)

### API gotchas
- Stripe live mode: iDEAL and Bancontact must be manually enabled in live dashboard (not inherited from test)
- No products/prices to migrate from test → live when using inline price_data

---

## Voorbereiding volgende sessie
- **Stripe live keys** in Vercel env vars zetten + redeploy
- **Test iDEAL betaling** met klein bedrag om hele flow te valideren
- **Google Ads:** appeal afwachten, daarna Conversion ID + label invullen
- **Content:** meer portretvoorbeelden genereren (mix rassen)
- **Mobile testing:** alle pagina's testen op iOS + Android
