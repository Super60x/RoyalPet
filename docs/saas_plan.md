# RoyalPet.app — SaaS Plan v4

> AI-gegenereerde Renaissance portretten van huisdieren | NL + BE + DE | Solo founder build

---

## Business Overzicht

**Concept:** Klanten uploaden een foto van hun huisdier. Een AI genereert een Renaissance-stijl portret. Ze bestellen het als digitaal bestand, fine art print of canvas — optioneel met een klassiek kader.

**Doelmarkt:** Hondeneigenaren (primair), katteneigenaren (secundair) in Nederland, België en Duitsland. Leeftijd 35–65. Koopintentie: cadeau voor anderen of zichzelf.

**Domein:** royalpet.app (+ royalpets.eu als redirect)

---

## Tech Stack

| Laag | Technologie |
|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS (mobile-first) |
| i18n | NL-only bij launch (i18n NL/FR/DE wordt later toegevoegd) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (admin + optioneel klantaccount) |
| AI generatie | Replicate — FLUX.1 Pro model (config-based prompt) |
| Betalingen | Stripe Checkout (hosted, NOOIT custom) |
| Betaalmethoden | iDEAL + Bancontact + creditcard |
| Email | Resend |
| Afbeeldingen | Sharp (watermark) + Next.js Image (WebP) |
| Storage | Supabase: portraits-public + portraits-private + frames |
| Deployment | Vercel |
| Dev tools | Stripe CLI (lokale webhook testing) |

---

## Database Schema

```sql
portraits (
  id text PRIMARY KEY,
  user_id uuid NULLABLE,
  image_url text,
  clean_url text,
  style text,
  pet_name text,
  customer_email text NULLABLE,
  paid boolean DEFAULT false,
  retry_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  created_at timestamp
)

orders (
  id text PRIMARY KEY,
  portrait_id text,
  user_id uuid NULLABLE,
  product text,
  price_cents integer,
  frame_id text NULLABLE,
  frame_price_cents integer NULLABLE,
  is_gift boolean,
  gift_message text,
  shipping_address jsonb,
  customer_email text,
  stripe_session_id text,
  status text DEFAULT 'ontvangen',
  fulfilled boolean DEFAULT false,
  created_at timestamp
)

frames (
  id text PRIMARY KEY,
  name text,
  price_cents integer,
  overlay_url text,
  active boolean DEFAULT true
)

abandoned_checkouts (
  id text PRIMARY KEY,
  email text,
  portrait_id text,
  portrait_url text,
  checkout_url text,
  product text,
  price_cents integer,
  recovery_sent_at timestamp NULLABLE,
  recovered boolean DEFAULT false,
  created_at timestamp
)
```

---

## Prijzen

| Product | Prijs |
|---|---|
| Digitale Download | €24,99 |
| Fine Art Print 8x10" | €89 |
| Fine Art Print 12x16" | €119 |
| Fine Art Print 18x24" | €199 |
| Fine Art Print 24x36" | €299 |
| Canvas 12x16" | €299 |
| Canvas 18x24" | €399 |
| Canvas 24x36" | €499 |
| Canvas 40x60" | €899 |

### Kader Add-ons

| Kadertype | Prijs add-on |
|---|---|
| Geen kader (standaard) | Gratis |
| Zwart Modern | +€25 |
| Wit Modern | +€25 |
| Antiek Zilver | +€30 |
| Klassiek Goud | +€35 |
| Klassiek Walnoot | +€35 |

---

## Checkout Flow (NOOIT wijzigen zonder toestemming)

```
1. Preview pagina → product kiezen + kader kiezen
2. Email modal → ALLEEN emailveld, GEEN adresformulier
3. Stripe hosted checkout → adres (NL/BE/DE) + telefoon + betaling
```

### Stripe Checkout configuratie

```js
await stripe.checkout.sessions.create({
  payment_method_types: ['ideal', 'bancontact', 'card'],
  mode: 'payment',
  billing_address_collection: 'required',
  shipping_address_collection: {
    allowed_countries: ['NL', 'BE', 'DE'],
  },
  line_items: [
    { price_data: { currency: 'eur', product_data: { name: productName }, unit_amount: priceInCents }, quantity: 1 },
    // optioneel: kader als tweede line_item
  ],
  success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/preview/${portraitId}`,
  metadata: { portrait_id: portraitId, frame_id: frameId ?? '' },
})
```

---

## Bouwplan — 8 Sessies

| Sessie | Onderwerp | Status |
|---|---|---|
| 1 | Project Foundation: Next.js setup + Supabase + DB schema + eerste deploy | ⬜ |
| 2 | Upload + AI Generatie: drag-and-drop + Replicate FLUX.1 Pro + progress bar | ⬜ |
| 3 | Preview + Prijzen + Kaders: watermark + productselector + kader-overlay | ⬜ |
| 4 | E-mail Modal + Stripe Checkout: emailveld + hosted checkout + webhook | ⬜ |
| 5 | Share URL + Virale Loop: /portret/[id] + WhatsApp/email delen + CTA | ⬜ |
| 6 | Auth + Admin Dashboard: Supabase Auth + ordertabel + statusmails | ⬜ |
| 7 | Abandoned Checkout Recovery: Vercel Cron + Resend herinneringsmails | ⬜ |
| 8 | SEO Blog via Notion CMS + ISR + eerste 3 blogposts | ⬜ |

---

## Email Flows

### Post-payment (automatisch via Stripe webhook)
- **Klant:** bevestiging + portret thumbnail + levertijd
- **Admin (jij):** nieuwe order notificatie met alle details

### Admin statuswijziging (via /admin dashboard)
| Status | Email onderwerp | Inhoud |
|---|---|---|
| In Productie | "Uw portret wordt geprint! 🖼️" | Bevestiging + levertijd 7-9 werkdagen |
| Verzonden | "Uw portret is onderweg! 📦" | Track & trace link |
| Geleverd | "Genieten van uw meesterwerk? 📸" | Muurfoto verzoek + review link |

### Abandoned Checkout Recovery
- **Timing:** 1 uur na verlaten checkout → herinneringsmail met portret preview + link
- **Techniek:** Cron Job via Vercel + Supabase query op abandoned_checkouts tabel

---

## MCP Integraties

| MCP Connector | Gebruik voor RoyalPet |
|---|---|
| Notion MCP | Blogposts schrijven en publiceren vanuit Claude |
| Gmail MCP | Klantvragen beantwoorden, orderupdates reviewen |
| Google Calendar MCP | Campagneplanning, Sinterklaas/kerst push inplannen |
| Gamma MCP | Pitch decks voor partnerships (hondenscholen, klinieken) |
| Excalidraw MCP | Flowdiagrammen voor features en marketing flows |

### Dagelijkse co-pilot workflow via MCP
1. Open Claude.ai → Gmail MCP → overzicht nieuwe orders + klantvragen
2. Beantwoord klantvragen direct via Gmail MCP
3. Publiceer geplande blogpost via Notion MCP
4. Maandelijks: Claude analyseert omzet + plant volgende campagne

---

## Economie

| Scenario | Orders/maand | Gem. orderwaarde | Omzet |
|---|---|---|---|
| Conservatief | 20 | €89 | €1.780 |
| Realistisch | 50 | €120 | €6.000 |
| Optimistisch | 150 | €150 | €22.500 |

### Kostenstructuur per order (schatting)
- Replicate FLUX.1 Pro generatie: ~€0,05
- Gelato print + verzending: €15–45 (afhankelijk van product)
- Stripe fee: ~2,5% + €0,25
- Resend email: < €0,01

**Brutomarge digitaal:** ~97% | **Brutomarge print/canvas:** ~50–65%

---

## Design Principes

**Typografie:** Cormorant Garamond (headlines) + Inter/Lato (body)

**Kleurenpalet:**
- Diep zwart: `#0A0A0A`
- Warm goud: `#B8942A`
- Crème wit: `#FAF8F3`
- Antiek bruin: `#3D2B1F`

**Nooit:** felle kleuren, Comic Sans, standaard blauwe buttons, flat-lay mockups

**Buttons:** gouden achtergrond `#B8942A` + witte tekst

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
REPLICATE_API_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_BASE_URL=
```

---

## Folderstructuur VS Code

```
royalpet_app/
├── CLAUDE.md                    ← projectcontext (altijd lezen bij sessiestart)
├── checklist.md                 ← master checklist alle fases
├── .claude/
│   ├── commands/
│   │   ├── start-session.md     ← /start-session
│   │   ├── recap.md             ← /recap
│   │   ├── deploy-check.md      ← /deploy-check
│   │   ├── debug.md             ← /debug
│   │   └── learn.md             ← /learn
│   └── settings.json
├── docs/
│   ├── prd.md                   ← volledige PRD v4
│   ├── saas_plan.md             ← dit bestand
│   └── session-prompts.md       ← overzicht slash commands
├── learnings/
│   ├── _template.md             ← template voor dagelijkse learnings
│   └── dag-XX.md                ← wordt per sessie aangemaakt
├── assets_visuals/              ← voorbeeld portretten + screenshots
└── src/                         ← Next.js code (Sessie 1+)
```