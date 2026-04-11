# Google Ads Campaign Setup — RoyalPet.app

> Complete, step-by-step setup guide for the Google Ads web interface.
> Budget: EUR 300/month (EUR 10/day) across 3 campaigns.
> Last updated: April 2026

---

## TABLE OF CONTENTS

1. [Pre-Launch: Conversion Setup](#1-pre-launch-conversion-setup)
2. [Pre-Launch: Audience Creation](#2-pre-launch-audience-creation)
3. [Campaign 1: Search Non-Brand (EUR 7/day)](#3-campaign-1-search-non-brand)
4. [Campaign 2: Search Brand (EUR 1/day)](#4-campaign-2-search-brand)
5. [Campaign 3: Display Remarketing (EUR 2/day)](#5-campaign-3-display-remarketing)
6. [Ad Extensions (all campaigns)](#6-ad-extensions)
7. [Negative Keywords](#7-negative-keywords)
8. [Optimization Schedule](#8-optimization-schedule)
9. [Budget Reallocation Rules](#9-budget-reallocation-rules)
10. [Bidding Strategy Transition Plan](#10-bidding-strategy-transition-plan)

---

## 1. PRE-LAUNCH: CONVERSION SETUP

### 1A. Import GA4 Purchase Event into Google Ads

1. In Google Ads, click **Tools & Settings** (wrench icon, top right)
2. Under "Measurement", click **Conversions**
3. Click the blue **+ New conversion action** button
4. Select **Import**
5. Select **Google Analytics 4 properties**
6. Click **Continue**
7. You will see your GA4 property (G-9RNXDQYSS0) listed
8. Check the box next to the **purchase** event
9. Click **Import and Continue**
10. Click **Done**

### 1B. Configure the Imported Conversion Action

1. After import, click on the **purchase** conversion action to edit it
2. Set these values:

| Setting | Value |
|---|---|
| Goal and action optimization | Purchase / Sale |
| Conversion name | purchase (keep as-is from GA4) |
| Value | Use the value from GA4 (dynamic, passed via ecommerce events) |
| Count | Every conversion |
| Click-through conversion window | 30 days |
| View-through conversion window | 1 day |
| Attribution model | Data-driven (default in 2026) |
| Include in "Conversions" | YES (primary conversion) |

3. Click **Save**

### 1C. Add Secondary Conversion Actions (Micro-Conversions)

Repeat steps 1A-1B for these GA4 events, but mark them as **Secondary** (observation only, not used for bidding):

| GA4 Event | Set as | Why |
|---|---|---|
| upload_complete | Secondary | Tracks photo uploads — top-of-funnel signal |
| email_captured | Secondary | Tracks email submissions — mid-funnel signal |
| begin_checkout | Secondary | Tracks Stripe checkout opens — bottom-funnel signal |

To mark as secondary:
1. Click on the conversion action
2. Under "Include in Conversions", select **No** (this makes it secondary)
3. It will still report data but will NOT be used for automated bidding

### 1D. Enable Enhanced Conversions

1. Click **Tools & Settings** > **Conversions**
2. Click on the **purchase** conversion action
3. Scroll to **Enhanced conversions** section
4. Toggle **Turn on enhanced conversions**
5. Select **Google tag** as the method
6. Under "Customer data", ensure **Email** is selected
7. Click **Save**

> Note: Enhanced conversions use the hashed email from your checkout flow
> to match conversions more accurately. Since RoyalPet already captures
> email before checkout, this data is available in the dataLayer.

### 1E. Verify Conversion Tracking is Working

1. Go to **Tools & Settings** > **Conversions**
2. The purchase action should show status **Recording conversions** or **No recent conversions** (normal if no purchases yet)
3. If status shows **Inactive** or **Tag inactive**, check:
   - GA4 property is correctly linked (Admin > Google Ads Links in GA4)
   - The Google Ads tag (AW-17490304645) fires on all pages
   - Consent Mode v2 is not blocking all signals (it should send cookieless pings even when denied)

---

## 2. PRE-LAUNCH: AUDIENCE CREATION

### 2A. Create Remarketing Audience — All Visitors (No Purchase)

1. In Google Ads, click **Tools & Settings** > **Audience Manager**
2. Click the **+** button > **Website visitors**
3. Configure:

| Setting | Value |
|---|---|
| Audience name | All Visitors - No Purchase - 30d |
| Visited a page: URL contains | royalpet.app |
| Exclude: Visited a page: URL contains | /success/ |
| Membership duration | 30 days |
| Description | All site visitors who did not reach a success page |

4. Click **Create Audience**

### 2B. Create Remarketing Audience — Upload Complete (No Purchase)

1. Click **+** > **Website visitors**
2. Configure:

| Setting | Value |
|---|---|
| Audience name | Uploaded Photo - No Purchase - 30d |
| List members: People who visited specific pages | URL contains /preview/ |
| Exclude: URL contains | /success/ |
| Membership duration | 30 days |
| Description | Users who uploaded a photo and saw preview but did not purchase |

3. Click **Create Audience**

### 2C. Create Remarketing Audience — Purchasers (For Exclusion)

1. Click **+** > **Website visitors**
2. Configure:

| Setting | Value |
|---|---|
| Audience name | Purchasers - 90d |
| Visited a page: URL contains | /success/ |
| Membership duration | 90 days |
| Description | Users who completed a purchase — exclude from prospecting |

3. Click **Create Audience**

> These audiences need time to populate. The remarketing campaign
> will not serve impressions until the audience reaches 100+ users
> (Google's minimum for Display remarketing).

---

## 3. CAMPAIGN 1: SEARCH NON-BRAND

### 3A. Campaign Creation

1. Click **+ New Campaign**
2. Select goal: **Sales**
3. Select conversion goal: **purchase** (the one you imported from GA4)
4. Select campaign type: **Search**
5. Campaign name: `NB | Search | Huisdier Portret | NL-BE`
6. Click **Continue**

### 3B. Campaign Settings

| Setting | Value | Menu Path |
|---|---|---|
| Networks | **Uncheck** "Include Google search partners" | Settings > Networks |
| | **Uncheck** "Include Google Display Network" | |
| Locations | Target: **Netherlands**, **Belgium** | Settings > Locations |
| | Location options: **Presence: People in or regularly in your targeted locations** | Click "Location options" |
| | Exclude: None | |
| Languages | **Dutch**, **German**, **French** | Settings > Languages |
| Bidding | **Maximize clicks** (starting strategy) | Settings > Bidding |
| | Set maximum CPC bid limit: **EUR 2.50** | |
| Daily budget | **EUR 7.00** | Settings > Budget |
| Ad schedule | Monday-Sunday, 7:00 - 23:00 | Settings > Ad schedule |
| Ad rotation | **Optimize: Prefer best performing ads** | Settings > More settings > Ad rotation |
| Start date | Today | |
| End date | None | |

> WHY Maximize Clicks first: With 0 conversion data, automated bidding
> (tCPA/tROAS) has nothing to optimize toward. Maximize Clicks collects
> click and conversion data fastest. Switch to Maximize Conversions
> after 30+ conversions in 30 days (see Section 10).

### 3C. Device Bid Adjustments

Set after 2 weeks of data. Initial settings:

| Device | Adjustment |
|---|---|
| Mobile | 0% (no change) |
| Desktop | 0% (no change) |
| Tablet | -20% |

Menu path: Campaign > Settings > Devices

---

### 3D. Ad Group 1: Huisdier Portret (Core Intent)

**Ad group name:** `AG1 | Huisdier Portret`

#### Keywords — Exact Match

Copy-paste these directly into the keyword field:

```
[huisdier portret]
[honden portret]
[katten portret]
[hondenschilderij]
[kattenschilderij]
[hond op canvas]
[kat op canvas]
[huisdier op canvas]
[huisdier schilderij]
[renaissance portret hond]
[renaissance portret kat]
[huisdier als schilderij]
[hond als schilderij]
[portret van mijn hond]
[portret van mijn kat]
```

#### Keywords — Phrase Match

```
"huisdier portret"
"honden portret"
"katten portret"
"hondenschilderij"
"kattenschilderij"
"hond op canvas"
"kat op canvas"
"huisdier schilderij"
"renaissance portret huisdier"
"schilderij van hond"
"schilderij van kat"
"portret huisdier laten maken"
```

#### Ad Group Level Negative Keywords

```
-gratis
-tweedehands
-cursus
-tutorial
-leren
-diy
-zelf maken
-tattoo
```

#### RSA Ad Copy — AG1

**Headlines (max 30 characters each):**

| # | Headline |
|---|---|
| H1 | Jouw Hond als Meesterwerk |
| H2 | Renaissance Huisdier Portret |
| H3 | Van Foto naar Schilderij |
| H4 | AI Huisdier Portret in 60 Sec |
| H5 | Jouw Kat als Renaissance Ster |
| H6 | Uniek Portret - Vandaag Klaar |
| H7 | Hond op Canvas - Vanaf EUR 89 |
| H8 | Gratis Preview - Nu Proberen |
| H9 | Museum-Kwaliteit Canvas |
| H10 | Upload Foto, Zie Resultaat |
| H11 | Hondenschilderij op Maat |
| H12 | Katten Portret in Olieverf |
| H13 | Fine Art Print of Canvas |
| H14 | Bezorgd in 7-9 Werkdagen |
| H15 | Meer dan 500 Tevreden Klanten |

Pin H1 to position 1, H2 to position 2 (these are your best performers to test).

**Descriptions (max 90 characters each):**

| # | Description |
|---|---|
| D1 | Upload een foto van uw huisdier en ontvang een prachtig Renaissance portret. Gratis preview! |
| D2 | AI maakt van uw hond of kat een tijdloos kunstwerk. Fine Art Print of Canvas. Bestel vandaag. |
| D3 | Vereeuw uw trouwe metgezel als Renaissance edelman. Digitaal gratis, prints vanaf EUR 89. |
| D4 | Van foto naar meesterwerk in 60 seconden. Kies Fine Art Print, Canvas of download digitaal. |

Pin D1 to position 1.

**Final URL:** `https://www.royalpet.app`

**Display path:** `royalpet.app/huisdier-portret`

---

### 3E. Ad Group 2: Cadeau Intent

**Ad group name:** `AG2 | Cadeau Huisdier`

#### Keywords — Exact Match

```
[cadeau hondenliefhebber]
[cadeau kattenliefhebber]
[uniek cadeau huisdier]
[cadeau hondeneigenaar]
[cadeau voor hondenbaas]
[origineel cadeau huisdier]
[verjaardagscadeau hond]
[kerstcadeau hondenliefhebber]
[cadeau dierenliefhebber]
[persoonlijk cadeau huisdier]
[gepersonaliseerd cadeau hond]
[cadeau baasje en hond]
[cadeau met foto huisdier]
```

#### Keywords — Phrase Match

```
"cadeau hondenliefhebber"
"cadeau kattenliefhebber"
"uniek cadeau huisdier"
"cadeau hondeneigenaar"
"origineel cadeau huisdier"
"gepersonaliseerd cadeau hond"
"cadeau dierenliefhebber"
"cadeau met huisdier"
"cadeautip hond"
"cadeautip kat"
```

#### Ad Group Level Negative Keywords

```
-gratis
-tweedehands
-marktplaats
-bol.com
-amazon
-voucher
-cadeaubon
-tegoedbon
```

#### RSA Ad Copy — AG2

**Headlines:**

| # | Headline |
|---|---|
| H1 | Het Perfecte Cadeau voor Hen |
| H2 | Uniek Cadeau - Huisdier Portret |
| H3 | Vereeuw Hun Trouwe Viervoeter |
| H4 | Persoonlijk & Onvergetelijk |
| H5 | Cadeau Hondenliefhebber? |
| H6 | Origineel Cadeau - Altijd Raak |
| H7 | Van Foto naar Kunstwerk |
| H8 | Fine Art Print Vanaf EUR 89 |
| H9 | Canvas Portret als Cadeau |
| H10 | Klaar Binnen 60 Seconden |
| H11 | Gratis Preview - Bekijk Eerst |
| H12 | Bezorgd in 7-9 Werkdagen |
| H13 | Renaissance Stijl Portret |
| H14 | Maak Iemand Gelukkig Vandaag |
| H15 | Tijdloos Cadeau - Blijft Hangen |

Pin H1 to position 1, H2 to position 2.

**Descriptions:**

| # | Description |
|---|---|
| D1 | Op zoek naar een uniek cadeau? Upload een foto en maak een Renaissance portret. Altijd raak! |
| D2 | Het perfecte cadeau voor elke honden- of kattenliefhebber. Persoonlijk, origineel en tijdloos. |
| D3 | Verras iemand met een kunstwerk van hun huisdier. Fine Art Print, Canvas of digitale download. |
| D4 | AI maakt een prachtig Renaissance portret. Bestel als print of canvas. Bezorgd in 7-9 dagen. |

Pin D1 to position 1.

**Final URL:** `https://www.royalpet.app`

**Display path:** `royalpet.app/cadeau`

---

### 3F. Ad Group 3: AI / Custom Intent

**Ad group name:** `AG3 | AI Foto naar Schilderij`

#### Keywords — Exact Match

```
[ai huisdier portret]
[foto naar schilderij hond]
[foto naar schilderij kat]
[gepersonaliseerd huisdier portret]
[foto op canvas huisdier]
[foto op canvas hond]
[foto op canvas kat]
[ai schilderij hond]
[ai portret huisdier]
[hond foto bewerken schilderij]
[foto naar kunstwerk hond]
[custom huisdier portret]
[gepersonaliseerd hondenschilderij]
[foto naar canvas huisdier]
```

#### Keywords — Phrase Match

```
"ai huisdier portret"
"foto naar schilderij hond"
"foto naar schilderij kat"
"gepersonaliseerd huisdier"
"foto op canvas huisdier"
"foto naar canvas hond"
"ai schilderij huisdier"
"custom portret hond"
"foto laten schilderen hond"
"foto bewerken als schilderij"
```

#### Ad Group Level Negative Keywords

```
-gratis
-zelf
-photoshop
-canva
-illustrator
-tutorial
-cursus
-app store
```

#### RSA Ad Copy — AG3

**Headlines:**

| # | Headline |
|---|---|
| H1 | Van Foto naar Schilderij - AI |
| H2 | AI Maakt Uw Huisdier Portret |
| H3 | Upload Foto - Klaar in 60 Sec |
| H4 | Geen Wachttijd op een Kunstenaar |
| H5 | AI Renaissance Huisdier Portret |
| H6 | Foto naar Canvas - Bestel Nu |
| H7 | Gepersonaliseerd & Uniek |
| H8 | Fine Art Print Vanaf EUR 89 |
| H9 | Museum-Kwaliteit Resultaat |
| H10 | Gratis Preview - Probeer Nu |
| H11 | Print of Download - Uw Keuze |
| H12 | Geprint op Premium Canvas |
| H13 | 100% Op Maat Gemaakt |
| H14 | NL & BE Bezorging 7-9 Dagen |
| H15 | Meer dan 500 Portretten Gemaakt |

Pin H1 to position 1, H2 to position 2.

**Descriptions:**

| # | Description |
|---|---|
| D1 | Upload een foto en onze AI maakt een prachtig Renaissance portret. Resultaat in 60 seconden! |
| D2 | Geen wachttijd op een kunstenaar. AI genereert een uniek schilderij van uw hond of kat. |
| D3 | Van foto naar meesterwerk. Kies Fine Art Print, Canvas of download digitaal. Gratis preview. |
| D4 | Gepersonaliseerd AI portret van uw huisdier. Museum-kwaliteit print. Bezorgd in 7-9 werkdagen. |

Pin D1 to position 1.

**Final URL:** `https://www.royalpet.app`

**Display path:** `royalpet.app/ai-portret`

---

### 3G. Ad Group 4: German Keywords (DE Market)

**Ad group name:** `AG4 | DE | Haustier Portrait`

#### Keywords — Exact Match

```
[haustier portrait]
[hund portrait renaissance]
[katze portrait renaissance]
[hund auf leinwand]
[haustier gemalde]
[geschenk hundebesitzer]
[foto zu gemalde hund]
[ai haustier portrait]
[hund als kunstwerk]
[personalisiertes haustier portrait]
```

#### Keywords — Phrase Match

```
"haustier portrait"
"hund portrait"
"katze portrait"
"hund auf leinwand"
"geschenk hundebesitzer"
"foto zu gemalde hund"
"ai haustier portrait"
```

#### Ad Group Level Negative Keywords

```
-kostenlos
-gebraucht
-selber machen
-kurs
-tutorial
-tattoo
```

#### RSA Ad Copy — AG4

**Headlines:**

| # | Headline |
|---|---|
| H1 | Ihr Haustier als Meisterwerk |
| H2 | Renaissance Portrait vom Hund |
| H3 | Foto Hochladen - In 60 Sek. |
| H4 | AI Haustier Portrait |
| H5 | Einzigartiges Geschenk |
| H6 | Leinwand ab EUR 299 |
| H7 | Fine Art Print ab EUR 89 |
| H8 | Gratis Vorschau Ansehen |
| H9 | Museumsqualitat Druck |
| H10 | Personalisiert & Einzigartig |
| H11 | Lieferung 7-9 Werktage |
| H12 | Von Foto zum Kunstwerk |
| H13 | Katze als Renaissance Star |
| H14 | Geschenk fur Tierliebhaber |
| H15 | Jetzt Ausprobieren - Gratis |

Pin H1 to position 1, H2 to position 2.

**Descriptions:**

| # | Description |
|---|---|
| D1 | Laden Sie ein Foto hoch und unsere AI erstellt ein Renaissance Portrait. Ergebnis in 60 Sekunden! |
| D2 | Das perfekte Geschenk: Ihr Hund oder Katze als zeitloses Kunstwerk. Fine Art Print oder Leinwand. |
| D3 | Von Foto zum Meisterwerk. AI generiert ein einzigartiges Gemalde. Gratis Vorschau verfugbar. |
| D4 | Personalisiertes Haustier Portrait in Museumsqualitat. Bestellen Sie noch heute als Print oder Leinwand. |

Pin D1 to position 1.

**Final URL:** `https://www.royalpet.app`

**Display path:** `royalpet.app/haustier-portrait`

> Note: The site is NL-only for now. When DE localization is added,
> update the final URL to the German version. For now, German-speaking
> users will land on the Dutch site. Consider pausing AG4 until i18n
> is live, or test it to see if conversions still happen.

---

## 4. CAMPAIGN 2: SEARCH BRAND

### 4A. Campaign Creation

1. Click **+ New Campaign**
2. Select goal: **Sales**
3. Select conversion goal: **purchase**
4. Select campaign type: **Search**
5. Campaign name: `Brand | Search | RoyalPet`
6. Click **Continue**

### 4B. Campaign Settings

| Setting | Value |
|---|---|
| Networks | **Uncheck** both partner networks |
| Locations | Netherlands, Belgium, Germany |
| Location options | Presence only |
| Languages | Dutch, German, French |
| Bidding | **Maximize clicks** (no bid cap needed — brand CPCs are low) |
| Daily budget | **EUR 1.00** |
| Ad schedule | All day, every day |
| Ad rotation | Optimize |

### 4C. Ad Group: Brand Terms

**Ad group name:** `AG1 | Brand`

#### Keywords — Exact Match

```
[royalpet]
[royal pet]
[royalpet app]
[royalpet.app]
[royal pet app]
[royal pet portret]
[royalpet portret]
[royalpet schilderij]
```

#### Keywords — Phrase Match

```
"royalpet"
"royal pet app"
"royalpet portret"
```

#### RSA Ad Copy — Brand

**Headlines:**

| # | Headline |
|---|---|
| H1 | RoyalPet - Officieel |
| H2 | AI Renaissance Huisdier Portret |
| H3 | Upload Foto - Klaar in 60 Sec |
| H4 | Gratis Preview Beschikbaar |
| H5 | Fine Art Print Vanaf EUR 89 |
| H6 | Canvas Portret op Maat |
| H7 | Vereeuw Uw Huisdier Vandaag |
| H8 | Museum-Kwaliteit Resultaat |
| H9 | NL, BE & DE Bezorging |
| H10 | Meer dan 500 Portretten |
| H11 | Van Foto naar Meesterwerk |
| H12 | Digitale Download Gratis |
| H13 | Bestel Print of Canvas |
| H14 | RoyalPet.app |
| H15 | Uw Huisdier Verdient Dit |

Pin H1 to position 1, H14 to position 2.

**Descriptions:**

| # | Description |
|---|---|
| D1 | RoyalPet.app - Upload een foto en ontvang een Renaissance portret van uw huisdier. Gratis preview! |
| D2 | Officieel. AI maakt van uw hond of kat een tijdloos kunstwerk. Fine Art Print of Canvas. |
| D3 | Van foto naar meesterwerk in 60 seconden. Digitale download gratis. Prints vanaf EUR 89. |
| D4 | Vereeuw uw trouwe viervoeter. Museum-kwaliteit prints bezorgd in 7-9 werkdagen. |

**Final URL:** `https://www.royalpet.app`

**Display path:** `royalpet.app`

---

## 5. CAMPAIGN 3: DISPLAY REMARKETING

### 5A. Campaign Creation

1. Click **+ New Campaign**
2. Select goal: **Sales**
3. Select conversion goal: **purchase**
4. Select campaign type: **Display**
5. Campaign name: `Remarketing | Display | Visitors No Purchase`
6. Click **Continue**

### 5B. Campaign Settings

| Setting | Value |
|---|---|
| Networks | Google Display Network (default) |
| Locations | Netherlands, Belgium, Germany |
| Location options | Presence only |
| Languages | Dutch, German, French |
| Bidding | **Maximize clicks** initially, switch to **Target CPA** after 15+ remarketing conversions |
| Daily budget | **EUR 2.00** |
| Ad schedule | All day, every day |
| Frequency capping | **5 impressions per user per day** |
| Content exclusions | Exclude: Parked domains, Error pages, Sexually suggestive, Sensational & shocking |

Menu path for frequency capping: Campaign Settings > Additional settings > Frequency management > Set a cap

Menu path for content exclusions: Campaign Settings > Additional settings > Content exclusions

### 5C. Targeting

1. In the ad group settings, click **Audiences**
2. Click **Browse** > **How they have interacted with your business**
3. Select **Website visitors**
4. Check: **Uploaded Photo - No Purchase - 30d** (primary)
5. Also check: **All Visitors - No Purchase - 30d** (secondary)
6. Under **Exclusions**, add: **Purchasers - 90d**

| Setting | Value |
|---|---|
| Targeting mode | **Targeting** (NOT Observation — you want to limit to these audiences only) |
| Demographic exclusions | None (keep all ages, genders, household incomes) |

### 5D. Ad Formats

Create these ad types:

#### Responsive Display Ad

1. Click **+ New ad** > **Responsive display ad**
2. Upload assets:

**Images (landscape 1200x628, square 1200x1200):**
- Before/after split: left = pet photo, right = Renaissance portrait
- Showcase: finished Renaissance portrait in living room setting
- Product lineup: three example portraits side by side

> Use screenshots from your existing showcase images in /examples/ and /interiors/

**Logos:**
- Square logo (1200x1200): RoyalPet logo on black background
- Landscape logo (1200x300): RoyalPet text logo

**Headlines (max 30 chars, provide 5):**

| # | Headline |
|---|---|
| 1 | Uw Portret Wacht op U |
| 2 | Vergeet Uw Meesterwerk Niet |
| 3 | Nog Steeds Beschikbaar |
| 4 | Bestel Uw Huisdier Portret |
| 5 | Print Nu - Voordat Het Weg Is |

**Long headline (max 90 chars):**
`Uw Renaissance portret is nog beschikbaar! Bestel als Fine Art Print of Canvas.`

**Descriptions (max 90 chars, provide 5):**

| # | Description |
|---|---|
| 1 | U heeft al een preview gezien. Bestel nu als print of canvas en vereeuw uw huisdier. |
| 2 | Uw AI portret wacht. Fine Art Prints vanaf EUR 89. Canvas vanaf EUR 299. Nu bestellen! |
| 3 | Kom terug en bestel uw unieke Renaissance portret. Bezorgd in 7-9 werkdagen. |
| 4 | Uw huisdier portret is nog 30 dagen beschikbaar. Bestel voordat het verdwijnt. |
| 5 | Van foto naar meesterwerk. U was er bijna! Klik hier om uw portret te bestellen. |

**Business name:** RoyalPet

**Final URL:** `https://www.royalpet.app`

**Call to action:** Bestel nu / Shop now (Google auto-selects per language)

---

## 6. AD EXTENSIONS

Apply these to ALL campaigns (or at account level).

### 6A. Sitelink Extensions

Menu path: Ads & extensions > Extensions > + Sitelink

| Sitelink text | Description line 1 | Description line 2 | Final URL |
|---|---|---|---|
| Bekijk Voorbeelden | Honden en katten als | Renaissance meesterwerken | https://www.royalpet.app/#voorbeelden |
| Fine Art Prints | Museum-kwaliteit prints | Vanaf EUR 89 - 4 formaten | https://www.royalpet.app |
| Canvas Portretten | Geprint op premium canvas | Vanaf EUR 299 - 4 formaten | https://www.royalpet.app |
| Gratis Preview Maken | Upload foto van uw huisdier | Resultaat in 60 seconden | https://www.royalpet.app |
| Kaders Bekijken | 6 stijlen beschikbaar | Klassiek goud tot modern zwart | https://www.royalpet.app |
| Klantbeoordelingen | Meer dan 500 tevreden klanten | Bekijk wat anderen zeggen | https://www.royalpet.app/#reviews |

### 6B. Callout Extensions

Menu path: Ads & extensions > Extensions > + Callout

```
Gratis Preview
Klaar in 60 Seconden
iDEAL & Bancontact
Fine Art Prints
Canvas Portretten
Bezorging 7-9 Werkdagen
Museum-Kwaliteit
NL, BE & DE Bezorging
Optioneel Kader Erbij
AI-Powered
```

### 6C. Structured Snippet Extensions

Menu path: Ads & extensions > Extensions > + Structured snippet

| Header | Values |
|---|---|
| Types | Fine Art Print, Canvas, Digitale Download |
| Stijlen | Renaissance, Klassiek, Barok, Edelman |
| Bestemmingen | Nederland, Belgie, Duitsland |

### 6D. Price Extensions (Optional but Recommended)

Menu path: Ads & extensions > Extensions > + Price

| Type | Header | Price | Description | Final URL |
|---|---|---|---|---|
| Product | Digitale Download | Gratis | High-res download na email | https://www.royalpet.app |
| Product | Fine Art Print 20x25cm | EUR 89 | Museum-kwaliteit print | https://www.royalpet.app |
| Product | Fine Art Print 30x40cm | EUR 119 | Populairste formaat | https://www.royalpet.app |
| Product | Canvas 30x40cm | EUR 299 | Premium canvas portret | https://www.royalpet.app |
| Product | Canvas 45x60cm | EUR 399 | Groot canvas portret | https://www.royalpet.app |

---

## 7. NEGATIVE KEYWORDS

### 7A. Account-Level Negative Keyword List

1. Go to **Tools & Settings** > **Negative keyword lists**
2. Click **+** to create a new list
3. Name: `RoyalPet - Master Negatives`
4. Add all keywords from your CSV file (paste the entire list):

```
gratis schilderij
gratis canvas
gratis print
tweedehands
marktplaats
diy schilderij
schilderen op nummer
verf
kleurplaat
tattoo
crematie
overlijden
dood
in memoriam
herdenkings
as verstrooien
dierenkliniek
dierenarts
huisdier verzekering
hondenvoer
kattenvoer
dierenpension
dierenasiel
adoptie hond
puppy kopen
kitten kopen
fokker
kennel
trimmer
hondenoppas
uitlaat
riem
halsband
bench
vogelkooi
aquarium
vis portret
hamster
konijn
paard
stockfoto
clipart
tekening leren
cursus
tutorial
photoshop
illustrator
canva template
```

5. Click **Save**
6. Apply this list to ALL three campaigns:
   - Click on the list > **Apply to campaigns** > Select all 3 campaigns

### 7B. Additional Recommended Negatives

Add these to the master list as well (not in original CSV but important):

```
behang
poster gratis
kleurboek
speelgoed
knuffel
mok
t-shirt
telefoonhoesje
sleutelhanger
puzzel
kalender
agenda
sticker
acryl
olieverf set
schildersezel
etsy
aliexpress
wish
temu
bol.com
```

---

## 8. OPTIMIZATION SCHEDULE

### Daily (5 minutes)

1. Check budget pacing: Are campaigns spending or limited by budget?
   - Path: Overview > See all campaigns > Check "Budget" column
   - If "Limited by budget" shows, that is OK — it means demand exceeds EUR 7/day
2. Check for any disapproved ads
   - Path: Ads & extensions > Filter: Status = Disapproved
3. Glance at cost — are you tracking to the EUR 10/day total?

### Weekly (15 minutes, every Monday)

1. **Search Terms Report**
   - Path: Keywords > Search terms
   - Date range: Last 7 days
   - Actions:
     - Add any irrelevant search terms as negative keywords
     - Add any high-performing new search terms as exact match keywords
   - Target: Review all terms with 2+ clicks

2. **Keyword Performance**
   - Path: Keywords
   - Sort by: Cost (highest first)
   - Actions:
     - Pause any keyword spending EUR 15+ with 0 conversions
     - Lower bid on keywords with CPC > EUR 3.00 (use bid adjustment in Maximize Clicks)
     - Check Quality Score column — investigate any keyword with QS < 5

3. **Ad Performance**
   - Path: Ads & extensions > Ads
   - Check: CTR comparison between ad variations
   - If any ad has <1% CTR after 1000+ impressions, replace weakest headline/description

4. **Auction Insights** (Search campaigns only)
   - Path: Campaigns > Select NB campaign > Auction Insights
   - Track: Who are your competitors? What is your impression share?
   - Log this data weekly to spot trends

### Biweekly (30 minutes, every other Friday)

1. **Ad Group Performance Review**
   - Compare CPA/ROAS across AG1, AG2, AG3, AG4
   - Shift budget toward best-performing ad group:
     - Increase bids on winner by 15%
     - Decrease bids on underperformer by 15%

2. **Geographic Performance**
   - Path: Locations
   - Compare NL vs BE performance
   - If one country has significantly worse CPA, add a negative bid adjustment (-10% to -30%)

3. **Device Performance**
   - Path: Devices
   - Adjust tablet/mobile/desktop bid adjustments based on conversion rate differences

### Monthly (45 minutes, first Monday of month)

1. **Full Account Audit**
   - Wasted spend: Total cost on keywords with 0 conversions
   - Quality Score distribution: What % of spend goes to QS 7+ keywords?
   - Match type performance: Are phrase match keywords wasting money vs exact?
   - Landing page: Check bounce rate in GA4 for Google Ads traffic

2. **Budget Reallocation** (see Section 9)

3. **Negative Keyword List Refresh**
   - Export full search terms report for the month
   - Add all irrelevant terms to the master negative list
   - Target: Add 10-20 new negatives per month

4. **Competitor Check**
   - Search your top 5 keywords manually (use Ad Preview tool, NOT regular Google)
   - Path: Tools & Settings > Ad Preview and Diagnosis
   - Screenshot competitor ads for reference
   - Note: Are competitors offering discounts? Faster delivery? Lower prices?

5. **Report Card**
   - Total spend vs budget
   - Total conversions (purchases)
   - Cost per conversion
   - Conversion rate (clicks to purchase)
   - Impression share (brand vs non-brand)
   - Top 5 keywords by conversions
   - Top 5 wasted-spend keywords (add to negatives or pause)

---

## 9. BUDGET REALLOCATION RULES

Monthly EUR 300 starting split:

| Campaign | Daily | Monthly | Share |
|---|---|---|---|
| NB Search | EUR 7.00 | EUR 210 | 70% |
| Brand Search | EUR 1.00 | EUR 30 | 10% |
| Remarketing | EUR 2.00 | EUR 60 | 20% |

### When to Reallocate

**If Non-Brand CPA is profitable (CPA < EUR 50 for print orders):**
- Increase NB budget by EUR 1/day (from remarketing or unused brand budget)
- Goal: maximize profitable non-brand volume

**If Remarketing has higher ROAS than Non-Brand:**
- Shift EUR 1-2/day from NB to Remarketing
- This is common — remarketing audiences are warmer

**If Brand campaign is limited by budget:**
- Increase brand to EUR 2/day — brand clicks are cheap and high-intent
- Take from the weakest-performing NB ad group

**If total account is not spending EUR 10/day:**
- Do NOT increase bids to force spend
- Instead, add more phrase match keywords to increase reach
- Consider adding broad match keywords with a low bid cap (EUR 1.50)

**If spend is efficient and you want to scale:**
- Before increasing budget, check Impression Share Lost (Budget) metric
- If IS Lost (Budget) > 20%, a budget increase will capture real demand
- If IS Lost (Budget) < 5%, budget increase will only push into more expensive auctions
- Scale in increments of 20% (EUR 10/day > EUR 12/day > EUR 14.40/day)

---

## 10. BIDDING STRATEGY TRANSITION PLAN

### Phase 1: Launch (Weeks 1-4)

| Campaign | Strategy | Reason |
|---|---|---|
| NB Search | Maximize Clicks (EUR 2.50 cap) | Collecting conversion data |
| Brand | Maximize Clicks (no cap) | Brand CPCs are naturally low |
| Remarketing | Maximize Clicks (no cap) | Audience is small, need volume |

### Phase 2: Early Data (Weeks 5-8, when you have 15+ conversions)

| Campaign | Strategy | Target |
|---|---|---|
| NB Search | Maximize Conversions (no target) | Let Google optimize freely first |
| Brand | Keep Maximize Clicks | Too few brand conversions to optimize |
| Remarketing | Keep Maximize Clicks | Audience still building |

To switch:
1. Go to Campaign > Settings > Bidding
2. Select **Maximize conversions**
3. Leave "Target CPA" field empty (do not set a target yet)
4. Click Save

### Phase 3: Mature (Weeks 9-12, when you have 30+ conversions in 30 days)

| Campaign | Strategy | Target |
|---|---|---|
| NB Search | Target CPA | Set at 1.5x your actual CPA from Phase 2 |
| Brand | Maximize Conversions | Enough data now |
| Remarketing | Target CPA | Set at your actual CPA from Phase 2 |

To set Target CPA:
1. Go to Campaign > Settings > Bidding
2. Select **Maximize conversions**
3. Check **Set a target cost per action**
4. Enter your target CPA (example: if actual CPA was EUR 30, set target to EUR 45)
5. Over the next 2 weeks, gradually lower the target by EUR 5 increments

### Phase 4: Scale (Month 4+, when you have 50+ conversions/month)

Consider switching to **Target ROAS** if your product mix varies significantly in value (EUR 89 print vs EUR 899 canvas):
1. Campaign > Settings > Bidding > Maximize conversion value
2. Check **Set a target return on ad spend**
3. Start at 200% ROAS (EUR 2 revenue per EUR 1 spend) and tighten over time

> IMPORTANT: Never switch bidding strategies and change budget on the same day.
> Make one change at a time. Wait 7-14 days between bidding strategy changes
> to let the algorithm stabilize.

---

## APPENDIX A: NAMING CONVENTIONS

All campaigns, ad groups, and labels follow this pattern for easy filtering:

```
Campaigns:
  NB | Search | [Theme] | [Geo]
  Brand | Search | [Brand Name]
  Remarketing | Display | [Audience]

Ad Groups:
  AG[#] | [Intent Theme]
  AG[#] | [Language] | [Intent Theme]

Labels (apply to campaigns):
  market:NL
  market:BE
  market:DE
  type:brand
  type:nonbrand
  type:remarketing
  funnel:top
  funnel:mid
  funnel:bottom
```

## APPENDIX B: KEY METRICS TO TRACK FROM DAY 1

Set up a simple spreadsheet (Google Sheets) and fill in weekly:

| Metric | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| Total Spend | | | | |
| Clicks (NB) | | | | |
| Clicks (Brand) | | | | |
| Clicks (Remarketing) | | | | |
| Impressions (NB) | | | | |
| CTR (NB) | | | | |
| Avg CPC (NB) | | | | |
| Conversions (all) | | | | |
| Conv. Rate | | | | |
| Cost/Conversion | | | | |
| Impression Share (NB) | | | | |
| Impression Share (Brand) | | | | |
| New Negatives Added | | | | |
| Revenue (if tracking) | | | | |

## APPENDIX C: QUICK REFERENCE — WHAT TO DO IF...

| Situation | Action |
|---|---|
| CPC is rising above EUR 3 | Check auction insights for new competitors. Tighten match types. Add negatives. |
| CTR below 3% on Search | Test new headlines. Check if ads are showing for irrelevant terms. |
| CTR below 0.5% on Display | Refresh ad creatives. Check frequency — are you showing too often? |
| No conversions after EUR 100 spend | Check conversion tracking is firing. Test the full purchase flow yourself. |
| "Limited by budget" on NB | This is OK with EUR 7/day. It means there is demand. Focus on efficiency first. |
| Quality Score below 5 | Check landing page relevance. Does the ad copy match the keyword? |
| Brand campaign getting competitor clicks | Add competitor names as negatives in Brand campaign only. |
| Remarketing not spending | Audience is too small (need 100+ users). Wait for organic traffic to build the pool. |
| Ad disapproved | Read the policy reason. Common: "misleading claims." Remove superlatives or guarantees. |
| Conversion count in Google Ads does not match GA4 | Normal — attribution models differ. GA4 uses last-click; Google Ads uses data-driven. |

---

## TODO: PET OWNER AUDIENCE TARGETING

> **Status:** Not yet configured. Recommended for Display/YouTube campaigns.

The current Search campaigns rely on keyword intent (whoever searches "huisdier portret" already has a pet). But for **Display remarketing**, **YouTube**, or future **Performance Max** campaigns, adding pet owner audiences will significantly improve targeting.

### Recommended audiences to add

| Type | Audience Name | Where to find |
|---|---|---|
| **Affinity** | Pet Lovers | Audiences > Browse > Interests & hobbies > Pet Lovers |
| **In-market** | Pet Food & Supplies | Audiences > Browse > In-market > Pet Food & Supplies |
| **In-market** | Pet Care Services | Audiences > Browse > In-market > Pet Care Services |

### How to add (Display/YouTube campaigns)

1. Go to campaign → **Audiences** tab
2. Click **Edit audience segments**
3. Click **Browse** → find audiences above
4. Set to **Targeting** (not Observation) for Display/YouTube
5. For Search campaigns: add as **Observation** only (bid adjustment, don't restrict reach)

### When to implement

- **Now (optional):** Add as Observation on Search campaign — see if pet owners convert better, then bid up
- **When Display remarketing gets traffic:** Add as Targeting to narrow to pet owners only
- **When launching YouTube/PMax:** Must-have as primary targeting signal
