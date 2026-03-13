# Learnings — Dag 02: Upload + AI Generatie + Style System + Retry + Model Iteratie

> Sessie: 2 | Datum: 2026-03-09 & 2026-03-10

---

## Wat is er gebouwd

### Core Upload + AI Flow
- Drag-and-drop upload component (DropZone) met client-side validatie
- `/api/generate` — upload → Supabase Storage → Replicate
- `/api/generate/status` — client polling elke 2.5s, finalization bij completion
- Progress bar met 6 roterende Nederlandse wachtteksten
- Sharp watermark (diagonaal herhalend SVG patroon)
- Watermarked → portraits-public, clean → portraits-private
- Redirect naar `/preview/[id]`
- Rate limiting: 5 generaties per IP per uur (in-memory)

### Style System (bonus)
- 4 kunststijlen: Vlaamse Meesters, Barok Rood, Renaissance Hemel, Rococo
- Random stijl bij eerste generatie (server-side)
- Instruction-based prompts ("Transform this pet photo into...")

### Retry System (bonus — competitor-geïnspireerd)
- RetryPanel als donkere overlay OVER het portret (niet eronder)
- Stijlselectie triggert NIET automatisch — altijd via Retry knop
- Collapsible secties: Change Style, Custom Edit
- Gender toggle (Masculine/Feminine)
- 1 gratis retry, daarna geblokkeerd
- `/api/generate/retry` endpoint

### AI Model Iteratie (grootste learning)
- `flux-1.1-pro` + `image_prompt` (Redux) → juiste hond maar GEEN Renaissance stijl
- `flux-canny-pro` + `control_image` → Renaissance stijl maar VERKEERDE kleuren/gezicht
- `flux-depth-pro` + `control_image` → beter maar cartoonachtig
- **`flux-kontext-pro`** + `input_image` → BESTE resultaat: juiste hond + juiste stijl

### Database migraties
- 004: status + prediction_id kolommen op portraits
- 005: gender + custom_edit kolommen op portraits

## Wat ging goed
- Alle 13+ bestanden in één sessie gebouwd
- Build + lint slaagden na slechts 2 type fixes
- Competitor analyse leidde tot betere features (style + retry overlay)
- flux-kontext-pro gevonden als beste model na systematisch testen

## Wat ging fout
- `useRef<NodeJS.Timeout>()` — TS vereist initiële waarde → `useRef<NodeJS.Timeout | null>(null)`
- Replicate SDK `Status` type bevat `"aborted"` — moest return type naar `string`
- `next/image` blokkeert externe hostnames → Supabase hostname in `next.config.js`
- `flux-canny-pro` ondersteunt GEEN `webp` output → alleen `jpg` of `png`
- `.next` cache corrupteert regelmatig op Windows → altijd `rm -rf .next` bij errors
- `flux-1.1-pro` heeft GEEN guidance parameter (wordt genegeerd)
- `image_prompt` op flux-1.1-pro is "Redux" (compositie-referentie), NIET IP-Adapter

## Wat geleerd

### Replicate Model Keuze (KRITIEK)
- **flux-1.1-pro**: text-to-image + Redux (image_prompt voor compositie). Geen echte img2img.
- **flux-canny-pro**: ControlNet met edge detection. Behoudt contouren maar NIET kleuren.
- **flux-depth-pro**: ControlNet met depth map. Behoudt 3D-structuur maar cartoonachtig.
- **flux-kontext-pro**: Image EDITING model. Behoudt identiteit + past stijl toe. BESTE voor pet portraits.
  - Parameters: `input_image`, `prompt`, `output_format`, `safety_tolerance` (max 2 met input images)
  - Geen guidance/steps nodig — model regelt dit intern
  - Prompt format: instructie ("Transform this...") niet beschrijvend ("A painting of...")

### Prompt Engineering voor Pet Portraits
- Instructie-format werkt beter dan beschrijvend format bij kontext-pro
- "Keep the pet's exact face, fur colors, markings" is essentieel
- "Show full body, do not crop to face" voorkomt te veel inzoomen
- Museum-quality descriptors: "thick impasto brushwork", "crackled varnish", "oil on canvas"

### Next.js Dev Server op Windows
- `.next` cache corrupteert vaak → `rm -rf .next` bij "Cannot find module" errors
- Webpack module errors (682.js, 276.js) = stale cache, niet code-bug
- Altijd `taskkill //F //IM node.exe` voor clean restart

### Architectuur
- Style prompts als config object met helpers (getRandomStyle, buildPrompt)
- Retry door overschrijven van bestaand portret (zelfde ID) is simpeler dan nieuwe IDs
- Race condition guard: `WHERE status = 'processing'` voorkomt dubbele finalization

---

## Voorbereiding volgende sessie
- Commit + push alle Sessie 2 code (nog steeds uncommitted!)
- Test meer foto's met flux-kontext-pro (diverse rassen, katten)
- Sessie 3: Preview pagina uitbreiden met product selector, maatvarianten, kaderselectie, dynamische prijsberekening
