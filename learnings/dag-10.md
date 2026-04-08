# Learnings — Dag 10: Google Ads Finalisatie + Tracking Verificatie

> Sessie: 10 | Datum: 2026-04-02

---

## Wat is er gedaan

### Google Ads Finalisatie (alles handmatig in dashboards)
- Vercel env var `NEXT_PUBLIC_GOOGLE_ADS_ID` geüpdatet naar `AW-18029967167` + redeployed
- GA4 property (G-9RNXDQYSS0) ontkoppeld van oud account (304-200-5249)
- GA4 gekoppeld aan nieuw Google Ads account (328-887-3588) via Admin → Product links
- Purchase conversie aangemaakt in Google Ads (URL contains `/success/`, page load trigger)
- Tracking geverifieerd op live site: beide tags laden (GA4 + Ads + Consent Mode v2)
- 69 negative keywords klaargezet voor import

### Ad Copy Verbetering
- 10 extra headlines voorgesteld (totaal 15 voor Excellent ad strength)
- 2 extra long headlines
- 1 extra description
- Sitelink descriptions toegevoegd
- Pinning strategie: H1 "Huisdier Renaissance Portret" → Pin 1, H13 "Maak Nu Uw Portret" → Pin 3
- Call to action: "Shop now" → "Learn more" aanbevolen

## Wat ging goed
- GA4 koppeling naar nieuw account verliep soepel
- Tracking werkt correct op live site — beide tags laden, Consent Mode v2 actief
- Vercel env var update + redeploy ging zonder problemen

## Wat ging fout
- Google Ads UI voor conversie importeren is veranderd — "Import" optie bestaat niet meer in nieuwe interface
- Moest "Automatically without code" route gebruiken ipv GA4 import
- Default conversie-instelling was "any page on royalpet.app" — had elke paginabezoek als conversie geteld
- Gebruiker typte in Console filter-veld ipv de Console prompt — leek alsof tracking niet werkte

## Wat geleerd

### Google Ads UI Changes (2026)
- De "Import from GA4" conversie-flow is vervangen door een nieuwe wizard
- "Conversions on a website" → "Automatically without code" → URL contains is de nieuwe route
- Altijd URL-matching instellen op specifieke pagina (bijv. `/success/`) — NOOIT "any page"

### Tracking Verificatie
- `dataLayer` in Console is de snelste manier om te verifiëren dat gtag werkt
- Zorg dat je in het Console-invoerveld typt, niet in het Filter-veld (veelgemaakte fout)
- Harde refresh (Ctrl+Shift+R) kan nodig zijn om gecachte versie te omzeilen
- Incognito mode helpt om cookie/consent state te resetten

### Purchase Conversie Instelling
- Value staat op EUR 1 (placeholder) — acceptabel voor start maar niet ideaal
- GA4 purchase event stuurt wél echte waarde mee, dus GA4 rapporten tonen correcte omzet
- Voor Google Ads bidding optimalisatie is de echte waarde pas nodig bij Target ROAS bidding

---

## Voorbereiding volgende sessie

### Nog te doen (handmatig in Google Ads)
1. Negative keywords importeren in account 328-887-3588 (69 termen, lijst staat klaar)
2. Ad strength naar Excellent brengen (extra headlines + descriptions toevoegen)
3. Headlines pinnen: H1 → Position 1, H13 → Position 3

### Eerste taken volgende sessie
- Abandoned checkout recovery bouwen (Vercel Cron + 2 Resend emails)
- Of: Notion blog CMS (SEO)
- Of: Pre-launch checks (mobiel testen, Lighthouse, echte iDEAL betaling)
