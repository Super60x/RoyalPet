# RoyalPet.app — Google Ads Creative Strategy

> Complete creative brief for 3 display/social ad concepts + RSA copy + extensions.
> All copy in Dutch. Premium tone. Ready for Canva/Figma production.

---

## TABLE OF CONTENTS

1. [Creative Concept 1: Before/After Transformation](#1-beforeafter-transformation)
2. [Creative Concept 2: Solo Portrait — Gallery Hero](#2-solo-portrait--gallery-hero)
3. [Creative Concept 3: Lifestyle/Interior](#3-lifestyleinterior)
4. [RSA Copy — 15 Headlines + 4 Descriptions](#4-rsa-copy)
5. [Sitelink Extensions](#5-sitelink-extensions)
6. [Callout Extensions](#6-callout-extensions)
7. [Asset Selection Rationale](#7-asset-selection-rationale)
8. [Production Checklist](#8-production-checklist)

---

## BRAND SYSTEM (reference for all creatives)

| Element | Value |
|---|---|
| Primary background | `#0A0A0A` Deep Black |
| Gold accent / CTA | `#B8942A` Warm Gold |
| Light background alt | `#FAF8F3` Cream White |
| Text on dark | `#FAF8F3` Cream White |
| Text on light | `#0A0A0A` Deep Black |
| Accent text | `#3D2B1F` Antique Brown |
| Headline font | Cormorant Garamond (serif, 700 weight) |
| Body font | Inter (sans-serif, 400/500 weight) |
| Logo | "RoyalPet" wordmark, Cormorant Garamond, gold on black |
| Domain | www.royalpet.app |
| Tone | Premium, royal, elegant. Never cheap, never salesy. |

---

## 1. BEFORE/AFTER TRANSFORMATION

### Creative hypothesis
The transformation is the product. Showing a recognizable "normal pet photo" next to its Renaissance counterpart instantly communicates what RoyalPet does without any explanation needed. This format has proven highest CTR in the custom pet portrait category because it triggers curiosity and an emotional "I want that for MY dog" reaction.

### Source images

**LEFT (Before):** `assets_visuals/1. Dogs/baptist-standaert-mx0DEnfYxic-unsplash.jpg`
- Border Collie, casual photo, happy expression, slightly messy fur
- WHY: This is the most "everyday pet owner" photo you have. It looks like something anyone would take with their phone. That relatability is critical — the viewer needs to think "my dog looks like that too."

**RIGHT (After):** `assets_visuals/2. RoyalApp Dogs/GPT 1.5 image output.png`
- Border Collie in military doublet with lace collar, regal red cape, standing by column
- WHY: Same breed as the before photo = direct visual connection. The military uniform style is dramatic and instantly reads as "Renaissance masterpiece." The warm palette pops against the dark background.

**ALTERNATIVE PAIRING (if you want to test a second before/after):**
- Before: `pexels-rdne-7516473.jpg` (brown dog on blue background, clean studio look)
- After: `RoyalPet Picture Web content 03.png` (Stafford on gold cushion with ermine cape)
- This pairing works because the studio-lit before photo + opulent after = maximum contrast

### Copy

| Element | Dutch text | Char count |
|---|---|---|
| Headline (overlay) | Van foto naar meesterwerk | 25 chars |
| Sub-headline | Uw huisdier als Renaissance edelman | 35 chars |
| CTA button | Probeer gratis | 14 chars |
| Price anchor | Prints vanaf EUR 89 | 19 chars |
| Domain badge | royalpet.app | 12 chars |

### Layout specifications

#### 1200x628 (Landscape — Google Display, Facebook Feed)

```
+------------------------------------------------------------------+
|  [BEFORE photo]    [Arrow/divider]    [AFTER portrait]           |
|  Left 45%          Center 10%         Right 45%                  |
|                                                                  |
|  Small label:      Gold arrow icon    Small label:               |
|  "VOOR"            pointing right     "NA"                       |
|  Inter 12px        or gold vertical   Inter 12px                 |
|  #FAF8F3           line with glow     #FAF8F3                    |
|                                                                  |
+------------------------------------------------------------------+
| Bottom bar: #0A0A0A, 80px height                                 |
| Left: RoyalPet logo (gold)                                       |
| Center: "Van foto naar meesterwerk" Cormorant Garamond 24px gold |
| Right: CTA pill "Probeer gratis" gold bg, white text, 16px Inter |
+------------------------------------------------------------------+
```

- Before photo: slight desaturation (-15% saturation) to look more "ordinary"
- After portrait: full vibrancy, slight golden glow/vignette on edges
- Divider: thin gold vertical line (2px, #B8942A) with subtle glow, OR a gold arrow icon pointing right
- "VOOR" and "NA" labels: positioned top-center of each half, Inter 12px uppercase, letter-spacing 2px, #FAF8F3 with 60% opacity background pill (#0A0A0A)
- Bottom bar: solid #0A0A0A, creates clean separation from images

#### 1080x1080 (Square — Instagram, Google Discovery)

```
+----------------------------------------+
|  TOP HALF: Before photo                |
|  Label: "VOOR" (top-left, pill badge)  |
|                                        |
+--- Gold divider line (2px, full w) ----+
|                                        |
|  BOTTOM HALF: After portrait           |
|  Label: "NA" (top-left, pill badge)    |
|                                        |
+----------------------------------------+
| Bottom overlay bar (100px, #0A0A0A 85%)|
| "Van foto naar meesterwerk"            |
| Cormorant Garamond 28px #B8942A        |
| [Probeer gratis] pill button           |
| royalpet.app — Inter 11px #FAF8F3 60%  |
+----------------------------------------+
```

- Vertical stack works better for square — viewer's eye travels top to bottom naturally
- Gold line separator between before/after is the "moment of transformation"
- Bottom overlay is semi-transparent black (85% opacity) over the bottom of the after image

#### 300x250 (Medium Rectangle — Google Display Network)

```
+------------------------------+
| Before | Gold | After        |
| photo  | line | portrait     |
| 48%    | 4%   | 48%          |
|        |      |              |
| "VOOR" |      | "NA"         |
| 10px   |      | 10px         |
+------------------------------+
| #0A0A0A bar, 50px            |
| "Van foto naar               |
|  meesterwerk"                |
| Cormorant 16px #B8942A       |
| royalpet.app 10px #FAF8F3    |
+------------------------------+
```

- At this small size, skip the CTA button — the entire ad is clickable
- Keep headline to one concept: the transformation
- Logo can be omitted if space is tight; domain text is sufficient

### Color specifications summary

| Element | Color | Opacity |
|---|---|---|
| Bottom bar background | #0A0A0A | 100% (landscape/banner), 85% (square overlay) |
| Headline text | #B8942A | 100% |
| Body/label text | #FAF8F3 | 100% |
| Domain text | #FAF8F3 | 60% |
| CTA button background | #B8942A | 100% |
| CTA button text | #FFFFFF | 100% |
| Divider line | #B8942A | 100%, with 4px glow at 30% opacity |
| Label pill background | #0A0A0A | 60% |

---

## 2. SOLO PORTRAIT — GALLERY HERO

### Creative hypothesis
This concept positions the output as fine art, not a gimmick. A single stunning portrait with minimal text creates a "scroll-stopping" moment where the viewer pauses because the image quality itself is remarkable. This targets the premium buyer who values aesthetics and will pay for print/canvas — not just the free download seeker.

### Source image

**PRIMARY:** `assets_visuals/2. RoyalApp Dogs/RoyalPet Picture Web content 03.png`
- Stafford (Pit Bull type) on gold cushion, ermine royal cape, jeweled gold necklace, candlelit palace background
- WHY: This is your single strongest portrait. The warm gold palette aligns perfectly with your brand colors. The dog's upward gaze creates aspiration and nobility. The rich detail (candelabras, tassels, ermine fur) reads as "museum quality" even at small sizes. The Stafford breed also creates a powerful emotional contrast — a breed often misunderstood, shown in regal dignity. That emotional hook drives shares.

**ALTERNATIVE (for A/B testing):** `assets_visuals/2. RoyalApp Dogs/RoyalPet Picture Web content 06.png`
- Pomeranian in dark royal velvet with ruby pendant, dark moody background
- WHY: Tests the opposite approach — dark/moody vs warm/golden. The Pomeranian is a popular breed in NL/BE. The smaller breed may resonate with a different audience segment (apartment owners, older demographics).

### Copy

| Element | Dutch text | Char count |
|---|---|---|
| Headline (overlay) | Elk huisdier verdient een troon | 31 chars |
| Alternative headline | De adel die hij verdient | 24 chars |
| Sub-headline | AI-geschilderd Renaissance portret | 34 chars |
| CTA button | Maak uw portret | 15 chars |
| Price anchor | Gratis proberen | 15 chars |
| Domain badge | royalpet.app | 12 chars |

### Layout specifications

#### 1200x628 (Landscape)

```
+------------------------------------------------------------------+
|                                                                  |
|    [Portrait occupies right 55% of canvas, full height]          |
|                                                                  |
|  Left 45%: Dark overlay area                                    |
|  #0A0A0A with 90% opacity gradient                              |
|  fading to transparent at ~40% from left                         |
|                                                                  |
|  Content (left-aligned, 40px padding):                           |
|                                                                  |
|  RoyalPet (logo, Cormorant 14px, #B8942A, uppercase tracking)   |
|  [16px spacer]                                                   |
|  "Elk huisdier                                                   |
|   verdient                                                       |
|   een troon"                                                     |
|  Cormorant Garamond 36px, #FAF8F3, line-height 1.15             |
|  [8px spacer]                                                    |
|  "AI-geschilderd Renaissance portret"                            |
|  Inter 14px, #FAF8F3, 70% opacity                               |
|  [20px spacer]                                                   |
|  [Maak uw portret] pill button                                   |
|  #B8942A bg, #FFFFFF text, Inter 14px 600 weight                 |
|  padding: 12px 28px, border-radius: 4px                         |
|  [12px spacer]                                                   |
|  "Gratis proberen" Inter 11px #B8942A                            |
|                                                                  |
+------------------------------------------------------------------+
```

- The portrait bleeds to the right edge — no border, no frame. Let the art speak.
- Left gradient: pure black at x=0, fading to transparent at x=40%. This keeps the text readable without a hard box.
- The portrait should be positioned so the dog's face is in the right third of the canvas (rule of thirds).

#### 1080x1080 (Square)

```
+----------------------------------------+
|                                        |
|  [Portrait fills entire canvas]        |
|  Positioned so face is in top 40%      |
|                                        |
|                                        |
+----------------------------------------+
| Bottom gradient overlay                |
| (transparent at top, #0A0A0A 90%       |
|  at bottom, covering bottom 40%)       |
|                                        |
| "Elk huisdier verdient een troon"      |
| Cormorant Garamond 32px #FAF8F3        |
| [8px spacer]                           |
| [Maak uw portret] gold pill button     |
| [8px spacer]                           |
| royalpet.app Inter 11px #FAF8F3 50%    |
+----------------------------------------+
```

- Portrait is the hero — fills the entire frame
- Bottom gradient overlay creates readable zone for text
- Minimal text. Maximum visual impact.

#### 300x250 (Banner)

```
+------------------------------+
|                              |
|  [Portrait fills canvas]     |
|  Face centered               |
|                              |
+------------------------------+
| #0A0A0A bar, 60px            |
| "Elk huisdier verdient       |
|  een troon"                  |
| Cormorant 15px #FAF8F3       |
| royalpet.app 9px #B8942A     |
+------------------------------+
```

- At 300x250, the portrait does all the work. Keep text to absolute minimum.
- The quality of the image is the ad. If the portrait looks incredible at 300x250, the viewer clicks.

### Color specifications summary

| Element | Color | Notes |
|---|---|---|
| Gradient overlay | #0A0A0A | 0% to 90% opacity, left-to-right (landscape) or bottom-to-top (square) |
| Primary headline | #FAF8F3 | 100% opacity |
| Sub-headline | #FAF8F3 | 70% opacity |
| CTA button bg | #B8942A | 100% |
| CTA button text | #FFFFFF | 100% |
| Micro-copy ("Gratis proberen") | #B8942A | 100% — links visually to the CTA |
| Logo text | #B8942A | 100%, uppercase, tracking 3px |

---

## 3. LIFESTYLE/INTERIOR

### Creative hypothesis
This concept answers the question "where does this go?" before the viewer asks it. By showing the portrait in a real home setting, you activate the buyer's imagination — they see it on THEIR wall, above THEIR sofa. This is the most effective concept for driving print/canvas purchases (higher AOV) because it frames the product as home decor, not just a digital novelty.

### Source image

**PRIMARY:** `assets_visuals/3. Interier pictures/Living picture 5.jpg`
- Labrador portrait in gold frame, cozy room with natural sunlight, window with curtains, books, plant, blanket on sofa
- WHY: This is your strongest lifestyle image by far. The warm sunlight creates an aspirational "Sunday morning" feeling. The room is stylish but achievable — viewers can see their own home looking like this. The gold frame ties directly to your brand color. The Labrador breed is the most popular in NL. The image composition has natural negative space (right side with sofa) perfect for text overlay.

**SECONDARY (for A/B test):** `assets_visuals/3. Interier pictures/Living picture.jpg`
- Border Collie portrait in ornate gold frame, above beige sofa with plants
- WHY: Tests a more "curated Instagram" aesthetic. The gold frame is more ornate, the setting more "designed." May resonate with 25-35 demographic.

**TERTIARY (for dark/moody test):** `assets_visuals/3. Interier pictures/Living picture 2.jpg`
- Border Collie portrait above wooden sideboard with candles, warm dining room
- WHY: Evening/candlelit mood. Tests whether "cozy evening" outperforms "bright morning." Candlelight ties to the Renaissance theme of the portraits.

### Copy

| Element | Dutch text | Char count |
|---|---|---|
| Headline (overlay) | Kunst die van uw huisdier houdt | 31 chars |
| Alternative headline | Uw muur verdient een meesterwerk | 32 chars |
| Sub-headline | Van foto naar schilderij in 60 seconden | 39 chars |
| CTA button | Begin hier | 10 chars |
| Price anchor | Fine Art Prints vanaf EUR 89 | 27 chars |
| Domain badge | royalpet.app | 12 chars |

### Layout specifications

#### 1200x628 (Landscape)

```
+------------------------------------------------------------------+
|                                                                  |
|  [Interior photo fills entire canvas]                            |
|                                                                  |
|  The portrait-on-wall is naturally positioned left-center        |
|  Text goes in the right side where there is negative space       |
|  (sofa/blanket area in Living picture 5.jpg)                     |
|                                                                  |
|  Right-aligned text block (right 40%, 40px padding):             |
|                                                                  |
|  Semi-transparent backing: #0A0A0A, 70% opacity                 |
|  border-radius: 8px, padding: 24px                               |
|                                                                  |
|  "Kunst die van uw                                               |
|   huisdier houdt"                                                |
|  Cormorant Garamond 30px #FAF8F3, line-height 1.2               |
|  [6px spacer]                                                    |
|  Gold divider line: 40px wide, 2px, #B8942A                     |
|  [6px spacer]                                                    |
|  "Fine Art Prints vanaf EUR 89"                                  |
|  Inter 13px #FAF8F3 70% opacity                                  |
|  [16px spacer]                                                   |
|  [Begin hier] pill button                                        |
|  #B8942A bg, #FFFFFF text, Inter 13px 600                        |
|  [8px spacer]                                                    |
|  royalpet.app Inter 10px #FAF8F3 50%                             |
|                                                                  |
+------------------------------------------------------------------+
```

- CRITICAL: do NOT cover the portrait hanging on the wall — that is the focal point
- Text card floats in the negative space (right side for Living picture 5, or bottom for others)
- The semi-transparent card ensures readability on any background

#### 1080x1080 (Square)

```
+----------------------------------------+
|                                        |
|  [Interior photo fills canvas]         |
|  Portrait on wall visible in           |
|  upper portion                         |
|                                        |
|                                        |
+----------------------------------------+
| Bottom overlay gradient                |
| #0A0A0A, 0% at 60% height,            |
| 85% at bottom                          |
|                                        |
| "Kunst die van uw huisdier houdt"      |
| Cormorant 28px #FAF8F3                 |
| [gold divider 40px]                    |
| "Fine Art Prints vanaf EUR 89"         |
| Inter 13px #FAF8F3 70%                 |
| [Begin hier] gold pill                 |
| royalpet.app 11px                      |
+----------------------------------------+
```

- For square, crop the interior image to show the portrait prominently in the upper half
- Bottom gradient overlay for text zone
- The portrait on the wall must be fully visible and recognizable

#### 300x250 (Banner)

```
+------------------------------+
|                              |
|  [Interior photo, cropped    |
|   to show portrait on wall   |
|   + partial room context]    |
|                              |
+------------------------------+
| #0A0A0A bar, 55px            |
| "Uw muur verdient een        |
|  meesterwerk"                |
| Cormorant 14px #FAF8F3       |
| "Vanaf EUR 89" 10px #B8942A  |
+------------------------------+
```

- At this size, the image must clearly show: (1) a portrait on a wall, (2) it's in a real room
- If the portrait on the wall is too small to read, this concept fails at 300x250 — consider using the before/after or solo portrait concept instead for this size

---

## 4. RSA COPY

### Architecture strategy

15 headlines organized into 5 categories (3 per category). This ensures that any algorithmic combination produces a coherent, grammatically correct ad. Each headline must work independently AND in combination with any other headline.

Pin strategy:
- Pin 1 high-intent headline to Position 1 (so it always shows as the first headline)
- Pin 1 CTA headline to Position 3 (so it always ends with action)
- Let Google rotate everything else

### Headlines (15 total, max 30 characters each)

**Category A: Brand + Product Identity (what it is)**

| # | Headline | Chars | Pin | Notes |
|---|---|---|---|---|
| H1 | Huisdier Renaissance Portret | 28 | Pin 1 | Core product descriptor. Pin to Position 1 for high-intent searches. |
| H2 | AI-Geschilderd Dierenportret | 28 | -- | Emphasizes AI technology angle. |
| H3 | RoyalPet - Dierenportretten | 27 | -- | Brand name + category. Useful for brand awareness. |

**Category B: Emotional Benefit (why it matters)**

| # | Headline | Chars | Pin | Notes |
|---|---|---|---|---|
| H4 | Uw Huisdier Als Edelman | 23 | -- | Emotional transformation promise. |
| H5 | Vereeuw Uw Trouwe Metgezel | 27 | -- | Pulls from brand copywriting guide. "Vereeuw" = immortalize. |
| H6 | Kunst Die Van Uw Dier Houdt | 27 | -- | Emotional — the art "loves" your pet. |

**Category C: Features + Process (how it works)**

| # | Headline | Chars | Pin | Notes |
|---|---|---|---|---|
| H7 | Van Foto Naar Meesterwerk | 25 | -- | Transformation in 5 words. Works as standalone or with benefit headline. |
| H8 | Klaar In Slechts 60 Seconden | 29 | -- | Speed as differentiator. Addresses "how long does it take" concern. |
| H9 | Upload Foto - Ontvang Kunst | 27 | -- | Simple 2-step process. Removes friction anxiety. |

**Category D: Price + Offer (what it costs)**

| # | Headline | Chars | Pin | Notes |
|---|---|---|---|---|
| H10 | Gratis Proberen - Geen Risico | 30 | -- | Free trial is the strongest conversion hook. |
| H11 | Fine Art Prints Vanaf EUR 89 | 28 | -- | Price anchor for print buyers. |
| H12 | Canvas Meesterwerk Vanaf EUR 299 | ERROR: 32 chars | -- | OVER LIMIT — see replacement below |
| H12 | Canvas Vanaf EUR 299 | 20 | -- | Price anchor for canvas buyers. Shorter version. |

**Category E: CTA + Urgency (what to do now)**

| # | Headline | Chars | Pin | Notes |
|---|---|---|---|---|
| H13 | Maak Nu Uw Portret | 18 | Pin 3 | Direct CTA. Pin to Position 3 so the ad always ends with action. |
| H14 | Probeer Het Gratis Uit | 22 | -- | Low-commitment CTA for hesitant clickers. |
| H15 | Het Perfecte Cadeau | 19 | -- | Gift angle — especially strong for birthdays, holidays. "Cadeau" is a high-volume search term. |

### Descriptions (4 total, max 90 characters each)

| # | Description | Chars | Notes |
|---|---|---|---|
| D1 | Upload een foto van uw huisdier en ontvang een prachtig Renaissance portret in 60 seconden. | 92 | OVER LIMIT — see replacement below |
| D1 | Upload een foto en ontvang een Renaissance portret van uw huisdier. Klaar in 60 seconden. | 90 | Full value prop in one sentence. Process + speed + outcome. |
| D2 | Gratis preview, prints vanaf EUR 89. Uw hond of kat als koninklijk meesterwerk aan de muur. | 91 | OVER LIMIT — see replacement below |
| D2 | Gratis preview. Prints vanaf EUR 89. Uw hond of kat als koninklijk meesterwerk aan de muur. | 92 | STILL OVER — see replacement below |
| D2 | Gratis preview, prints vanaf EUR 89. Uw huisdier als koninklijk meesterwerk aan uw muur. | 89 | Price + aspiration + interior visualization. |
| D3 | AI-technologie transformeert uw huisdierfoto tot museumwaardig kunstwerk. Probeer het gratis. | 94 | OVER LIMIT — see replacement below |
| D3 | AI transformeert uw huisdierfoto tot museumwaardig kunstwerk. Probeer het vandaag gratis. | 89 | Technology credibility + museum quality + free CTA. |
| D4 | Het perfecte cadeau voor dierenliefhebbers. Fine art print of canvas in Renaissance stijl. | 91 | OVER LIMIT — see replacement below |
| D4 | Het perfecte cadeau voor dierenliefhebbers. Fine art of canvas in Renaissance stijl. | 85 | Gift angle for search queries containing "cadeau." |

### Final validated set (copy-paste ready)

**Headlines:**
```
H1:  Huisdier Renaissance Portret     [28] PIN 1
H2:  AI-Geschilderd Dierenportret     [28]
H3:  RoyalPet - Dierenportretten      [27]
H4:  Uw Huisdier Als Edelman          [23]
H5:  Vereeuw Uw Trouwe Metgezel       [27]
H6:  Kunst Die Van Uw Dier Houdt      [27]
H7:  Van Foto Naar Meesterwerk        [25]
H8:  Klaar In Slechts 60 Seconden     [29]
H9:  Upload Foto - Ontvang Kunst      [27]
H10: Gratis Proberen - Geen Risico    [30]
H11: Fine Art Prints Vanaf EUR 89     [28]
H12: Canvas Vanaf EUR 299             [20]
H13: Maak Nu Uw Portret               [18] PIN 3
H14: Probeer Het Gratis Uit           [22]
H15: Het Perfecte Cadeau              [19]
```

**Descriptions:**
```
D1: Upload een foto en ontvang een Renaissance portret van uw huisdier. Klaar in 60 seconden.  [90]
D2: Gratis preview, prints vanaf EUR 89. Uw huisdier als koninklijk meesterwerk aan uw muur.   [89]
D3: AI transformeert uw huisdierfoto tot museumwaardig kunstwerk. Probeer het vandaag gratis.   [89]
D4: Het perfecte cadeau voor dierenliefhebbers. Fine art of canvas in Renaissance stijl.       [85]
```

### Combination quality check

Any 3 headlines + 2 descriptions must read coherently. Sample combinations:

**Combination 1 (high intent search: "huisdier portret laten maken"):**
> Huisdier Renaissance Portret | Van Foto Naar Meesterwerk | Maak Nu Uw Portret
> Upload een foto en ontvang een Renaissance portret van uw huisdier. Klaar in 60 seconden.
> Gratis preview, prints vanaf EUR 89. Uw huisdier als koninklijk meesterwerk aan uw muur.

**Combination 2 (gift search: "cadeau hondenliefhebber"):**
> Het Perfecte Cadeau | Uw Huisdier Als Edelman | Probeer Het Gratis Uit
> Het perfecte cadeau voor dierenliefhebbers. Fine art of canvas in Renaissance stijl.
> AI transformeert uw huisdierfoto tot museumwaardig kunstwerk. Probeer het vandaag gratis.

**Combination 3 (price-sensitive: "hond op canvas prijs"):**
> Fine Art Prints Vanaf EUR 89 | Klaar In Slechts 60 Seconden | Maak Nu Uw Portret
> Gratis preview, prints vanaf EUR 89. Uw huisdier als koninklijk meesterwerk aan uw muur.
> Upload een foto en ontvang een Renaissance portret van uw huisdier. Klaar in 60 seconden.

All three read naturally. No grammatical conflicts. No redundancy. Each combination tells a complete story: what it is, why it matters, what to do.

---

## 5. SITELINK EXTENSIONS

Sitelinks drive CTR by 10-20% and give you more SERP real estate. Each sitelink should target a different intent.

| # | Sitelink text (max 25 chars) | Description line 1 (max 35 chars) | Description line 2 (max 35 chars) | URL path |
|---|---|---|---|---|
| S1 | Gratis Portret Maken | Upload foto, zie resultaat | Klaar in 60 seconden | /probeer |
| S2 | Prints & Canvas Bekijken | Fine art prints vanaf EUR 89 | Museum-kwaliteit bij u thuis | /producten |
| S3 | Zo Werkt Het | Foto uploaden, AI maakt kunst | Gratis preview, betaal later | /hoe-werkt-het |
| S4 | Cadeau Voor Dierenliefhebber | Uniek en persoonlijk cadeau | Hond of kat als Renaissance ster | /cadeau |

**URL paths:** These should be landing page paths on royalpet.app. If these pages don't exist yet, the homepage (/) works as fallback with appropriate UTM parameters.

---

## 6. CALLOUT EXTENSIONS

Callouts appear below the ad and highlight key selling points in short phrases. They don't link anywhere — they're trust builders.

| # | Callout text (max 25 chars) | Purpose |
|---|---|---|
| C1 | Gratis Preview | Removes risk/commitment fear |
| C2 | Klaar In 60 Seconden | Speed as differentiator |
| C3 | iDEAL & Bancontact | Payment trust for NL/BE market |
| C4 | Fine Art Kwaliteit | Premium positioning |
| C5 | Verzending NL, BE & DE | Geographic coverage |
| C6 | Kader Naar Keuze | Highlights customization |

**Recommendation:** Use C1 + C2 + C3 + C4 as your primary set. Add C5 and C6 as secondary. Google will show 2-6 callouts depending on device and ad rank.

---

## 7. ASSET SELECTION RATIONALE

### Why these specific images were chosen

**Before/After concept — Border Collie pairing:**
- The unsplash Border Collie photo is the most "phone camera" looking image in your library. It doesn't look staged or professional. This is critical because the viewer needs to think "I could upload a photo like that." If the before image looks too polished, the transformation feels less impressive.
- The GPT 1.5 Border Collie output (military doublet) has the highest visual contrast from the casual photo. Military uniform + lace collar + stone column = unmistakably "old master painting."
- Same breed in both images creates an instant visual connection without needing explanation.

**Solo portrait — Stafford on gold cushion:**
- This image has the highest visual richness of all your generated portraits. The warm gold palette (cushion, candelabras, chain necklace) directly echoes your brand color #B8942A.
- The upward gaze creates aspiration — the dog literally looks "above it all." This emotional response drives clicks.
- The image works at every size because the composition is centered and the subject is large in frame.
- Staffords are popular in NL and have a strong emotional connection with their owners.

**Lifestyle — Labrador by window:**
- This is the only interior image where the portrait on the wall AND the room atmosphere are both excellent. The others (Living picture 3, 4) show the portrait clearly but the room feels more sterile.
- Warm sunlight = positive emotion = higher engagement.
- The gold frame in the image matches your brand.
- Labrador is the most popular breed in the Netherlands. Viewers are more likely to imagine their own dog.
- Natural negative space on the right side (sofa + blanket) provides perfect text placement without covering the portrait.

### Images NOT recommended and why

- `Flux 2 output.jpg` and `FLux 2 output 02.jpg` — lower quality than GPT 1.5 outputs, less detail
- `Living picture 3.jpg` (Stafford, modern black frame, minimal room) — the room is too empty/clinical, doesn't create warmth
- `Living picture 4.jpg` (similar angle to 3) — same issue, also the window takes too much space
- `RoyalPet Picture Web content 05.png` (Golden Retriever on pink chaise) — the pink/pastel palette conflicts with your dark/gold brand system. Beautiful image, wrong brand context.
- `kc2zjh.webp` — too small/low resolution for ad production

---

## 8. PRODUCTION CHECKLIST

### Files to create in Canva/Figma

```
ads/
  before-after/
    before-after-1200x628.png
    before-after-1080x1080.png
    before-after-300x250.png
  solo-portrait/
    solo-portrait-1200x628.png
    solo-portrait-1080x1080.png
    solo-portrait-300x250.png
  lifestyle/
    lifestyle-1200x628.png
    lifestyle-1080x1080.png
    lifestyle-300x250.png
```

### Pre-upload quality checks

- [ ] All text is readable at actual display size (not just zoomed in)
- [ ] Gold (#B8942A) text has sufficient contrast against background (test with WebAIM checker)
- [ ] No text in the center 80% of image (Google's safe zone for responsive display ads)
- [ ] CTA button looks clickable (rounded corners, clear contrast)
- [ ] Domain "royalpet.app" visible on every creative
- [ ] File size under 150KB per image (Google requirement for display ads)
- [ ] No spelling errors in Dutch copy
- [ ] Before/after images are clearly different (not just a filter effect)
- [ ] Portrait on wall in lifestyle image is recognizable at 300x250

### Font files needed

- Cormorant Garamond Bold (Google Fonts — free, available in Canva)
- Inter Regular + Medium (Google Fonts — free, available in Canva)

### Testing plan

**Week 1-2: Launch all 3 concepts**
- Run all 9 ad variations (3 concepts x 3 sizes) simultaneously
- Equal budget split
- Primary metric: CTR (which concept stops the scroll?)
- Secondary metric: conversion rate (which concept attracts buyers, not just clickers?)

**Week 3-4: Optimize winners**
- Kill the lowest-performing concept entirely
- Create 2 variations of each winning concept:
  - Before/after: test different breed pairings
  - Solo portrait: test Stafford vs Pomeranian
  - Lifestyle: test bright morning vs candlelit evening
- Test different headlines on the same visual

**Week 5+: Scale**
- Winning concept gets 70% of creative budget
- Runner-up gets 30%
- Introduce new concepts monthly to combat creative fatigue
- Refresh headlines every 2 weeks

---

## APPENDIX: STRUCTURED SNIPPET EXTENSIONS

Recommended structured snippets to further increase ad real estate:

| Header | Values (Dutch) |
|---|---|
| Typen | Digitale Download, Fine Art Print, Canvas, Met Kader |
| Merken | RoyalPet |
| Stijlen | Renaissance, Koninklijk, Klassiek, Victoriaans |

---

## APPENDIX: PROMOTION EXTENSION

For future campaigns (holidays, launch period):

| Occasion | Promotion text | Promo code |
|---|---|---|
| Launch | 10% korting op eerste bestelling | LAUNCH10 |
| Kerst | Kerst cadeau: gratis verzending | KERST2026 |
| Dierendag (Oct 4) | Dierendag: 15% korting alle prints | DIERENDAG |

---

*Document created: April 2026 | RoyalPet.app | For Google Ads campaign launch*
