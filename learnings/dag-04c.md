# Learnings — Dag 04c: Frame UX + Prompt fixes + Mobile retry

> Sessie: 4b (polish) | Datum: 2026-03-17

---

## Wat is er gebouwd

### Frame selection UX
- FrameSelector disabled state bij digitale download (opacity + pointer-events-none + hint tekst)
- Auto-reset naar "geen kader" bij switch naar digital product
- Success page gebruikt nu PortraitHero component met frame overlay

### PortraitHero robuustheid
- Overlay PNG wordt alleen gebruikt als het een volledige URL is (`http...`)
- Placeholder paden (`/frames/klassiek_goud.png`) worden genegeerd → CSS frame als fallback
- Voorkomt broken image icons wanneer PNGs nog niet in Supabase Storage staan

### Prompt verfijningen
- "Wearing a doublet" → "A doublet is draped over its back" — voorkomt menselijk lichaam
- Sterkere anti-instructies: "NOT sitting upright like a human, NO human body, NO human hands or arms"
- Gender modifier werkt nu op draped fabrics, niet op "attire"

### Mobile retry panel
- Was: overlay over portret (onbruikbaar op klein scherm, tekst te klein)
- Nu: `hidden md:flex` op overlay, apart `md:hidden` blok onder het portret
- RetryPanel: `max-w-full md:max-w-sm` voor full-width op mobile

## Wat ging goed
- CSS frame systeem (border + box-shadow + passe-partout) ziet er premium uit zonder PNGs
- PortraitHero hergebruik op success page = geen duplicate code
- TypeScript type check vangt fouten direct op

## Wat ging fout

### Broken frame overlay op success page
- **Probleem:** Frames tabel heeft `overlay_url` ingevuld met relatieve paden (`/frames/klassiek_goud.png`), maar die bestanden bestaan niet in Supabase Storage.
- **Gevolg:** `hasOverlayPng = true` → CSS frame wordt overgeslagen → broken image icon.
- **Fix:** Check of overlay_url begint met `http` — anders negeren en CSS frame gebruiken.
- **Les:** Placeholder data in de database kan onverwachte UI-bugs veroorzaken. Valideer altijd of een URL daadwerkelijk bereikbaar is, of check op format.

## Wat geleerd

### CSS vs PNG frames
- CSS frames (border + box-shadow + passe-partout) zijn verrassend effectief als placeholder
- PNG overlays zijn alleen nodig voor realistische houtnerf/textuur effecten
- Dual-mode systeem (CSS fallback, PNG override) is robuust

### React state management
- Bij product type switch: altijd gerelateerde state resetten (frame → "geen" bij digital)
- `useCallback` met lege deps + eslint-disable is OK voor stable handlers die closure vars niet nodig hebben

---

## Voorbereiding volgende sessie
- Sessie 5: Share URL + Virale Loop + i18n
- Eerste taak: `/portret/[id]` publieke share pagina bouwen
- Geen extra accounts/keys nodig
- Overweeg: frame overlay PNGs bestellen via Fiverr voor realistische preview
