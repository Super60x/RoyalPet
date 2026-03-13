# Learnings — Dag 04: Preview Page — Product Selector + Kaders + Dynamische Prijzen

> Sessie: 4 | Datum: 2026-03-13

---

## Wat is er gebouwd

### Product Selector (Two-Step UX)
- `src/config/products.ts` — Product catalogus met 9 producten, prijzen in centen, tooltip per maat
- `src/components/preview/ProductSelector.tsx` — Stap 1: type kiezen (3 grote radio cards), Stap 2: maat kiezen (pills)
- Auto-selectie van goedkoopste maat bij type-switch
- Tooltips op size pills (`title` attribuut): "Past op uw bureau of nachtkastje" etc.
- Smooth `scrollIntoView` bij maat-selectie op mobiel

### Frame Selector
- `src/components/preview/FrameSelector.tsx` — Horizontale scrollbare strip met 6 kaderopties
- Kleurswatches (72x72px) met gouden ring op selectie
- "Geen kader" standaard geselecteerd (gratis)
- Frame data uit Supabase `frames` tabel

### Portrait Hero + Price Summary
- `src/components/preview/PortraitHero.tsx` — 2:3 aspect ratio, frame overlay systeem (momenteel null)
- `src/components/preview/PriceSummary.tsx` — Desktop inline + mobile sticky bottom bar
- `src/components/preview/SocialProof.tsx` — Trust signals

### PreviewClient Rewrite
- `src/app/preview/[id]/PreviewClient.tsx` — Twee-kolom layout (portret links, selectie rechts)
- State management: selectedProduct, selectedFrame
- Parallel data fetching: portrait + frames via Promise.all

### RetryPanel Dutch Translation
- 11 Engelse strings vertaald naar Nederlands in `src/components/preview/RetryPanel.tsx`

## Wat ging goed
- Two-step selector UX is intuïtief — voorkomt keuzestress bij oudere doelgroep
- Alle componenten in 1 sessie gebouwd en werkend
- Build slaagt direct na alle wijzigingen
- Sticky mobile bar is een goede UX pattern voor checkout flows

## Wat ging fout
- **Frame overlay PNGs bestaan niet** — Supabase frames tabel heeft `overlay_url` maar bestanden ontbreken in storage. Tijdelijke fix: `frameOverlayUrl={null}` met TODO
- **Replicate 429 throttling** — Account heeft <$5 credit, waardoor Real-ESRGAN upscale faalt. Retry wordt heel langzaam. Geen code bug, maar credit issue
- **.next cache corruptie** — "Cannot find module './vendor-chunks/next.js'" — bekende Windows issue, fix: `rm -rf .next`

## Wat geleerd

### UX voor 50+ doelgroep
- Grote touch targets (min 44px, liefst 80px voor radio cards)
- Two-step selectie: eerst type, dan maat — niet alles tegelijk tonen
- Auto-selectie van defaults vermindert beslissingslast
- Tooltips met `title` attribuut voor context ("Past op uw bureau of nachtkastje")
- Step indicator ("Stap 1 van 3") geeft oriëntatie in het proces

### Sticky Mobile Bar
- `fixed bottom-0 z-30` met `pb-28` op main content voor clearance
- Desktop: inline, mobiel: sticky — responsive pattern

### localStorage voor Checkout
- CTA slaat selectie op in localStorage (portrait_id, product, frame, totaal)
- Stripe checkout wordt in volgende sessie gebouwd — localStorage bridges de gap

### Frame Overlay Systeem
- Ontworpen voor PNG overlays via `position: absolute` + `next/image fill`
- Momenteel disabled omdat PNGs nog niet bestaan in Supabase Storage
- Frames tabel data wordt al correct opgehaald en weergegeven

---

## Voorbereiding volgende sessie
- Top up Replicate credit (minimaal $5) om throttling te voorkomen
- Run `rm -rf .next` bij start voor schone cache
- Upload frame overlay PNGs naar Supabase Storage (of bestel via Fiverr)
- Sessie 4 checklist: E-mail Modal + Stripe Checkout
- Test retry met voldoende Replicate credits
