# RoyalPet.app — Product Requirements Document (PRD) v4

> Versie 4 | Solo founder | Next.js + Supabase + Replicate + Stripe

---

## 1. Productoverzicht

RoyalPet.app is een e-commerce SaaS waarbij klanten een foto van hun huisdier uploaden en een AI-gegenereerd Renaissance-stijl portret ontvangen. Ze kunnen dit bestellen als digitale download, fine art print of canvas, optioneel met een klassiek kader.

**Doelmarkt:** NL + BE + DE | Hondeneigenaren 35–65 | Cadeau + eigengebruik

---

## 2. Gebruikersflow (Happy Path)

```
1. Landingspagina → CTA "Maak uw portret"
2. Upload sectie op homepage → foto uploaden (drag & drop of klik)
3. AI generatie → Replicate FLUX.1 Pro → portret klaar in ~60 seconden (client-side polling)
4. Preview pagina → portret zien + product kiezen + kader kiezen
5. Email modal → emailadres invullen (ALLEEN dit veld)
6. Stripe Checkout → adres + betaalmethode (iDEAL/Bancontact/card)
7. Betaling succesvol → success pagina + bevestigingsmail
8. Fulfillment → founder bestelt bij Gelato → klant ontvangt statusmails
```

---

## 3. Tech Stack

| Laag | Technologie | Reden |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | SSR + SSG + API routes in één |
| Styling | Tailwind CSS | Snel, consistent, utility-first |
| Design | Mobile-first responsive | Tailwind breakpoints, social traffic = mobiel |
| i18n | NL-only bij launch | i18n (NL/FR/DE) wordt later toegevoegd |
| Database | Supabase (PostgreSQL) | Gratis tier, realtime, auth ingebouwd |
| AI | Replicate — FLUX.1 Pro | Beste kwaliteit, ~€0,05/image, config-based prompt |
| Betaling | Stripe Checkout (hosted) | PCI-compliant, iDEAL + Bancontact |
| Email | Resend | Developer-friendly, goedkoop |
| Print fulfillment | Gelato | EU-fulfillment, geen voorraad |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## 4. Database Schema

### 4.1 portraits
```sql
CREATE TABLE portraits (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users NULLABLE,
  image_url text NOT NULL,        -- met watermerk (portraits-public bucket)
  clean_url text NOT NULL,        -- zonder watermerk (portraits-private bucket)
  style text DEFAULT 'renaissance',
  pet_name text,
  customer_email text,            -- opgeslagen bij email modal
  paid boolean DEFAULT false,
  retry_count integer DEFAULT 0,  -- 1 gratis retry, daarna €4,99
  share_count integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);
```

### 4.2 orders
```sql
CREATE TABLE orders (
  id text PRIMARY KEY,
  portrait_id text REFERENCES portraits(id),
  user_id uuid NULLABLE,
  product text NOT NULL,          -- 'digital' | 'print_8x10' | 'canvas_12x16' etc.
  price_cents integer NOT NULL,
  frame_id text NULLABLE,
  frame_price_cents integer NULLABLE,
  is_gift boolean DEFAULT false,
  gift_message text,
  shipping_address jsonb,
  customer_email text NOT NULL,
  stripe_session_id text UNIQUE,
  status text DEFAULT 'ontvangen', -- ontvangen | in_productie | verzonden | geleverd
  fulfilled boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
```

### 4.3 frames
```sql
CREATE TABLE frames (
  id text PRIMARY KEY,
  name text NOT NULL,
  price_cents integer NOT NULL,
  overlay_url text NOT NULL,      -- Supabase Storage URL naar PNG overlay
  active boolean DEFAULT true
);
```

### 4.4 abandoned_checkouts
```sql
CREATE TABLE abandoned_checkouts (
  id text PRIMARY KEY,
  email text NOT NULL,
  portrait_id text,
  portrait_url text,
  checkout_url text,
  product text,
  price_cents integer,
  recovery_sent_at timestamp NULLABLE,
  recovered boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
```

---

## 4.5 Supabase Storage

| Bucket | Type | Inhoud |
|---|---|---|
| `portraits-public` | PUBLIC | Watermarked preview afbeeldingen |
| `portraits-private` | PRIVATE | Clean originelen (signed URL 24u na betaling) |
| `frames` | PUBLIC | Kader overlay PNG's |

---

## 4.6 Upload Validatie & Rate Limiting

- **Client-side:** bestandstype (jpg/png/webp), max 10MB, minimale resolutie
- **Server-side:** rate limiting max 5 generaties per IP per uur op `/api/generate`
- **Geen** AI-validatie van fotokwaliteit (te complex voor MVP)

---

## 4.7 Retry Beleid

- 1 gratis retry per portret (zelfde foto, nieuwe generatie)
- Extra retries: €4,99 per stuk via Stripe
- `retry_count` in portraits tabel

---

## 4.8 Data Cleanup

- Onbetaalde portretten + storage files: auto-verwijderd na 30 dagen
- Via Vercel Cron Job (dagelijks)

---

## 5. Pagina's en Routes

| Route | Beschrijving |
|---|---|
| `/` | Landingspagina + upload + CTA |
| `/preview/[id]` | Portret preview + product/kader selectie + email modal |
| `/portret/[id]` | Publieke share pagina (virale loop) |
| `/success/[id]` | Betaling succesvol + bevestiging + optionele signup |
| `/admin` | Beveiligd dashboard (alleen founder, Supabase Auth) |
| `/blog/[slug]` | SEO blogposts via Notion CMS |
| `/api/generate` | POST: Replicate FLUX.1 Pro aanroep |
| `/api/watermark` | POST: Sharp watermark generatie |
| `/api/checkout` | POST: Stripe sessie aanmaken + abandoned_checkouts insert |
| `/api/webhook` | POST: Stripe webhook verwerking |
| `/api/cron/recovery` | GET: abandoned checkout recovery emails |

> **Verwijderd:** `/upload` (upload zit op homepage), `/checkout` (Stripe hosted, geen eigen pagina), `/gallery` (niet in MVP scope)

---

## 6. Checkout Flow (KRITISCH — NOOIT wijzigen)

### Regel 1: Altijd Stripe hosted checkout
Nooit een eigen adresformulier bouwen. Stripe beheert PCI-compliance, adresvalidatie en betaalmethoden.

### Regel 2: Betaalmethoden
Altijd iDEAL + Bancontact + creditcard activeren. Zonder iDEAL verlies je >60% van NL conversies.

### Stripe configuratie
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['ideal', 'bancontact', 'card'],
  mode: 'payment',
  billing_address_collection: 'required',
  shipping_address_collection: {
    allowed_countries: ['NL', 'BE', 'DE'],
  },
  line_items: [
    {
      price_data: {
        currency: 'eur',
        product_data: { name: productName, images: [portraitUrl] },
        unit_amount: priceInCents,
      },
      quantity: 1,
    },
    // Optioneel: kader als tweede line_item
    ...(frameId ? [{
      price_data: {
        currency: 'eur',
        product_data: { name: `${frameName} kader` },
        unit_amount: framePriceCents,
      },
      quantity: 1,
    }] : []),
  ],
  customer_email: customerEmail,
  success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/preview/${portraitId}`,
  metadata: {
    portrait_id: portraitId,
    frame_id: frameId ?? '',
    product: productKey,
  },
})
```

---

## 7. Prijzen

| Product | Prijs | Marge (schatting) |
|---|---|---|
| Digitale Download | €24,99 | ~97% |
| Fine Art Print 8x10" | €89 | ~65% |
| Fine Art Print 12x16" | €119 | ~60% |
| Fine Art Print 18x24" | €199 | ~58% |
| Fine Art Print 24x36" | €299 | ~55% |
| Canvas 12x16" | €299 | ~55% |
| Canvas 18x24" | €399 | ~55% |
| Canvas 24x36" | €499 | ~53% |
| Canvas 40x60" | €899 | ~50% |

---

## 8. Kaders als Add-On

### 8.1 Kaderopties
| Kadertype | Prijs add-on | Beschrijving |
|---|---|---|
| Geen kader (standaard) | Gratis | Standaard geselecteerd |
| Zwart Modern | +€25 | Strak zwart aluminium, 2cm breed |
| Wit Modern | +€25 | Wit aluminium, minimalistisch |
| Antiek Zilver | +€30 | Zilverkleurig met veroudering |
| Klassiek Goud | +€35 | Vergulde sierlijst, perfect bij Renaissance |
| Klassiek Walnoot | +€35 | Donker hout, meest verkochte type |

### 8.2 UX-flow kaderselectie
1. Foto geüpload → portret gegenereerd → preview pagina
2. Onder de afbeelding: klikbare miniaturen per kadertype + naam + prijs
3. Bij selectie: prijs past zich dynamisch aan
4. Kadertype als metadata naar Stripe Checkout + orders tabel
5. Admin dashboard toont: portret + kadertype + maat = bestelspecificatie voor Gelato

### 8.3 Technische implementatie
- **Overlay systeem:** PNG met transparante binnenkant per kadertype. Next.js legt overlay via `position: absolute` over het portret. Live preview zonder API calls.
- **Assets:** 6 overlay PNG's (800x800px) laten maken op Fiverr (~€20-30). Uploaden naar Supabase Storage `/frames/`.
- **Supabase frames tabel:** `id, name, price_cents, overlay_url, active`. Nieuwe kaders toevoegen zonder code.
- **Stripe:** kader als tweede `line_item` in de sessie.

---

## 9. Admin Order Dashboard

### 9.1 Functionaliteiten
| Functie | Detail |
|---|---|
| Ordertabel | Gesorteerd op datum: klantnaam, product + maat + kader, bedrag, status, actie |
| Status dropdown | Ontvangen → In Productie → Verzonden → Geleverd. Triggert klant-email. |
| Track & trace invoer | Tekstveld bij status Verzonden. Founder plakt PostNL/DHL link in. |
| Omzetoverzicht | Totale omzet maand, aantal orders, gem. orderwaarde. Geen grafieken. |
| Abandoned checkouts tab | Email + tijd + recovery status |
| Beveiliging | `/admin` beschermd met Supabase Auth |

### 9.2 Automatische klant-emails per statuswijziging
| Status | Onderwerp | Body |
|---|---|---|
| In Productie | "Uw portret wordt geprint! 🖼️" | Bevestiging + levertijd 7-9 werkdagen + thumbnail |
| Verzonden | "Uw portret is onderweg! 📦" | Track & trace link + verwachte leverdatum |
| Geleverd | "Genieten van uw meesterwerk? 📸" | Muurfoto verzoek + review link + social share CTA |

---

## 10. Abandoned Checkout Recovery

### Flow
```
Klant vult email in maar verlaat Stripe → email + portrait_id opslaan in abandoned_checkouts
→ Cron Job elk uur → query abandoned_checkouts WHERE recovery_sent_at IS NULL AND created_at < NOW() - INTERVAL '1 hour'
→ Resend stuurt herinneringsmail met portret preview + directe checkout link
→ recovery_sent_at updaten
```

### Email template
- **Onderwerp:** "Uw koninklijk portret wacht op u 👑"
- **Body:** portret thumbnail + "U was er bijna!" + CTA knop naar checkout URL
- **Timing:** 1 uur na verlaten checkout

---

## 11. SEO Blog via Notion CMS

### 11.1 Architectuur
- Notion database = CMS. Publiceren = checkbox aanzetten. Geen deployment nodig.
- Notion properties per post: `Title`, `Slug`, `Meta Description` (max 155 tekens), `Focus Keyword`, `OG Image URL`, `Published` (checkbox), `Publish Date`
- Next.js fetcht posts via Notion API bij build of via ISR elke 60 minuten
- URL: `royalpet.app/blog/[slug]` — statisch gegenereerd, snel voor Google

### 11.2 SEO blogtopics (kant-en-klaar)
| Zoekterm (NL) | Blogpost titel |
|---|---|
| cadeau hond verjaardag | 10 unieke cadeaus voor hondeneigenaren — #1 dit jaar |
| koninklijk portret huisdier | Hoe laat je een koninklijk portret maken van je huisdier? |
| Renaissance portret kat bestellen | Renaissance portret van je kat: zo werkt het en dit kost het |
| gepersonaliseerd cadeau hond | Het meest persoonlijke cadeau voor hondenmensen: een portret |
| sinterklaas cadeau huisdier | Sinterklaas cadeau voor de echte dierenvriend (november push) |
| kerst cadeau hond 2026 | Origineel kerstcadeau voor hondenmensen — klaar in 48 uur |
| hondenschilderij laten maken | Hondenschilderij laten maken: opties, prijzen en kwaliteit |

---

## 12. Distributie & Marketing

### 12.1 Fase 1 — Week 1-2: Social proof verzamelen
**Actie:** Post in 5 grote Facebook groepen. Bied 5 gratis digitale portretten aan in ruil voor een muurfoto + review.

**Script:**
> "Ik lanceer een nieuw concept: AI-gegenereerde Renaissance portretten van jouw huisdier. Ik zoek 5 hondeneigenaren die gratis een portret willen ontvangen in ruil voor een eerlijke review en foto van het resultaat aan de muur. Interesse? Stuur mij een foto van je hond via DM!"

**Doel:** 5 muurfoto's als advertentiemateriaal + 5 reviews op de website.

### 12.2 Facebook groepen per markt
| Groep | Grootte | Aanpak |
|---|---|---|
| Honden Nederland | 200.000+ | Before/after post + toestemming admin |
| Katten Nederland | 150.000+ | Mysterieuzer, eleganter angle |
| Honden België / Chiens Belgique | 80.000+ | NL en FR aparte posts |
| Hunde Deutschland | 300.000+ | Kwaliteit en vakmanschap benadrukken |
| Rasspecifieke groepen (Labrador, Golden) | 20.000–80.000 | Hogere engagementrate |
| Huisdierfotografie Nederland | variabel | Fotografen als partners |

### 12.3 Content posttypen
| Posttype | Frequentie | Aanpak |
|---|---|---|
| Before/After | 2x/week | Links hondenfoto, rechts portret |
| Klantmuurfoto | zodra beschikbaar | Naam hond vermelden, toestemming vragen |
| Humor post | 1x/week | "Mijn hond denkt al tijden dat hij van adel is. Nu hebben we bewijs." |
| Cadeau-aankondiging | seizoensgebonden | Sinterklaas, Kerst, Moederdag |
| Behind the scenes | 1x/2 weken | Hoe het AI-portret gegenereerd wordt |

### 12.4 Content automatisering
- **Tool:** Buffer of Later — plan posts voor Facebook, Instagram, Pinterest
- **Batch:** elke maandag 45 minuten → 7 posts voor de week
- **Claude workflow:** portret + hondennaam → Claude schrijft 5 caption variaties NL/FR/DE
- **Canva templates:** 3-4 vaste formats (before/after, quote, testimonial)

### 12.5 Marktplaats strategie
- **Categorie:** Kunst en Antiek → Schilderijen en Tekeningen → Overige
- **Titel:** "Renaissance portret van uw huisdier — AI gegenereerd — Fine Art Print — vanaf €24,99"
- **Lokkertje:** aparte advertentie met kader erbij voor €99 (portret + klassiek goud kader)
- **Tip:** ververs elke 3 dagen gratis. Topadvertentie (€3,99/week) rond Sinterklaas + Kerst.
- **Respons script:** "Stuur mij een foto van uw huisdier via DM en ik stuur u een gratis voorbeeld portret!"

### 12.6 Offline partnerships
| Partner | Voorstel |
|---|---|
| Hondenscholen (800+ in NL) | 15% commissie via unieke affiliate link |
| Rasverenigingen | Nieuwsbrief advertentie, vaak gratis of €50-100 |
| Dierenklinieken | A5 folder in wachtkamer + QR code (€50 voor 500 folders) |
| Trimsalons | Poster of flyer + 10% commissie |
| Dierenverzekeraars (Centraal Beheer, Reaal) | Sponsored content in nieuwsbrief |

### 12.7 Affiliate & Referral systeem
- **Klanten:** unieke kortingscode (NAAM10) na aankoop. Ontvanger -10%, referrer +€5 krediet.
- **Partners:** UTM link, 15% commissie, maandelijks uitbetalen via bankoverschrijving.
- **Tracking:** Supabase tabel `affiliates (id, orders_count, commission_total)` + Stripe coupon codes.

### 12.8 Meta Ads stappenplan
| Fase | Budget | Aanpak |
|---|---|---|
| A — Testen (week 3-4) | €5/dag | 3 creatives: before/after, muurfoto, humor. Doelgroep NL 30-60. |
| B — Opschalen (maand 2) | €10/dag | Winnende creative + lookalike audience via Facebook Pixel |
| C — International (maand 3) | €5/dag per markt | NL campagne dupliceren naar BE en DE |
| Retargeting | €2/dag | Bezoekers die email invulden maar niet betaalden |
| Sinterklaas/Kerst push | Budget x2 | Cadeau-angle + "Klaar voor 5 december" urgentie |

> **Regel:** pas starten met betaalde ads na de eerste 10 organische orders.

### 12.9 TikTok & Instagram Reels
| Video concept | Aanpak |
|---|---|
| AI transformatie reveal | Hondenfoto → fade naar portret. Dramatische muziek. 15 seconden. |
| Order unboxing | Klant opent pakket. Reactie op gezicht. Portret aan muur. |
| "What my dog thinks he is" | Trending format. Hond + portret + grappige tekst. #royaldogportrait |
| Tijdlapse onthulling | Portret verschijnt pixel voor pixel. "Link in bio." |

### 12.10 Pinterest
- **Aanmaken:** 3 borden: "Koninklijke Huisdierportretten", "Cadeau Ideeën Hond", "Renaissance Art Pets"
- **Formaat:** verticaal 1000x1500px, zoekwoorden in beschrijving
- **Tool:** Tailwind Pinterest scheduler — 10 pins/week, €9/maand
- **Resultaat:** na 3 maanden 500-2000 maandelijkse bezoekers

---

## 13. Premium Website Design

### 13.1 Typografie & kleur
- **Headlines:** Cormorant Garamond (Google Fonts, gratis) — het Renaissance-lettertype
- **Body:** Inter of Lato — clean, contrasteert mooi met Cormorant
- **Kleurenpalet:** `#0A0A0A` (zwart) · `#B8942A` (goud) · `#FAF8F3` (crème) · `#3D2B1F` (bruin)
- **Buttons:** gouden achtergrond `#B8942A` + witte tekst. Nooit standaard blauw.
- **Nooit:** felle kleuren, gradiënten, Comic Sans, flat-lay mockups

### 13.2 Cheap vs. Premium copywriting
| Cheap | Premium |
|---|---|
| Bestel nu een portret van je hond! | Vereeuw uw trouwe metgezel als de edelman die hij altijd al was. |
| AI gegenereerd portret | Meesterwerk gecreëerd door kunstmatige intelligentie, geïnspireerd op de Vlaamse Meesters |
| Goedkoop en snel | Geleverd binnen 7-9 werkdagen — vakkundig verpakt, museumkwaliteit gegarandeerd. |
| Kies een maat | Kies het formaat dat past bij uw interieur — van intiem boudoir tot statig salon. |

### 13.3 Homepage structuur
1. **Hero:** lifestyle foto + portret + headline + gouden CTA-knop
2. **Bewijsrij:** 5 sterren + "247 portretten gecreëerd" + 3 muurfoto's
3. **Hoe het werkt:** 3 stappen (upload → portret → bestel)
4. **Galerij:** 6-8 portretten in masonry grid
5. **Productoverzicht:** digitaal / print / canvas met prijzen
6. **Testimonials:** 3 reviews met naam + hondennaam + foto
7. **FAQ:** 6-8 vragen (SEO-waarde + bezwaaroverwinning)
8. **Footer:** betaalbadges + iDEAL/Bancontact logos + privacy/terms

### 13.4 Social proof elementen
- Live portrettenteller via Supabase: "Al 247 portretten gecreëerd"
- Trustpilot of Google Reviews (5 reviews = genoeg voor launch)
- 100% tevredenheidsgarantie badge
- Stripe beveiligingsbadge + iDEAL + Bancontact logo's in checkout footer

---

## 14. Niet in scope voor MVP

- Verplichte login voor klanten (optioneel account na betaling wél in scope — Sessie 6)
- Meerdere AI stijlen (alleen Renaissance bij launch, maar prompt is config-based)
- Automatische Gelato order API (handmatig bij launch)
- Upsell na aankoop
- Meertalige klantenservice chat
- Abonnementsmodel
- i18n (NL-only bij launch, FR/DE wordt later toegevoegd)

---

## 15. Openstaande acties voor launch

- [ ] Supabase project aanmaken + schema uitvoeren
- [ ] Vercel project aanmaken + domein koppelen
- [ ] Replicate account + FLUX.1 Pro model testen
- [ ] Stripe activeren + iDEAL + Bancontact aanzetten
- [ ] Resend account + domein verificatie
- [ ] 6 kader-overlay PNG's laten maken op Fiverr (~€25)
- [ ] 5 gratis portretten weggeven in Facebook groepen (social proof)
- [ ] CLAUDE.md + checklist.md in VS Code project plakken
- [ ] `.env.local` aanmaken met alle API keys
- [ ] `.gitignore` controleren — `.env.local` moet erin staan vóór eerste commit