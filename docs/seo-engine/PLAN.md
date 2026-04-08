# RoyalPet — Programmatic SEO + Pinterest Distribution Plan

## What we are building

A fully automated content and distribution engine for RoyalPet.app that generates 100+ SEO pages and posts to Pinterest — with zero manual writing required after initial setup.

The engine has two parts: a **content factory** that produces Dutch-language SEO pages for every dog and cat breed, and a **distribution layer** that automatically pins those pages to Pinterest. Both run from a single script triggered either manually or on a schedule via GitHub Actions.

---

## Why this approach

RoyalPet sells a visual, emotional, gift-oriented product. The buyers — Dutch and Belgian pet owners — are already searching Google for things like "Gouden Retriever cadeau" or "huisdier portret schilderij". They just don't know RoyalPet exists yet.

Programmatic SEO solves this by meeting buyers exactly where they already search, at scale. Instead of writing one page manually, we generate 100+ pages automatically — one per breed, one per gift occasion — each targeting a slightly different keyword with genuine Dutch content. Over time this builds a wide net of organic traffic that compounds without ongoing work.

Pinterest is the ideal second channel for this product because it is visual-first, skews toward gift buyers and home decorators, and pins have a 2-year lifespan compared to 48 hours on Instagram. Dutch and Belgian users are active on Pinterest and the pet portrait niche is almost entirely untapped in Dutch.

---

## Stack we are working with

The existing RoyalPet codebase uses:
- **Next.js 14** with the App Router (`src/app/`)
- **TypeScript** and **Tailwind CSS**
- **Supabase** for database and storage
- **Replicate** already installed as a dependency (used for AI image generation)
- **Vercel** for deployment, connected to GitHub
- Design system: dark background (`royal-black`), gold accents (`royal-gold`), Cormorant Garamond heading font, Inter body font

This means the SEO pages will feel native to the existing site — same fonts, same color palette, same component patterns.

---

## Part 1 — Programmatic SEO pages

### What gets built

A dynamic route at `royalpet.app/rassen/[breed-slug]` that renders one page per breed. Each page is statically generated at build time, meaning it loads instantly and is fully crawlable by Google.

The content for each page — title tag, meta description, H1, intro paragraph, FAQ section, image alt text — is generated in Dutch by Claude via the Anthropic API. The generation script runs once and saves everything to a single JSON file in the repo. Vercel reads that file at build time to generate all the pages.

### Page types (in priority order)

1. **Breed pages** — one per popular Dutch/Belgian dog breed (50 breeds = 50 pages)
2. **Occasion pages** — verjaardag, Kerst, Moederdag, Vaderdag, jubileum, nieuw huis
3. **Cat breed pages** — secondary priority, same structure

### What each page contains

- SEO-optimised title and meta description in Dutch
- H1 with the breed name and "Renaissance portret"
- Warm intro paragraph about the breed's character and why it suits a Renaissance portrait
- A generated Renaissance portrait image of that breed (via Replicate/FLUX)
- FAQ section with 3 questions relevant to that breed
- Clear CTA linking back to the main upload flow on the homepage

### How the sitemap works

The existing `sitemap.ts` file is updated to automatically include all breed pages. Every time a new breed is added to the JSON data file and the repo is deployed, the sitemap updates itself. No manual sitemap editing.

---

## Part 2 — AI portrait generation per breed

### The problem

Each breed page needs a representative Renaissance portrait image. This image serves two purposes: it demonstrates the product visually on the SEO page, and it becomes the image used in Pinterest pins.

### The solution

The generation script calls the Replicate API (FLUX model) with a breed-specific prompt in English, producing a 1024×1024 Renaissance oil painting style portrait. The resulting image URL is stored in the breed's JSON entry and referenced by both the Next.js page and the Pinterest posting script.

### Cost and speed

At roughly €0.003–0.01 per image, generating portraits for 50 breeds costs under €0.50. The script generates each portrait once and skips breeds that already have an image on subsequent runs, so costs don't accumulate.

---

## Part 3 — Pinterest automation

### Why Pinterest over Instagram or TikTok

Pinterest is the right channel for RoyalPet because:
- It is search-driven, not algorithm-driven — Dutch users actively search for gift ideas and home decor
- Pins have a 2-year lifespan, meaning content compounds over time
- The Dutch pet portrait niche is essentially untouched in Dutch language
- It connects directly to the SEO pages, creating a loop where Pinterest drives traffic to pages that rank on Google

### What gets pinned

For each breed page, the script creates three pin types:
1. **Portrait reveal pin** — the generated Renaissance portrait, linking to the breed page
2. **Gift angle pin** — same image, different Dutch title focused on gift-giving occasion
3. **Board assignment** — pins go to the correct board (breed board, gift board, or seasonal board)

### Board structure

Boards are set up once manually in the Pinterest app, then the script assigns pins to the correct board automatically based on the breed and occasion tags in the JSON data.

### Posting cadence

The script posts 15–20 pins per day via the Pinterest API. This is the optimal range — enough to build momentum without triggering quality flags. At this rate, 50 breeds × 3 pins each = 150 pins, queued over about 8 days.

---

## Part 4 — Branch and deployment workflow

### Protecting the live site

All development work happens on a feature branch, never directly on `main`. The branch naming convention is:
- `feature/seo-breed-pages` for the page template and data
- `automation/generate-content` for the generation script

Vercel automatically creates a preview URL for every branch push. This means you can review all 50 breed pages live at a preview URL before anything touches royalpet.app.

### The merge process

1. Run the generation script locally on the feature branch
2. Push to GitHub — Vercel preview URL is created automatically
3. Review the preview URL — check a few breed pages, check sitemap
4. Open a Pull Request on GitHub
5. Merge — royalpet.app updates within 2–3 minutes

### Ongoing automation

A GitHub Actions workflow runs the generation script on a schedule (e.g. weekly). It commits any new breed data to a branch and opens a pull request automatically. You receive a GitHub notification, check the Vercel preview, and merge with one click.

---

## File structure being added to the repo

```
data/
  breeds.json                          ← generated content store (all breed data)

src/app/
  rassen/
    [ras]/
      page.tsx                         ← dynamic breed page template
  sitemap.ts                           ← updated to include breed pages

scripts/
  generate-pages.js                    ← generates breeds.json (content + portraits)
  post-to-pinterest.js                 ← reads breeds.json, posts to Pinterest API

next.config.js                         ← updated to allow Replicate image domains

.github/
  workflows/
    generate-pages.yml                 ← GitHub Actions cron job
```

---

## Environment variables needed

The following need to be added to both `.env.local` (for local runs) and the Vercel dashboard (for production builds):

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Generate Dutch page content via Claude |
| `REPLICATE_API_TOKEN` | Generate Renaissance portrait images |
| `PINTEREST_ACCESS_TOKEN` | Post pins via Pinterest API |

The existing Supabase and Stripe variables remain unchanged.

---

## Execution order — what to do first

1. Set up the feature branch
2. Create `data/breeds.json` with 3–5 breeds manually as a starting point
3. Create `src/app/rassen/[ras]/page.tsx` — the page template
4. Update `sitemap.ts` and `next.config.js`
5. Push, check Vercel preview, confirm pages render correctly
6. Run `scripts/generate-pages.js` to fill in all 50 breeds with AI content and portraits
7. Push updated `breeds.json`, review preview, merge to main
8. Set up Pinterest boards manually (one-time, 30 minutes)
9. Run `scripts/post-to-pinterest.js` to queue the first batch of pins
10. Set up GitHub Actions for ongoing automation

---

## What success looks like at 90 days

- 50+ breed pages indexed by Google NL
- 500+ pins live on Pinterest
- Organic traffic from Dutch long-tail breed keywords
- Pinterest referral traffic to royalpet.app
- Zero ongoing manual content work
