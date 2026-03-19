# Learnings — Dag 05c: Share URL + Virale Loop

> Sessie: 5c | Datum: 2026-03-19

---

## Wat is er gebouwd

### Publieke share pagina `/portret/[id]`
- Server component haalt portrait data op uit Supabase (id, image_url, pet_name, style, share_count)
- `ShareClient.tsx` — client component met alle interactieve elementen
- Ornate gouden CSS frame met meerdere lagen: gradient border, inner accent, passe-partout mat
- Pet naam als heading met stijlnaam ondertitel
- Donker thema (`#0A0A0A` achtergrond) voor maximale contrast met het portret

### Deelknoppen (3 opties)
- **WhatsApp:** `wa.me/?text=` met vooringevulde Nederlandse tekst + URL
- **Email:** `mailto:?subject=...&body=...` met Renaissance-stijl onderwerp
- **Kopieer link:** Clipboard API met visuele "Link gekopieerd!" feedback (2.5s)
  - Fallback voor oudere browsers via `execCommand('copy')`

### share_count tracking
- Increment in server component (fire-and-forget, blokkeert render niet)
- Telt +1 per pageview, geen deduplicatie (bewuste keuze voor MVP)

### Open Graph + Twitter meta tags
- Dynamische `generateMetadata()` functie in page.tsx
- `og:image` = watermarked portret URL (publiek toegankelijk)
- Titel bevat pet naam als die beschikbaar is
- Twitter card: `summary_large_image` voor mooie grote previews

### Links naar share pagina
- Preview pagina: "Delen" knop naast "Niet tevreden? Bewerk"
- Success pagina: "Deel dit portret" gouden CTA naast "Maak nog een meesterwerk"

### Homepage redesign — dark mode (Fable-stijl)
- Volledige homepage omgebouwd van crème/licht naar donker thema (#0A0A0A)
- Italic gouden "Vereeuw" headline met Cormorant Garamond serif
- Stap-indicator in navigatie (Upload > Preview > Download of Bestel Print)
- Minimalistische upload zone (dashed border, subtiele hover)
- Trust signals rij (klok, schild, ster iconen)
- 6-portret galerij (2x3 mobiel, 3x2 desktop) met hover zoom
- Alle upload componenten (DropZone, GenerationProgress, UploadError, PaywallScreen) naar dark mode
- Voorbeeld portretten gekopieerd naar `public/examples/` voor statische serving

## Wat ging goed
- Share pagina + homepage redesign in één sessie zonder build errors
- PortraitHero component niet hergebruikt voor share page — custom ornate frame is visueel sterker
- Subtiele share link op preview pagina past bij de flow zonder te afleiden
- Upload componenten zijn alleen op homepage gebruikt → veilig om allemaal naar dark mode om te zetten

## Wat geleerd

### Open Graph voor WhatsApp previews
- WhatsApp scrapt `og:image` voor link previews — watermarked URL werkt perfect
- `og:image` moet een publiek toegankelijke URL zijn (portraits-public bucket)
- `twitter:card: summary_large_image` geeft grote afbeeldingspreviews

### share_count zonder deduplicatie
- Bewuste MVP keuze: elke pageview = +1 (geen IP/cookie tracking)
- Simpeler dan cookie-based deduplicatie, geeft ruwe populariteitsindicatie
- Kan later verfijnd worden met unique visitor tracking

### Dark mode op component-niveau
- Homepage is dark maar preview/success pages blijven crème — per-page styling, niet globals.css
- Upload componenten (DropZone etc.) worden alleen op homepage gebruikt → safe om te converteren
- Gebruik `[#FAF8F3]/XX` opacity patterns ipv `royal-brown/XX` voor dark mode tekst
- `bg-[#FAF8F3]/[0.03]` geeft subtiele lichte achtergrond op donkere pagina's
- `UsageLimitReached.tsx` is dead code (niet meer geïmporteerd) — kan later opgeruimd worden

---

## Voorbereiding volgende sessie
- **Sessie 6:** Auth + Admin Dashboard
  - Supabase Auth configureren (Google OAuth + magic link)
  - `/admin` pagina met ordertabel + status management
  - Auto email per statuswijziging (In Productie / Verzonden / Geleverd)
- i18n uitgesteld naar aparte sessie (niet in Sessie 6)
