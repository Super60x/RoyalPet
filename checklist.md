# ✅ RoyalPet.app — Master Checklist

> **Hoe gebruiken:** Werk van boven naar beneden.
> Zet ✅ als iets klaar is. Zet 🔄 als je er mee bezig bent.
> Gedetailleerde notities per sessie → `learnings/dag-XX.md`

---

## 🔧 FASE 0 — Accounts & Setup (Doe dit eerst)

### Externe accounts
- [x] **Supabase** — account + nieuw project aangemaakt → API keys gekopieerd ✅
- [x] **Vercel** — account gekoppeld aan GitHub ✅
- [x] **Replicate** — account + API token opgehaald ✅
- [x] **Stripe** — account aangemaakt in test mode ✅
  - [x] iDEAL geactiveerd (Settings → Payment Methods) ✅
  - [x] Bancontact geactiveerd ✅
  - [x] EUR ingesteld als standaard valuta ✅
- [x] **Resend** — account + API key opgehaald ✅
- [ ] **Notion** — database aangemaakt voor blog CMS (Sessie 8)

### Domein & hosting
- [ ] `royalpet.app` geregistreerd (Namecheap of TransIP)
- [ ] Domein gekoppeld aan Vercel
- [ ] SSL actief (gratis via Vercel, automatisch)

### VS Code & GitHub
- [x] GitHub repo aangemaakt (`royalpet_app`) ✅
- [x] Folder structuur aangemaakt (zie `CLAUDE.md`) ✅
- [x] `CLAUDE.md` ingevuld ✅
- [x] `checklist.md` ingevuld ✅
- [x] `.env.local` aangemaakt met alle API keys ✅
- [x] `.gitignore` bevat `.env.local` — **controleer voor eerste commit!** ✅
- [x] Claude Code plugin actief in VS Code ✅

### Claude Code skills installeren
- [ ] `npx claude-code-templates@latest --skill=development/senior-fullstack --yes`
- [ ] `npx claude-code-templates@latest --skill=development/senior-frontend --yes`

### Dev tools
- [x] Stripe CLI geïnstalleerd + geconfigureerd (acct_1T9AYwGmgK4ipwzS) ✅

---

## 🏗️ FASE 1 — Bouwen (8 Sessies ~17,5 uur)

### Sessie 1 — Foundation (~2 uur) ✅
- [x] Next.js 14 + TypeScript + Tailwind geïnstalleerd ✅
- [x] Mobile-first layout basis (Tailwind breakpoints) ✅
- [x] Supabase client ingesteld + verbinding getest ✅
- [x] Database tabellen aangemaakt via migraties:
  - [x] `portraits` (incl. customer_email + retry_count kolommen) ✅
  - [x] `orders` ✅
  - [x] `frames` ✅
  - [x] `abandoned_checkouts` ✅
- [x] Supabase Storage buckets aangemaakt:
  - [x] `portraits-public` (PUBLIC) ✅
  - [x] `portraits-private` (PRIVATE) ✅
  - [x] `frames` (PUBLIC) ✅
- [x] Frames tabel gevuld met 6 standaard kaderopties ✅
- [x] Eerste Vercel deploy succesvol (lege homepage live) ✅
- [x] Learnings opgeslagen → `learnings/dag-01.md` ✅

### Sessie 2 — Upload + AI Generatie (~3 uur) ✅
- [x] Drag-and-drop upload component werkend ✅
- [x] Client-side upload validatie (jpg/png/webp, max 10MB, min resolutie) ✅
- [x] Replicate FLUX.1 Pro API aangeroepen met config-based Renaissance prompt ✅
- [x] Rate limiting op `/api/generate` (max 5/IP/uur) ✅
- [x] Client-side polling elke 2-3 sec via `/api/generate/status` ✅
- [x] Progress bar met roterende wachtteksten (~60 sec) ✅
- [x] Portret opgeslagen in `portraits` tabel met 6-karakter slug ✅
- [x] Watermarked versie naar `portraits-public`, clean naar `portraits-private` ✅
- [x] Redirect naar `/preview/[id]` werkend ✅
- [x] Error handling bij slechte foto of API fout ✅
- [x] Learnings opgeslagen → `learnings/dag-02.md` ✅
- **Bonus:** 4 kunststijlen (random selectie) + retry panel met stijlkeuze, gender toggle, eigen aanpassing ✅
- **Bonus:** Model geïtereerd van flux-1.1-pro → flux-canny-pro → flux-depth-pro → flux-kontext-pro (beste likeness + stijl) ✅
- **Bonus:** Retry panel als donkere overlay over portret (competitor-stijl) ✅

### Sessie 3 — Preview + Prijzen + Kaders (~2 uur) ✅
- [x] Sharp watermark op server gegenereerd ✅ (gebouwd in Sessie 2, verbeterd in Sessie 3)
- [x] Watermarked preview zichtbaar op `/preview/[id]` ✅
- [x] Product selector werkend (Digitaal / Fine Art / Canvas) ✅
- [x] Maatvarianten per producttype zichtbaar ✅
- [x] Alle prijzen correct conform prijstabel in `CLAUDE.md` ✅
- [x] Kaderkeuzebalk met 6 opties werkend ✅
- [ ] Placeholder kader-overlay PNGs aangemaakt (vervangen door Fiverr versies later)
- [ ] Live frame preview via PNG overlay (`position: absolute`)
- [x] Dynamische prijsupdate (product + kader gecombineerd) ✅
- [x] Retry knop werkend (1 gratis retry, daarna €4,99 via Stripe) ✅
- [x] Learnings opgeslagen → `learnings/dag-03.md` ✅
- **Bonus Sessie 3:** Usage limiting — IP + signed cookie (max 3 uploads/30 dagen) ✅
- **Bonus Sessie 3:** Model switch naar GPT Image 1.5 (primary) + FLUX.2 Pro (fallback) ✅
- **Bonus Sessie 3:** Auto-upscaling via Real-ESRGAN 2x op elke generatie ✅
- **Bonus Sessie 3:** 8 gestructureerde prompts (4 stijlen × 2 poses) — pet-agnostisch, anti-instructies ✅
- **Bonus Sessie 3:** Pose toggle (liggend/staand) + kleur aanpassen in RetryPanel ✅
- **Bonus Sessie 4:** Two-step product selector (type → maat) met tooltips voor 50+ UX ✅
- **Bonus Sessie 4:** PortraitHero component met 2:3 aspect ratio + frame overlay systeem ✅
- **Bonus Sessie 4:** Sticky mobile price bar + desktop prijsoverzicht ✅
- **Bonus Sessie 4:** SocialProof component (trust signals) ✅
- **Bonus Sessie 4:** RetryPanel volledig vertaald naar Nederlands ✅

### Sessie 4 — E-mail Modal + Stripe Checkout (~1,5 uur)
- [ ] E-mail modal: 1 veld + Continue knop (GEEN adresformulier hier)
- [ ] Email opslaan in `portraits.customer_email` + `abandoned_checkouts`
- [ ] `/api/checkout` insert rij in `abandoned_checkouts`
- [ ] Stripe Checkout sessie aangemaakt met:
  - [ ] `shipping_address_collection`: NL, BE, DE
  - [ ] `phone_number_collection`: true
  - [ ] `payment_method_types`: ideal, bancontact, card
  - [ ] `locale` volgt actieve taal
  - [ ] `customer_email` meegegeven vanuit modal
- [ ] Stripe webhook verwerkt `checkout.session.completed`
- [ ] Na betaling digitaal: signed URL + redirect `/success/[id]`
- [ ] Na betaling print: Resend notificatie naar owner + klant
- [ ] Webhook zet `abandoned_checkouts.recovered = true`
- [ ] Learnings opgeslagen → `learnings/dag-04.md`

### Sessie 5 — Share URL + Virale Loop + i18n (~2,5 uur)
- [ ] Publieke pagina `/portret/[id]` werkend
- [ ] CSS ornate gouden frame rondom portret
- [ ] WhatsApp deelknop met vooringevuld bericht
- [ ] Email deelknop werkend
- [ ] "Kopieer link" knop met visuele bevestiging
- [ ] CTA "Maak ook een portret" zichtbaar → homepage
- [ ] `share_count` wordt opgehoogd bij elk bezoek
- [ ] i18n setup: next-i18next geconfigureerd (NL default, FR, DE)
- [ ] Alle bestaande strings verplaatst naar `locales/nl.json`
- [ ] `locales/fr.json` en `locales/de.json` aangemaakt
- [ ] Taalwisselaar in navigatie
- [ ] Learnings opgeslagen → `learnings/dag-05.md`

### Sessie 6 — Auth + Admin Dashboard (~3 uur)
- [ ] Supabase Auth geconfigureerd
- [ ] Google OAuth werkend
- [ ] Email magic link werkend
- [ ] Optionele signup prompt na betaling op `/success/[id]`
- [ ] Auto-claim: gastorders gekoppeld bij bestaand emailadres
- [ ] `/admin` beschermd met auth middleware
- [ ] Ordertabel: datum / klant / product+maat+kader / bedrag / status
- [ ] Status dropdown: Ontvangen → In Productie → Verzonden → Geleverd
- [ ] Track & trace invoerveld (verschijnt bij status Verzonden)
- [ ] Omzetoverzicht boven tabel
- [ ] Abandoned checkouts tab
- [ ] Auto email per statuswijziging via Resend:
  - [ ] In Productie → klant: bevestiging + 7-9 werkdagen
  - [ ] Verzonden → klant: track & trace link
  - [ ] Geleverd → klant: muurfoto verzoek + review link
- [ ] Learnings opgeslagen → `learnings/dag-06.md`

### Sessie 7 — Abandoned Checkout Recovery + Data Cleanup (~2 uur)
- [ ] Vercel Cron Job geconfigureerd (elke 5 minuten)
- [ ] Email 1 verstuurd +20 min: zachte reminder + portret preview (geen korting)
- [ ] Email 2 verstuurd +24 uur: urgentie + optioneel 10% korting
- [ ] `recovery_sent_at` bijgewerkt na elke verzending
- [ ] Cron stopt automatisch als `recovered = true`
- [ ] HTML email templates in NL (FR/DE als i18n klaar is)
- [ ] Cron job voor verwijdering onbetaalde portretten (>30 dagen)
  - [ ] Verwijder rij uit `portraits` tabel
  - [ ] Verwijder bestanden uit `portraits-public` + `portraits-private` buckets
- [ ] Learnings opgeslagen → `learnings/dag-07.md`

### Sessie 8 — SEO Blog via Notion CMS (~2 uur)
- [ ] Notion database properties: Title, Slug, MetaDescription, FocusKeyword, OGImageUrl, Published, PublishDate
- [ ] Next.js fetcht posts via Notion API (ISR 60 min)
- [ ] `/blog/[slug]` pagina werkend + statisch gegenereerd
- [ ] Dynamische `<meta>` + Open Graph tags per post
- [ ] Eerste 3 SEO-posts gepubliceerd:
  - [ ] `cadeau-hond-verjaardag`
  - [ ] `renaissance-portret-kat-bestellen`
  - [ ] `hondenschilderij-laten-maken`
- [ ] Learnings opgeslagen → `learnings/dag-08.md`

---

## 🚀 FASE 2 — Pre-Launch

### Technisch
- [ ] Alle pagina's getest op mobiel (iOS + Android)
- [ ] Lighthouse score ≥ 90 op Performance + SEO
- [ ] Alle afbeeldingen: Next.js Image + WebP + retina (1200px+)
- [ ] Error tracking actief (Vercel Analytics of Sentry)
- [ ] Favicon + og:image ingesteld
- [ ] `robots.txt` + `sitemap.xml` aangemaakt
- [ ] `/privacy` pagina gepubliceerd
- [ ] `/terms` pagina gepubliceerd

### Stripe live zetten
- [ ] Stripe live mode geactiveerd
- [ ] Live keys in Vercel environment variables gezet
- [ ] Webhook endpoint geconfigureerd voor productie URL
- [ ] Test betaling gedaan met echte iDEAL (klein bedrag)
- [ ] Test betaling gedaan met echte Bancontact

### Content
- [ ] Minimaal 8 portretvoorbeelden gegenereerd (mix rassen)
- [ ] Minimaal 6 kader-overlay PNG's besteld via Fiverr (~€25)
- [ ] 5 gratis portretten weggegeven voor social proof
- [ ] Minimaal 3 klantmuurfoto's verzameld
- [ ] Trustpilot of Google Reviews pagina aangemaakt + eerste 3 reviews

### Design check
- [ ] Cormorant Garamond geladen op alle headings
- [ ] Kleurenpalet correct: `#0A0A0A` / `#B8942A` / `#FAF8F3` / `#3D2B1F`
- [ ] Alle CTA buttons goud met witte tekst
- [ ] Betaalbadges in footer: iDEAL + Bancontact + Stripe
- [ ] Geen generieke copywriting (zie premiumtaal in `CLAUDE.md`)

---

## 📣 FASE 3 — Launch & Groei

### Week 1-2 — Social proof eerst
- [ ] Post in Honden Nederland (200k+ leden)
- [ ] Post in Katten Nederland (150k+ leden)
- [ ] Post in Honden België / Chiens Belgique
- [ ] Post in Hunde Deutschland
- [ ] 5 gratis portretten weggegeven + muurfoto's ontvangen
- [ ] Buffer of Later account aangemaakt voor content scheduling
- [ ] 3 Canva templates gemaakt: before/after / quote / testimonial
- [ ] Eerste week posts ingepland (7 posts)

### Marktplaats
- [ ] Advertentie 1 live: "AI Renaissance portret — vanaf €24,99"
- [ ] Advertentie 2 live: kader-lokkertje "portret incl. gouden kader €99"

### Partnerships
- [ ] Eerste 10 hondenscholen gecontacteerd
- [ ] Eerste rasvereniging nieuwsbrief geplaatst
- [ ] Eerste dierenkliniek folder + QR code geleverd

### Meta Ads (Week 3+)
- [ ] Facebook Pixel geïnstalleerd op site
- [ ] Fase A campagne live: €5/dag, NL, 3 creatives, doelgroep 30-60 jaar
- [ ] Retargeting campagne: €2/dag voor bezoekers zonder aankoop

---

## 📊 KPI's — Bijhouden per week

| Metric | Doel Week 1 | Doel Maand 1 | Nu |
|---|---|---|---|
| Bezoekers/dag | 50 | 200 | — |
| Upload → betaling conversie | 10% | 15% | — |
| Digitale verkopen | 3 | 20 | — |
| Print/Canvas verkopen | 0 | 5 | — |
| Maandomzet | €75 | €500 | — |
| Share rate per portret | 20% | 30% | — |
| Abandoned checkout recovery | — | 10% | — |
| Break-even bereikt | 20 digitale sales | | — |

---

## 💡 FASE 4 — Na Eerste Klanten

- [ ] Interactieve maatvisualisator: SVG muurmockup
- [ ] Retry feature: €4,99 per nieuwe AI generatie
- [ ] Email sequenties: dag 3 review / dag 7 upsell naar print
- [ ] Affiliate systeem: NAAM10 codes + commissie tracking
- [ ] Eerste Meta Ads video: before/after transformatie reveal

---

*Laatste update: [vul datum in] | royalpet.app | Sessie [X/8]*