# Learnings — Dag 08: GA4 + Google Ads Tracking + Agency Agents

> Sessie: 8 | Datum: 2026-03-31

---

## Wat is er gebouwd

### Agency Agents (15 geinstalleerd in ~/.claude/agents/)
- 7 Paid Media agents: PPC Strategist, Search Query Analyst, Tracking Specialist, Ad Creative Strategist, Paid Media Auditor, Programmatic Buyer, Paid Social Strategist
- 5 Marketing agents: Growth Hacker, SEO Specialist, Content Creator, Social Media Strategist, Instagram Curator
- 3 Design agents: UI Designer, Brand Guardian, Visual Storyteller

### Google Analytics 4
- GA4 property aangemaakt: G-9RNXDQYSS0
- Verified live op www.royalpet.app
- Consent Mode v2 geimplementeerd (GDPR/AVG compliant)
- Cookie banner: geen page reload meer, consent update via gtag API

### Google Ads
- Conversion action aangemaakt via GA4 link (purchase event)
- Google Ads tag: AW-17490304645
- Env vars ingesteld lokaal + Vercel

### GA4 Ecommerce Funnel (6 events)
- `view_item` — preview page load
- `add_to_cart` — product selectie
- `begin_checkout` — CTA klik "Bestel uw meesterwerk"
- `purchase` — success page (stuurt automatisch door naar Google Ads conversion)
- `upload_complete` — micro-conversie na portret generatie
- `email_captured` — micro-conversie bij download of checkout email

### Ads Strategie
- Volledige PPC campagnestructuur ontworpen (3 campagnes, 5 ad groups)
- RSA headlines + descriptions in het Nederlands
- Negative keywords CSV (48 termen)
- Budget plan: €10/dag startbudget
- Bidding strategie: Manual CPC → Maximize Conversions → Target CPA

## Wat ging goed
- GA4 property + Google Ads setup in 1 sessie afgerond
- Build bleef 100% stabiel na alle wijzigingen (2x getest)
- Consent Mode v2 werkt zonder page reload — betere UX
- Alle tracking is puur additief — geen bestaande code gebroken
- Google verified de tag direct na deploy

## Wat ging fout
- Google Ads conversion was via GA4-link aangemaakt (niet handmatig) — geen apart AW-ID/label. Kostte extra stappen om te begrijpen
- Event snippet in Google Ads UI toonde geen send_to parameter — verwarrend voor nieuwe gebruikers

## Wat geleerd

### Architectuur beslissingen
- Consent Mode v2: gtag moet ALTIJD laden (ook zonder consent), met `gtag('consent', 'default', { denied })`. Pas na accept: `gtag('consent', 'update', { granted })`
- GA4-linked conversions in Google Ads: geen apart Conversion Label nodig, purchase event stroomt automatisch door
- Micro-conversies (upload_complete, email_captured) voeden Google's algoritme sneller dan alleen purchase events

### Tool tips
- `updateConsent()` exporteren als functie i.p.v. page reload = veel betere UX
- Agency-agents repo: markdown personality files, kopieer naar ~/.claude/agents/, activeer conversational
- WebFetch kan geen client-side rendered React content valideren — check JS bundles direct

### API gotchas
- Google Ads account ID (304-200-5249) ≠ AW-tag ID (AW-17490304645) — het zijn verschillende nummers
- GA4-sourced conversions in Google Ads tonen "Source: Google Analytics (GA4)" — geen handmatig event snippet nodig
- Consent Mode v2: `wait_for_update: 500` geeft gtag 500ms om consent update te ontvangen voordat het data verzendt

---

## Voorbereiding volgende sessie
- **Negative keywords importeren** in Google Ads (CSV klaar in docs/)
- **Campagne 1 aanmaken** in Google Ads (Search Non-Brand, €7/dag)
- **Before/after visuals maken** in Canva voor ads
- **Micro-conversies importeren** in Google Ads vanuit GA4 (upload_complete, email_captured)
- **Enhanced Conversions inschakelen** in Google Ads settings
- **Abandoned checkout recovery** bouwen (Sessie 7 checklist items)
- **assets_visuals/ reorganisatie committen** (bestanden verplaatst naar submappen)
