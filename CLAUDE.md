# RoyalPet.app — Claude Code Project Context

> **Lees dit eerst bij elke sessie.** Dit bestand vertelt je alles over het project,
> de architectuur, kritieke beslissingen en hoe je met mij samenwerkt.

---

## 🎯 Wat dit project is

**RoyalPet.app** is een AI-powered SaaS webapp die hondeneigenaren en kattenliefhebbers
in Nederland, België en Duitsland in staat stelt hun huisdier te vereeuwigen als een
Renaissance meesterwerk.

**De flow:**
1. Gebruiker uploadt foto van huisdier
2. Replicate FLUX.1 Pro genereert een Renaissance-stijl portret (~60 seconden)
3. Gebruiker ziet watermarked preview gratis
4. Gebruiker kiest product + optioneel kader
5. Betaling via Stripe Checkout (hosted)
6. Digitaal: directe download via signed Supabase URL
7. Print/Canvas: handmatige fulfillment via Gelato, owner ontvangt notificatie

**Markten:** NL (primair), BE, DE
**Domein:** royalpet.app
**Status:** In ontwikkeling — sessie [UPDATE DIT PER SESSIE]

---

## 🛠 Tech Stack

```
Frontend:   Next.js 14 (App Router) + TypeScript + Tailwind CSS
Design:     Mobile-first responsive (Tailwind breakpoints)
i18n:       NL-only bij launch. i18n (NL/FR/DE) wordt later toegevoegd.
Backend:    Supabase (Auth + PostgreSQL + Storage)
AI:         Replicate API — FLUX.1 Pro model (config-based prompt)
Payments:   Stripe Checkout (hosted page — GEEN custom adresformulier)
Email:      Resend (transactioneel + abandoned checkout recovery)
Fulfillment: Gelato (handmatig door owner voor print/canvas)
Watermark:  Sharp library (server-side)
Deploy:     Vercel (automatisch via GitHub)
Dev tools:  Stripe CLI (lokale webhook testing)
```

---

## 🗄 Database Schema (Supabase)

### portraits
```sql
id              text PRIMARY KEY          -- 6-karakter random slug
user_id         uuid NULLABLE             -- NULL voor gastgebruikers
image_url       text                      -- watermarked versie (portraits-public bucket)
clean_url       text                      -- origineel zonder watermark (portraits-private bucket)
style           text                      -- Renaissance stijlnaam
pet_name        text NULLABLE
customer_email  text NULLABLE             -- opgeslagen bij email modal (voor marketing/re-engagement)
paid            boolean DEFAULT false
retry_count     integer DEFAULT 0         -- aantal gebruikte retries (1 gratis, daarna betaald)
share_count     integer DEFAULT 0
created_at      timestamp DEFAULT now()
```

### orders
```sql
id                text PRIMARY KEY
portrait_id       text REFERENCES portraits(id)
user_id           uuid NULLABLE
product           text                  -- 'digital' | 'fine_art' | 'canvas'
price_cents       integer
frame_id          text NULLABLE REFERENCES frames(id)
frame_price_cents integer NULLABLE
is_gift           boolean DEFAULT false
gift_message      text NULLABLE
shipping_address  jsonb                 -- Stripe levert dit aan
customer_email    text
stripe_session_id text
status            text DEFAULT 'pending'
                  -- 'pending' | 'in_productie' | 'verzonden' | 'geleverd'
fulfilled         boolean DEFAULT false
created_at        timestamp DEFAULT now()
```

### frames
```sql
id          text PRIMARY KEY
name        text                        -- 'geen' | 'zwart_modern' | etc.
price_cents integer
overlay_url text                        -- PNG in Supabase Storage /frames/
active      boolean DEFAULT true
```

### abandoned_checkouts
```sql
id               text PRIMARY KEY
email            text
portrait_id      text
portrait_url     text                   -- watermarked URL voor email preview
checkout_url     text                   -- Stripe checkout URL
product          text
price_cents      integer
recovery_sent_at timestamp NULLABLE
recovered        boolean DEFAULT false
created_at       timestamp DEFAULT now()
```

---

## 📦 Supabase Storage Buckets

| Bucket | Type | Inhoud |
|---|---|---|
| `portraits-public` | PUBLIC | Watermarked preview afbeeldingen |
| `portraits-private` | PRIVATE | Clean originelen (signed URL na betaling) |
| `frames` | PUBLIC | Kader overlay PNG's |

> Signed URLs voor `portraits-private` zijn 24 uur geldig na betaling.

---

## 🤖 AI Generatie — Technische Details

- **Primary model:** GPT Image 1.5 via Replicate (`openai/gpt-image-1.5`) — 1024x1536, quality=high
- **Fallback model:** FLUX.2 Pro via Replicate (`black-forest-labs/flux-2-pro`) — auto-fallback bij primary failure
- **Upscaler:** Real-ESRGAN via Replicate (`nightmareai/real-esrgan`) — 2x upscale op elke generatie
- **Prompt:** instruction-based — "Transform this pet photo into..." format in `src/config/prompts.ts`
- **Model history:** flux-1.1-pro → flux-canny-pro → flux-depth-pro → flux-kontext-pro → **gpt-image-1.5 (huidig)**
- **Polling:** client-side, elke 2-3 seconden via `/api/generate/status`
- **Geen** Replicate webhooks, geen SSE — puur client polling
- **Rate limiting:** max 5 generaties per IP per uur op `/api/generate`
- **Model history:** flux-1.1-pro (geen stijl) → flux-canny-pro (verkeerde kleuren) → flux-depth-pro (cartoonachtig) → flux-kontext-pro (beste resultaat)

---

## 📤 Upload Validatie

- **Client-side:** bestandstype (jpg/png/webp), max 10MB, minimale resolutie
- **Server-side:** rate limiting 5 generaties per IP per uur
- **Geen** AI-validatie van fotokwaliteit (te complex voor MVP)

---

## 🔄 Retry Beleid

- 1 gratis retry per portret (zelfde foto, nieuwe generatie)
- Extra retries: €4,99 per stuk via Stripe
- Retry knop zichtbaar op `/preview/[id]`
- `retry_count` wordt bijgehouden in portraits tabel

---

## 🗑️ Data Cleanup

- Onbetaalde portretten + storage files: **auto-verwijderd na 30 dagen**
- Via Vercel Cron Job (dagelijks)
- Abandoned checkout emails waarschuwen: "portret beschikbaar voor 30 dagen"

---

## 💳 Betaling & Checkout — KRITIEKE BESLISSINGEN

> ⚠️ **Verander deze beslissingen NOOIT zonder expliciet toestemming te vragen.**

### Checkout flow (3 stappen — ALTIJD zo houden)
1. Preview pagina → gebruiker kiest product + kader → klikt CTA
2. E-mail modal — **EEN veld** (e-mailadres) + Continue-knop. **Geen adresformulier.**
3. Stripe Checkout hosted page — Stripe regelt adres, telefoon en betaling volledig

### Stripe Checkout config
```javascript
shipping_address_collection: { allowed_countries: ['NL', 'BE', 'DE'] }
phone_number_collection:     { enabled: true }
payment_method_types:        ['ideal', 'bancontact', 'card']
locale:                      'nl' | 'fr' | 'de'   // volgt actieve taal
customer_email:              // meegegeven vanuit e-mail modal
// Stripe Link is automatisch actief voor terugkerende gebruikers
```

### Betaalmethoden (ALTIJD alle drie actief)
- **iDEAL** — niet-onderhandelbaar voor NL (70% betaalt hiermee)
- **Bancontact** — niet-onderhandelbaar voor BE
- **Visa + Mastercard** — voor alle markten

---

## 🖼 Kaders — Optionele Add-On

6 opties (nooit meer, nooit minder — keuzestress vermijden):

| id | Naam | Prijs add-on |
|---|---|---|
| geen | Geen kader | Gratis (standaard) |
| zwart_modern | Zwart Modern | +€25 |
| wit_modern | Wit Modern | +€25 |
| klassiek_goud | Klassiek Goud | +€35 |
| klassiek_walnoot | Klassiek Walnoot | +€35 |
| antiek_zilver | Antiek Zilver | +€30 |

**Implementatie:** PNG overlay systeem. Transparante PNG via `position: absolute`
over het portret. Live preview zonder API calls. Bestanden: Supabase Storage `/frames/`.

---

## 💰 Prijsstructuur

| Product | Maat | Prijs |
|---|---|---|
| Digitale Download | High-res | €24,99 |
| Fine Art Print | 8x10" (20x25cm) | €89 |
| Fine Art Print | 12x16" (30x40cm) | €119 |
| Fine Art Print | 18x24" (45x60cm) | €199 |
| Fine Art Print | 24x36" (60x90cm) | €299 |
| Large Canvas | 12x16" (30x40cm) | €299 |
| Large Canvas | 18x24" (45x60cm) | €399 |
| Large Canvas | 24x36" (60x90cm) | €499 |
| Large Canvas | 40x60" (100x150cm) | €899 |

---

## 🌍 Meertaligheid

> **Bij launch:** NL-only. i18n wordt later toegevoegd (NIET in Sessie 1).

- **NL** — standaard en enige taal bij launch
- **FR** — voor BE markt (wordt later toegevoegd)
- **DE** — voor Duitsland (wordt later toegevoegd)

Wanneer i18n wordt geïmplementeerd:
- Alle user-facing strings in `locales/nl.json`, `locales/fr.json`, `locales/de.json`
- Taalwisselaar zichtbaar in navigatie
- E-mails en WhatsApp share-berichten ook per taal

---

## 📁 Folder Structuur

```
royalpet_app/
├── CLAUDE.md                    ← dit bestand (altijd lezen bij sessiestart)
├── checklist.md                 ← master checklist alle fases
├── .claude/
│   ├── commands/
│   │   ├── start-session.md     ← /start-session — sessie starten
│   │   ├── recap.md             ← /recap — sessie afsluiten
│   │   ├── deploy-check.md      ← /deploy-check — pre-deploy checks
│   │   ├── debug.md             ← /debug — gestructureerd debuggen
│   │   └── learn.md             ← /learn — learning opslaan
│   └── settings.json
├── docs/
│   ├── prd.md                   ← volledige PRD v4
│   ├── saas_plan.md             ← SaaS plan met prijzen, schema, economie
│   └── session-prompts.md       ← overzicht slash commands + workflow
├── learnings/
│   ├── _template.md             ← template voor dagelijkse learnings
│   └── dag-XX.md                ← wordt per sessie aangemaakt
├── assets_visuals/              ← voorbeeld portretten + screenshots
├── src/                         ← Next.js code (nog leeg, wordt in Sessie 1 opgezet)
│   ├── app/
│   │   ├── page.tsx             ← homepage + upload
│   │   ├── preview/[id]/page.tsx ← preview + product/kader selectie
│   │   ├── portret/[id]/page.tsx ← publieke share pagina (virale loop)
│   │   ├── success/[id]/page.tsx ← betaling succesvol + bevestiging
│   │   ├── admin/page.tsx       ← beveiligd met Supabase Auth
│   │   └── blog/[slug]/page.tsx ← Notion CMS
│   ├── app/api/
│   │   ├── generate/            ← Replicate FLUX.1 Pro aanroep
│   │   ├── watermark/           ← Sharp watermark
│   │   ├── checkout/            ← Stripe sessie aanmaken
│   │   ├── webhook/             ← Stripe webhook verwerking
│   │   └── cron/recovery/       ← Vercel Cron abandoned checkout
│   └── locales/
│       ├── nl.json
│       ├── fr.json
│       └── de.json
```

---

## 📧 E-mail Flows (Resend)

### Na betaling — Digitaal
- Klant ontvangt signed Supabase URL (24u geldig) + link naar share pagina

### Na betaling — Print/Canvas
- **Owner** ontvangt: portret thumbnail + volledige bestelling incl. kader + adres
- **Klant** ontvangt: bevestiging + levertijd 7-9 werkdagen

### Admin statuswijziging → automatische klant-email
| Status | E-mail onderwerp |
|---|---|
| In Productie | "Uw portret wordt geprint!" + levertijd |
| Verzonden | "Uw portret is onderweg!" + track & trace link |
| Geleverd | "Genieten van uw meesterwerk?" + muurfoto verzoek + review link |

### Abandoned Checkout Recovery (Vercel Cron elke 5 min)
| Email | Moment | Inhoud |
|---|---|---|
| Email 1 | +20 min | Zachte reminder + portret preview + CTA. Geen korting. |
| Email 2 | +24 uur | Urgentie: "portret wordt morgen verwijderd" + optioneel 10% korting |

---

## 🔑 Environment Variables (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # alleen server-side, NOOIT client-side

# Replicate
REPLICATE_API_TOKEN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@royalpet.app
OWNER_EMAIL=                     # jouw email voor order notificaties

# Notion (Dag 8 — Blog CMS)
NOTION_API_KEY=
NOTION_DATABASE_ID=
```

> ⚠️ **NOOIT** secrets hardcoden in code. Altijd via `.env.local`.
> `.env.local` staat in `.gitignore` — controleer dit voor eerste commit.

---

## 🚀 Bouwplan — 8 Sessies

| # | Dag | Titel | Status |
|---|---|---|---|
| 1 | Dag 1 | Project Foundation | ✅ Klaar |
| 2 | Dag 2 | Upload + AI Generatie | ✅ Klaar |
| 3 | Dag 3 | Preview + Prijzen + Kaders | ✅ Klaar |
| 4 | Dag 4 | E-mail Modal + Stripe Checkout + Paywall + Credits | ✅ Klaar |
| 5 | Dag 5 | Share URL + Virale Loop + i18n | ⬜ Te doen |
| 6 | Dag 6 | Auth + Admin Dashboard | ⬜ Te doen |
| 7 | Dag 7 | Abandoned Checkout Recovery | ⬜ Te doen |
| 8 | Dag 8 | SEO Blog via Notion CMS | ⬜ Te doen |

> **Update de status na elke sessie:** ⬜ Te doen → 🔄 Bezig → ✅ Klaar

---

## 🎨 Design Principes (NOOIT schenden)

**Layout:** Mobile-first responsive design (Tailwind breakpoints: sm → md → lg)

**Typografie**
- Headlines: `Cormorant Garamond` (Google Fonts) — het Renaissance-lettertype
- Bodytekst: `Inter` of `Lato`

**Kleurenpalet**
```
Diep zwart:   #0A0A0A
Warm goud:    #B8942A
Crème wit:    #FAF8F3
Antiek bruin: #3D2B1F
```

**Buttons:** gouden achtergrond `#B8942A` met witte tekst.
**Nooit:** standaard blauwe buttons, felle kleuren, Comic Sans.

**Premium copywriting**
- ❌ "Bestel nu een portret van je hond!"
- ✅ "Vereeuw uw trouwe metgezel als de edelman die hij altijd al was."

---

## 👤 Over de Developer (jij)

- **Niveau:** Beginnend-intermediate. Begrijpt concepten, groeiende technische skills.
- **Werkwijze:** Solo founder, beperkte tijd per sessie.
- **Verwachting van Claude Code:** Leg altijd uit **WAT** je doet en **WAAROM**,
  niet alleen hoe. Geen jargon zonder uitleg.
- **Voorkeur:** Concrete, werkende code boven perfecte abstracties.
  MVP first, optimaliseer later.

---

## ⚙️ WAT Framework (Jouw Werkwijze)

Je opereert binnen het WAT framework:

- **Workflows** — dit bestand + `docs/` bepalen de doelen en aanpak
- **Agent** — jij (Claude Code) coördineert intelligent, vraagt bij twijfel en leert uit je fouten.
- **Tools** — Next.js, Supabase, Stripe, Replicate, Resend

**Kernprincipes:**
1. Kijk eerst of iets al bestaat voor je iets nieuws bouwt
2. Bij errors: lees de volledige foutmelding, fix, hertest, documenteer in `learnings/`
3. Vraag toestemming voor grote architectuurwijzigingen
4. Betaalde API calls (Replicate, Stripe test) altijd eerst bespreken
5. Sla NOOIT secrets op in code — altijd `.env.local`
6. Test zelf werk nadat je een integratie hebt afgerond. Blijf leren
7. Update core principes in deze  file indien nodig. Enkel bij noodzaak.

---

## 📋 Huidige Sessie

```
Sessie nummer:  [5a — Email + Business Model]
Sessie titel:   [Resend Emails + Free Digital Download + Order Numbering]
Status:         [Klaar ✅ — emails gebouwd, domain verified, digital gratis, RP-XXXXX ordernummers]
Vorige sessie:  [Sessie 4b — Frame UX + Prompt fixes + Mobile retry]
Volgende stap:  [Test volledige flow (Stripe CLI), dan Sessie 5b — Share URL + Virale Loop]
Openstaande issues: [Flow nog niet live getest via Stripe, frame overlay PNGs niet in Storage (CSS fallback werkt), MAX_FREE_UPLOADS hardcoded 1]
```

> ✏️ **Update dit blok aan het begin van elke nieuwe sessie.**

---

*Laatste update: Maart 2026 | royalpet.app | Solo founder project*