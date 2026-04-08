# Google Ads Launch Checklist — RoyalPet.app

> Print dit uit of open het naast je browser.
> Werk van boven naar beneden. Vink af als het klaar is.

---

## STAP 1: Conversie-tracking instellen (15 min)

**WAAROM:** Zonder conversie-tracking weet Google niet welke klikken tot betalingen leiden. Je gooit dan geld weg.

- [ ] Open Google Ads → Tools & Settings → Conversions
- [ ] Klik "+ New conversion action" → Import → Google Analytics 4
- [ ] Selecteer property G-9RNXDQYSS0
- [ ] Vink **purchase** aan → Import and Continue
- [ ] Klik op de geimporteerde "purchase" actie → stel in:
  - Value: "Use the value from GA4" 
  - Count: "Every conversion"
  - Window: 30 days (click-through), 1 day (view-through)
  - Include in Conversions: **YES**
- [ ] Importeer ook: upload_complete, email_captured, begin_checkout
  - Markeer deze als **Secondary** (Include in Conversions: NO)
- [ ] Enhanced Conversions aanzetten:
  - Klik purchase → Enhanced conversions → Turn on
  - Method: Google tag → Email selected → Save

---

## STAP 2: Remarketing audiences aanmaken (10 min)

**WAAROM:** Na een paar weken heb je genoeg bezoekers om remarketing ads te tonen aan mensen die wél een portret maakten maar NIET bestelden.

- [ ] Tools & Settings → Audience Manager → + Website visitors
- [ ] Audience 1: "All Visitors - No Purchase - 30d"
  - URL contains: royalpet.app
  - Exclude URL contains: /success/
  - Duration: 30 days
- [ ] Audience 2: "Uploaded Photo - No Purchase - 30d"
  - URL contains: /preview/
  - Exclude URL contains: /success/
  - Duration: 30 days
- [ ] Audience 3: "Purchasers - 90d"
  - URL contains: /success/
  - Duration: 90 days

---

## STAP 3: Negative keywords importeren (5 min)

**WAAROM:** Voorkomt dat je betaalt voor klikken van mensen die zoeken op "gratis schilderij", "dierenarts", "tattoo", etc.

- [ ] Tools & Settings → Negative keyword lists → + New list
- [ ] Naam: "RoyalPet - Master Negatives"
- [ ] Kopieer ALLE keywords uit `docs/google-ads-negative-keywords.csv` + de extra's uit het campaign setup doc
- [ ] Save → Apply to campaigns → Selecteer alle 3 campagnes

---

## STAP 4: Campagne 1 aanmaken — Search Non-Brand (20 min)

**WAAROM:** Dit is je hoofdcampagne. Mensen zoeken actief naar "huisdier portret" of "cadeau hondenliefhebber" — die wil je vangen.

- [ ] + New Campaign → Sales → purchase → Search
- [ ] Naam: `NB | Search | Huisdier Portret | NL-BE`
- [ ] Settings:
  - [ ] **Uncheck** Google Search Partners
  - [ ] **Uncheck** Google Display Network
  - [ ] Locations: Netherlands + Belgium → Presence only
  - [ ] Languages: Dutch, German, French
  - [ ] Bidding: Maximize Clicks → Max CPC bid: €2.50
  - [ ] Budget: €7.00/dag
  - [ ] Ad schedule: Ma-Zo, 07:00-23:00

### Ad Group 1: Huisdier Portret
- [ ] Naam: `AG1 | Huisdier Portret`
- [ ] Kopieer exact match keywords uit campaign setup doc (sectie 3D)
- [ ] Kopieer phrase match keywords
- [ ] Kopieer ad group negatives
- [ ] RSA aanmaken: kopieer 15 headlines + 4 descriptions uit doc
- [ ] Pin H1 → positie 1, H2 → positie 2
- [ ] Pin D1 → positie 1
- [ ] Final URL: https://www.royalpet.app
- [ ] Display path: royalpet.app/huisdier-portret

### Ad Group 2: Cadeau
- [ ] Naam: `AG2 | Cadeau Huisdier`
- [ ] Kopieer keywords, negatives, RSA uit campaign setup doc (sectie 3E)
- [ ] Display path: royalpet.app/cadeau

### Ad Group 3: AI / Foto naar Schilderij
- [ ] Naam: `AG3 | AI Foto naar Schilderij`
- [ ] Kopieer keywords, negatives, RSA uit campaign setup doc (sectie 3F)
- [ ] Display path: royalpet.app/ai-portret

### Ad Group 4: Duits (OPTIONEEL — pause tot i18n live is)
- [ ] Naam: `AG4 | DE | Haustier Portrait`
- [ ] Kopieer uit campaign setup doc (sectie 3G)
- [ ] **PAUSE deze ad group** tot de site in het Duits beschikbaar is

---

## STAP 5: Campagne 2 aanmaken — Brand Search (5 min)

**WAAROM:** Beschermt je merknaam. Als iemand "royalpet" zoekt, wil je bovenaan staan — niet een concurrent.

- [ ] + New Campaign → Sales → purchase → Search
- [ ] Naam: `Brand | Search | RoyalPet`
- [ ] Settings: Maximize Clicks (geen cap), €1.00/dag, alle netwerken uit
- [ ] Locations: NL + BE + DE, Presence only
- [ ] Ad Group: `AG1 | Brand`
- [ ] Kopieer keywords + RSA uit campaign setup doc (sectie 4)

---

## STAP 6: Campagne 3 aanmaken — Display Remarketing (10 min)

**WAAROM:** Mensen die je site bezochten maar niet kochten, zie je opnieuw op andere websites. Dit is goedkoop en effectief.

- [ ] + New Campaign → Sales → purchase → Display
- [ ] Naam: `Remarketing | Display | Visitors No Purchase`
- [ ] Budget: €2.00/dag, Maximize Clicks
- [ ] Locations: NL + BE + DE
- [ ] Frequency cap: 5 impressions/user/day
- [ ] Content exclusions: parked domains, error pages, sensational
- [ ] Targeting: "Uploaded Photo - No Purchase - 30d" + "All Visitors - No Purchase - 30d"
- [ ] Exclude: "Purchasers - 90d"
- [ ] Responsive Display Ad aanmaken:
  - [ ] Upload landscape + square images (uit ads/ map)
  - [ ] Upload logo
  - [ ] Kopieer 5 headlines + 5 descriptions uit campaign setup doc (sectie 5D)

---

## STAP 7: Ad Extensions toevoegen (10 min)

**WAAROM:** Extensions maken je ad groter en geven meer informatie. Ze verhogen CTR met 10-20%.

- [ ] Ads & Extensions → Extensions → + Sitelink
  - Kopieer 6 sitelinks uit campaign setup doc (sectie 6A)
- [ ] + Callout → kopieer 10 callouts (sectie 6B)
- [ ] + Structured snippet → kopieer 3 snippets (sectie 6C)
- [ ] + Price extension (optioneel) → kopieer 5 prijzen (sectie 6D)

---

## STAP 8: Display ad creatives uploaden (10 min)

**WAAROM:** Responsive Display Ads hebben meerdere afbeeldingen nodig. Google combineert deze automatisch.

- [ ] Open `ads/ad-creatives.html` in Chrome
- [ ] Exporteer elke ad als PNG (rechtsklik → Inspect → Capture node screenshot)
- [ ] Upload naar de Remarketing campaign (+ eventueel als assets bij Search campagnes)

**Benodigde bestanden:**
| Creative | Formaat | Doel |
|---|---|---|
| Before/After landscape | 1200x628 | Display + Facebook |
| Before/After square | 1080x1080 | Instagram + Discovery |
| Before/After banner | 300x250 | Display Network |
| Solo portrait landscape | 1200x628 | Display + Facebook |
| Solo portrait square | 1080x1080 | Instagram + Discovery |
| Solo portrait banner | 300x250 | Display Network |
| Lifestyle landscape | 1200x628 | Display + Facebook |
| Lifestyle square | 1080x1080 | Instagram + Discovery |
| Lifestyle banner | 300x250 | Display Network |

---

## STAP 9: Final check voor go-live (5 min)

- [ ] Ga naar elke campagne → Ads → check status (geen "Disapproved")
- [ ] Controleer totaal dagbudget: €7 + €1 + €2 = €10/dag
- [ ] Open www.royalpet.app → doe een test-upload → check in GA4 Realtime of events binnenkomen
- [ ] Check dat cookie consent banner werkt (klik Accepteren → GA4 moet data tonen)
- [ ] Check Google Ads → Tools → Conversions → status moet "Recording" of "No recent conversions" zijn

---

## STAP 10: Na go-live — eerste week routine

**Dag 1-3: Dagelijks 5 min**
- [ ] Zijn de campagnes actief? (status "Eligible")
- [ ] Zijn er impressies en klikken?
- [ ] Zijn er disapproved ads? (fix meteen)

**Dag 7: Eerste optimalisatie (15 min)**
- [ ] Keywords → Search terms → voeg irrelevante zoektermen toe als negatives
- [ ] Welke ad group presteert het best? (CTR vergelijken)
- [ ] Check Auction Insights: wie zijn je concurrenten?
- [ ] Check GA4: komen er uploads binnen van Google Ads verkeer?

**Dag 14: Eerste grote review (30 min)**
- Zie Optimization Schedule in campaign setup doc (sectie 8)

---

## Totale geschatte tijd: ~90 minuten

| Stap | Tijd |
|---|---|
| Conversie-tracking | 15 min |
| Audiences | 10 min |
| Negative keywords | 5 min |
| Campagne 1 (Non-Brand) | 20 min |
| Campagne 2 (Brand) | 5 min |
| Campagne 3 (Remarketing) | 10 min |
| Extensions | 10 min |
| Creatives uploaden | 10 min |
| Final check | 5 min |

---

*Tip: Doe dit in 2 sessies als 90 min te lang is. Stap 1-3 eerst (setup), dan stap 4-9 (campagnes).*

*Document: April 2026 | RoyalPet.app*
