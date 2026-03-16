# RoyalPet.app — Testing Plan

> Doorloop dit plan volledig voor elke deploy. Gebruik een incognito venster voor schone state.

---

## Pre-test Setup

- [ ] `rm -rf .next` (schone cache)
- [ ] `npm run build` slaagt zonder errors
- [ ] `npm run dev` draait op verwachte poort
- [ ] `stripe listen --forward-to localhost:XXXX/api/webhook` draait
- [ ] `NEXT_PUBLIC_BASE_URL` in `.env.local` matcht de draaiende poort
- [ ] `STRIPE_WEBHOOK_SECRET` matcht de whsec_ uit stripe listen output
- [ ] Replicate credit > $5

---

## Flow 1: Eerste bezoek → Gratis generatie

**Doel:** Nieuwe gebruiker kan 1 gratis portret genereren.

- [ ] Open incognito venster → `http://localhost:XXXX`
- [ ] Homepage toont upload DropZone (geen paywall)
- [ ] Upload geldige foto (JPG/PNG, >512px, <10MB)
- [ ] Laadscherm verschijnt met progress bar + roterende teksten
- [ ] Na ~60-120 sec: redirect naar `/preview/[id]`
- [ ] Portret is zichtbaar met watermark
- [ ] Retry knop toont "1 gratis"
- [ ] Product selector werkt (3 types, maatselectie)
- [ ] Frame selector werkt (6 opties, prijs update)
- [ ] Prijsoverzicht toont correcte totalen
- [ ] Mobile: sticky bottom bar met prijs + CTA

**Validatie errors:**
- [ ] Upload te groot bestand (>10MB) → foutmelding
- [ ] Upload niet-ondersteund formaat (.gif) → foutmelding
- [ ] Upload te lage resolutie (<512px) → foutmelding

---

## Flow 2: Gratis limiet → Paywall

**Doel:** Na 1 generatie verschijnt de paywall.

> **Let op:** In development staat MAX_FREE_UPLOADS op 999.
> Zet tijdelijk op 1 in `src/lib/usage-limit.ts` om te testen.

- [ ] Na 1e generatie: ga terug naar homepage
- [ ] Upload 2e foto → paywall verschijnt (niet de DropZone)
- [ ] Paywall toont:
  - [ ] "Uw gratis portret is gebruikt" header
  - [ ] "Al een mooi portret? Koop het direct →" link (als localStorage portrait ID bestaat)
  - [ ] 3 credit pack cards met correcte prijzen
  - [ ] Pack 2 heeft "Populair" badge
  - [ ] Pack 3 heeft "Beste waarde" badge
  - [ ] "+500 klanten kozen voor canvas" social proof
  - [ ] 3 testimonials met sterren
  - [ ] FAQ items zijn uitklapbaar
  - [ ] "Al credits gekocht? Herstel uw tegoed" link onderaan

---

## Flow 3: Credit pack kopen

**Doel:** Gebruiker koopt credits en kan daarna genereren.

- [ ] Op paywall: klik op een pack (bijv. 5 generaties)
- [ ] Pack krijgt gouden rand + "Geselecteerd" checkmark
- [ ] Email invoerveld verschijnt
- [ ] Voer email in → klik "Koop 5 generaties"
- [ ] Redirect naar Stripe Checkout
- [ ] Stripe toont correct: packnaam, prijs, iDEAL/Bancontact/card
- [ ] Betaal met test card `4242 4242 4242 4242`
- [ ] Redirect terug naar homepage
- [ ] Groene toast: "Credits toegevoegd!"
- [ ] Credit badge verschijnt: "5 credits resterend"
- [ ] DropZone is weer zichtbaar
- [ ] Check terminal: webhook log toont credit pack toegevoegd
- [ ] Check Supabase: `generation_credits` tabel heeft 1 rij met correct email + credits

**Idempotency check:**
- [ ] Geen dubbele rijen in `generation_credits` voor zelfde `stripe_session_id`

---

## Flow 4: Generatie met credits

**Doel:** Credit wordt afgeschreven bij upload.

- [ ] Upload foto op homepage (credits > 0)
- [ ] Generatie start normaal (laadscherm)
- [ ] Na completion: redirect naar `/preview/[id]`
- [ ] Credit badge op preview page toont (credits - 1)
- [ ] Portret is zichtbaar met mannelijke/nobele stijl (niet vrouwelijk)

---

## Flow 5: Retry met credits

**Doel:** Eerste retry gratis, daarna credits.

- [ ] Op preview page: klik "Niet tevreden? Bewerk"
- [ ] RetryPanel toont "1 gratis resterend"
- [ ] Klik "Opnieuw" → generatie start
- [ ] Na completion: NIEUW beeld verschijnt (niet gecached oud beeld)
- [ ] Open RetryPanel opnieuw → toont "X credits — 1 wordt gebruikt"
- [ ] Wijzig stijl → klik "Opnieuw" → credit wordt afgeschreven
- [ ] Nieuw beeld in de geselecteerde stijl

**Retry opties testen:**
- [ ] Stijl wijzigen → ander stijl portret
- [ ] Pose toggle (staand) → ander pose
- [ ] Gender (vrouwelijk) → vrouwelijke kleding
- [ ] Kleur aanpassen (bijv. "bordeauxrood") → kleur aangepast
- [ ] Eigen aanpassing (bijv. "voeg een gouden kroon toe") → wijziging zichtbaar

---

## Flow 6: Product checkout (Digitaal)

**Doel:** Digitale aankoop → success page met download.

- [ ] Op preview: kies "Digitale Download" → €24,99
- [ ] Klik "Bestel uw meesterwerk"
- [ ] EmailModal verschijnt met 1 veld + CTA
- [ ] Voer email in → klik "Ga verder naar betaling"
- [ ] Redirect naar Stripe Checkout
- [ ] Stripe toont: product naam + prijs, GEEN verzendadres
- [ ] Betaal met test card
- [ ] Redirect naar `/success/[id]`
- [ ] Success page toont:
  - [ ] Groen vinkje + "Uw meesterwerk is gereed!"
  - [ ] Correct portret (niet oud/gecached)
  - [ ] Order samenvatting (product + prijs)
  - [ ] Download knop
  - [ ] "Link geldig voor 24 uur"
  - [ ] Ordernummer + email
- [ ] Download knop werkt (high-res PNG zonder watermark)

---

## Flow 7: Product checkout (Print + Kader)

**Doel:** Print met kader → success page met levertijd.

- [ ] Op preview: kies "Fine Art Print" → kies maat (bijv. 45x60cm, €199)
- [ ] Kies kader "Zwart Modern" (+€25)
- [ ] Prijsoverzicht toont: product €199 + kader €25 = Totaal €224
- [ ] Klik CTA → EmailModal → voer email in
- [ ] Stripe Checkout toont:
  - [ ] 2 line items (portret + kader)
  - [ ] Verzendadres formulier (NL/BE/DE)
  - [ ] Telefoon invoer
- [ ] Betaal met test card + vul adres in
- [ ] Redirect naar `/success/[id]`
- [ ] Success page toont:
  - [ ] "Bestelling ontvangen!"
  - [ ] Correct portret
  - [ ] Order samenvatting: product + maat + kader + totaalprijs
  - [ ] "Wat kunt u verwachten?" stappenplan (4 stappen)
  - [ ] Ordernummer + email

**Webhook check:**
- [ ] `orders` tabel: correct product, frame_id, price_cents, shipping_address
- [ ] `portraits` tabel: `paid = true`
- [ ] `abandoned_checkouts` tabel: `recovered = true`
- [ ] Geen dubbele orders voor zelfde `stripe_session_id`

---

## Flow 8: Email reclaim (cookies gewist)

**Doel:** Gebruiker kan credits herstellen na cookie-verlies.

- [ ] Koop credits (flow 3)
- [ ] Verwijder cookies (DevTools → Application → Cookies → Clear All)
- [ ] Refresh homepage → paywall verschijnt (geen credits)
- [ ] Klik "Al credits gekocht? Herstel uw tegoed"
- [ ] Voer zelfde email in → klik "Controleer"
- [ ] Melding: "X credit(s) gevonden! Pagina wordt herladen..."
- [ ] Na reload: DropZone zichtbaar + credit badge

---

## Flow 9: Stripe Checkout cancel

**Doel:** Annulering brengt gebruiker terug naar preview.

- [ ] Start checkout (flow 6 of 7)
- [ ] Op Stripe Checkout: klik "← Terug" of sluit tab
- [ ] Terug op `/preview/[id]` — geen data verloren
- [ ] Kan opnieuw checkout starten

---

## Flow 10: Edge cases

- [ ] Bezoek `/success/[ongeldig-id]` → 404 pagina
- [ ] Bezoek `/preview/[ongeldig-id]` → 404 pagina
- [ ] Bezoek `/success/[id]` voor een ONBETAALD portret → "Betaling niet gevonden" + refresh knop
- [ ] Dubbel-klik op "Bestel uw meesterwerk" → slechts 1 checkout sessie
- [ ] Email modal: leeg email → foutmelding "Voer een geldig e-mailadres in"
- [ ] Email modal: ongeldig email (bijv. "test") → foutmelding
- [ ] Credit pack: leeg email → foutmelding

---

## Mobile Checks

Gebruik Chrome DevTools device toolbar of een echte telefoon.

- [ ] Homepage: DropZone is tappable, goed formaat
- [ ] Paywall: pack cards stapelen verticaal
- [ ] Preview: sticky bottom bar toont prijs + CTA
- [ ] EmailModal: input krijgt focus, keyboard verschijnt
- [ ] Retry panel: scrollbaar als content te lang is
- [ ] Success page: leesbaar op klein scherm

---

## Post-test Cleanup

- [ ] Zet `MAX_FREE_UPLOADS` terug naar dev override als gewijzigd
- [ ] Controleer Replicate credit resterend
- [ ] Noteer gevonden bugs in `learnings/`
