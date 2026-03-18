# Learnings — Dag 05a: Resend Emails + Free Digital Download + Order Numbering

> Sessie: 5a | Datum: 2026-03-18

---

## Wat is er gebouwd

### Email notificaties (Resend)
- `src/lib/email.ts` — Resend client + owner + customer email functies
- Branded HTML templates (inline CSS, RoyalPet kleuren)
- Owner email: portret, product, kader, totaal, naam+adres, besteldatum, verzenddatum (+7 werkdagen), high-res download (1 jaar geldig)
- Customer email: "Beste {naam}, Bedankt voor uw bestelling" + samenvatting + track & trace belofte
- Footer: royalpet.app + support@royalpet.app
- From: `support@royalpet.app`, reply-to: `ejsdebakker@gmail.com`

### Resend domain verificatie
- DKIM, SPF, DMARC (TXT records) + MX record in Namecheap
- Mail Settings op "Custom MX" voor Resend's MX record
- Reply-to header als workaround (geen email forwarding nodig)

### Order numbering
- `order_number SERIAL` kolom in orders tabel (migration 008)
- Display als `RP-00001`, `RP-00002`, etc.
- Zichtbaar in emails, success page, en Supabase

### Business model wijziging — gratis digitale download
- Digitale download verwijderd uit product catalog (was €24,99)
- Nieuw: gratis download button op preview pagina (email-gated)
- `/api/download` endpoint: email opslaan + 7-dagen signed URL teruggeven
- Revenue model: credit packs (generaties) + print/canvas + frames
- Credit pack copy: "incl. download"
- Success page nu alleen voor print/canvas bestellingen

## Wat ging goed
- Resend SDK is simpel — paar regels code
- Domain verificatie werkte na correcte DNS records
- Email HTML rendering ziet er premium uit
- Business model wijziging was clean — geen breaking changes

## Wat ging fout

### Namecheap MX vs Email Forwarding conflict
- **Probleem:** Namecheap staat niet toe om tegelijk Email Forwarding EN Custom MX te gebruiken
- **Fix:** reply-to header in code — replies gaan naar Gmail zonder DNS forwarding
- **Les:** reply-to is een simpelere oplossing dan MX forwarding voor MVP

### Port 3000 conflict
- **Probleem:** `NEXT_PUBLIC_BASE_URL=http://localhost:3000` hardcoded, maar Next.js startte op 3001
- **Gevolg:** Stripe redirect na betaling ging naar verkeerde port → 404
- **Fix:** Kill process op port 3000, altijd op 3000 starten
- **Les:** Check altijd of de verwachte port vrij is voor je dev server start

### Double payment UX
- **Probleem:** Gebruiker koopt credits (€9,99) → genereert portret → wordt gevraagd €24,99 te betalen voor download
- **Oorzaak:** Credits waren alleen voor generatie, digitale download was apart product
- **Fix:** Digitale download gratis gemaakt, revenue alleen via print/canvas/frames
- **Les:** Bekijk de flow vanuit de gebruiker, niet vanuit de code-architectuur

## Wat geleerd

### DNS records voor email
- SPF (TXT): welke servers mogen sturen namens dit domein
- DKIM (TXT): cryptografische handtekening voor email authenticiteit
- DMARC (TXT): beleid bij gefaalde SPF/DKIM checks
- MX: mail exchange — waar email afgeleverd moet worden
- Alle 4 nodig om niet in spam te belanden

### Resend architectuur
- Resend = outbound only, gebruikt Amazon SES
- Geen mailbox nodig om FROM een adres te sturen
- reply-to header stuurt antwoorden naar een ander adres
- Domain verificatie is verplicht voor custom from-adressen

### Signed URL expiry strategie
- Owner download: 1 jaar (31536000s) — effectief geen expiry
- Customer download: 7 dagen (604800s) — ruim genoeg
- Email thumbnails: 1 jaar — voor langere email leesbaarheid

### Order numbering
- PostgreSQL SERIAL = auto-increment, geen code nodig
- `.select("order_number").single()` na insert om het nummer op te halen
- Pad met `padStart(5, "0")` voor consistent format: RP-00001

---

## Voorbereiding volgende sessie
- **Eerst:** Test volledige flow met Stripe CLI (digital download + print bestelling)
- **Dan:** Sessie 5b — Share URL + Virale Loop
  - `/portret/[id]` publieke share pagina
  - WhatsApp/Email deelknoppen
  - share_count ophogen
- Geen extra accounts/keys nodig
- i18n uitstellen naar aparte sessie
