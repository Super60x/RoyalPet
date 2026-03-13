# Learnings — Dag 03: Usage Limiting + Model Switch + Prompt Overhaul + Auto-Upscaling

> Sessie: 3 | Datum: 2026-03-12

---

## Wat is er gebouwd

### Usage Limiting (IP + Signed Cookie)
- `src/lib/usage-limit.ts` — HMAC-SHA256 signed cookie + in-memory IP store
- `src/app/api/usage/route.ts` — GET endpoint voor remaining count
- `src/components/upload/UsageLimitReached.tsx` — blocked state UI
- UploadSection + DropZone tonen "X van 3 gratis portretten beschikbaar"
- Cookie format: `{visitorId}:{count}:{createdAt}.{hmacSignature}`
- Dual tracking: cookie is primair (getekend = betrouwbaar), IP als fallback

### Model Switch (3 modellen)
- **Primary:** `openai/gpt-image-1.5` — 1024x1536, quality=high, input_fidelity=high
- **Fallback:** `black-forest-labs/flux-2-pro` — strength=0.8, guidance=3.5
- **Upscaler:** `nightmareai/real-esrgan` — scale=2, face_enhance=false
- Auto-fallback in status route: als primary faalt, start automatisch fallback
- Upscale inline polling: max 45 seconden wachten

### Prompt Overhaul
- 8 base prompts (4 stijlen x 2 poses: liggend + staand)
- Gestructureerde secties: IDENTITY, POSE, ATTIRE, ANATOMY, LIGHTING, BACKGROUND, TECHNIQUE, MOOD
- Anti-instructies embedded: "NO human hands, NO human arms, NO humanoid limbs"
- Pet-agnostisch: "fur or feather colors" werkt voor honden, katten, vogels, etc.
- Modifier systeem: gender, kleurvoorkeur, custom edit — allemaal appended aan base prompt

### RetryPanel Uitbreidingen
- Pose checkbox: "Staand portret" toggle
- Kleur aanpassen: tekstveld voor kleurvoorkeur (max 100 chars)
- Beide nieuwe velden worden doorgestuurd naar retry API

### Database
- Migration 006: `pose` (default 'laying_down') + `model_used` kolommen

## Wat ging goed
- Usage limit systeem in 1 keer werkend (build slaagde direct)
- Prompt structuur is schoon en uitbreidbaar
- Multi-model fallback architectuur is elegant — client merkt niets van model switch
- Clean images worden nu als PNG opgeslagen (niet WebP) voor max downloadkwaliteit

## Wat ging fout
- `eslint-disable-next-line @typescript-eslint/no-explicit-any` — project heeft die ESLint regel niet geïnstalleerd, geeft "rule not found" error. Fix: gebruik `Record<string, string | number | null>` type
- Supabase `.list()` met `.search` param verwacht string, niet `string | number | null` — moest casten

## Wat geleerd

### Model Keuzes (KRITIEK)
- **GPT Image 1.5** via Replicate: `image` param (niet `input_image`), `size` als string "1024x1536"
- **FLUX.2 Pro**: `image` param, `strength` voor img2img control, `guidance` voor prompt adherence
- **Real-ESRGAN**: simpel — `image`, `scale`, `face_enhance`. Typisch 5-15 seconden.
- Output kan `string` OF `string[]` zijn afhankelijk van model — altijd checken

### Cookie Security
- HMAC-SHA256 met `crypto.timingSafeEqual` voorkomt timing attacks
- httpOnly + secure + sameSite=lax is de juiste combo
- Cookie is betrouwbaarder dan IP voor individuele tracking (getekend = niet te vervalsen)
- Shared IP: nieuwe bezoeker zonder cookie krijgt benefit of the doubt

### Vercel Function Timeouts
- Hobby plan: 10 seconden max — te kort voor upscale polling (15-45s)
- Pro plan: 60 seconden — zou moeten werken
- Fallback: als upscale faalt, gebruik originele resolutie (graceful degradation)

### Prompt Engineering
- Gestructureerde secties (POSE:, ATTIRE:, etc.) werken beter dan lopende tekst
- "fur or feather colors" is een elegante manier om pet-agnostisch te zijn
- Anti-instructies IN de prompt werken goed bij GPT Image modellen
- Pose-specifieke negatives belangrijk: "NOT lying down" bij standing, "NOT standing" bij laying

---

## Voorbereiding volgende sessie
- Test GPT Image 1.5 generaties met diverse foto's (hond, kat, konijn)
- Controleer upscale kwaliteit — is 2x genoeg of moet het 4x?
- Vercel plan checken — Hobby of Pro? (bepaalt of upscale werkt)
- Commit alle Sessie 2 + 3 code
- Sessie 3 checklist: product selector, maatvarianten, kaderselectie, dynamische prijsberekening
