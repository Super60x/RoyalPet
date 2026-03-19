# Learnings — Dag 05b: E2E Flow Bugfixes + Email Improvements

> Sessie: 5b | Datum: 2026-03-18

---

## Wat is er gebouwd

### Retry logic — credits always required
- Removed "1 gratis retry" logic from API (`/api/generate/retry`) and UI (`RetryPanel.tsx`)
- Every retry now costs 1 credit — no free retries
- "1 gratis" badge removed from preview page
- RetryPanel shows "Geen credits — koop credits om te bewerken" when credits = 0

### Stripe shipping address + phone fix (ROOT CAUSE)
- **Root cause found:** Stripe API 2026+ stores shipping under `session.collected_information.shipping_details`, NOT `session.shipping_details` (top-level)
- Fixed webhook to use correct path: `session.collected_information?.shipping_details`
- Added phone number extraction from `session.customer_details?.phone`
- Phone number now stored in `shipping_address` JSONB and shown in emails

### Email template improvements
- **Dynamic frame styling:** Email portrait now shows CSS frame matching the selected kader (zwart, wit, goud, walnoot, zilver) instead of always gold
- **Customer email:** Added shipping address, removed broken `royalpet.app/success/` link (replaced with support contact)
- **Owner email:** Added phone number field, golden frame border replaced with dynamic frame, address now includes phone

### Duplicate email fix (webhook race condition)
- **Problem:** Stripe CLI sends webhook 2x nearly simultaneously, causing duplicate orders + emails
- **Fix — 4 layers of protection:**
  1. In-memory `Set<string>` lock on session ID (prevents concurrent processing)
  2. DB idempotency check (existing `stripe_session_id` query)
  3. Insert error handling (catches `23505` duplicate key error)
  4. UNIQUE INDEX on `orders.stripe_session_id` (DB-level constraint)

## Wat ging goed
- Shipping address + phone now correctly extracted and stored in Supabase
- Dynamic frame CSS in emails looks great (tested with Klassiek Walnoot)
- Duplicate email fix works — confirmed 1 email per order
- All fixes built cleanly with zero TypeScript errors

## Wat ging fout

### Stripe API version breaking change
- **Probleem:** `shipping_details` moved from top-level session to `collected_information.shipping_details` in Stripe API 2026+
- **Gevolg:** Shipping address was always `null` in Supabase, emails showed no address
- **Les:** Always check Stripe SDK TypeScript definitions (`node_modules/stripe/types/`) when data is unexpectedly null — the API structure changes between versions

### Supabase CLI SQL execution
- **Probleem:** Could not run SQL migrations from CLI without DB password
- **Fix:** Ran UNIQUE INDEX via Supabase Dashboard SQL Editor instead
- **Les:** Keep Supabase DB password accessible in .env.local for future migrations

## Wat geleerd

### Stripe API 2026 data structure
- `session.collected_information.shipping_details` — shipping address (new path)
- `session.customer_details.phone` — phone number from phone_number_collection
- `session.customer_details.name` — customer name
- Old `session.shipping_details` (top-level) is deprecated/removed

### Webhook race condition patterns
- Stripe CLI (and sometimes production) sends webhooks 2x nearly simultaneously
- DB SELECT + INSERT is NOT atomic — race condition between check and insert
- Best fix: UNIQUE constraint on discriminator column + in-memory lock + error handling
- `processingSessionIds` Set with 60s TTL cleanup prevents memory leaks

### Email HTML frame styling
- Inline CSS only (no classes) for email compatibility
- `box-shadow: inset` creates inner border effect for classic frames
- Different frame colors: `#1a1a1a` (zwart), `#f5f5f0` (wit), `#B8942A` (goud), `#5C3A1E` (walnoot), `#A8A8A8` (zilver)

---

## Voorbereiding volgende sessie
- **Sessie 5c:** Share URL + Virale Loop
  - `/portret/[id]` publieke share pagina
  - WhatsApp/Email deelknoppen + "Kopieer link"
  - share_count ophogen bij bezoek
  - CTA "Vereeuw ook uw huisdier" → homepage
- Geen extra accounts/keys nodig
- i18n uitgesteld naar aparte sessie
