# RoyalPet SEO Engine — Execution Guide

This is the step-by-step guide to go from zero to 50+ live breed pages and Pinterest automation.
Follow in order. Each step builds on the previous one.

---

## Before you start

Make sure you have:
- Your repo cloned locally
- Node 20+ installed (`node --version`)
- API keys ready: Anthropic, Replicate, Pinterest

---

## Step 1 — Create a feature branch (protects your live site)

```bash
cd your-royalpet-folder
git checkout main
git pull
git checkout -b feature/seo-breed-pages
```

You are now on a safe branch. Nothing you do here touches royalpet.app until you merge.

---

## Step 2 — Add the files from the markdown docs

Create these files/folders in your repo:

| Source file (from docs) | Destination in repo |
|---|---|
| `breeds.json.md` → strip the code block | `data/breeds.json` |
| `page-ras.md` → strip the code block | `src/app/rassen/[ras]/page.tsx` |
| `sitemap-and-config.md` → first block | `src/app/sitemap.ts` (replace existing) |
| `sitemap-and-config.md` → second block | `next.config.js` (replace existing) |
| `generate-pages.md` → strip the code block | `scripts/generate-pages.js` |
| `post-to-pinterest.md` → strip the code block | `scripts/post-to-pinterest.js` |
| `github-actions.md` → strip the code block | `.github/workflows/generate-pages.yml` |

To create the `src/app/rassen/[ras]/` folder structure:
```bash
mkdir -p src/app/rassen/\[ras\]
mkdir -p data
mkdir -p scripts
mkdir -p .github/workflows
```

---

## Step 3 — Install tsx

```bash
npm install -D tsx
```

---

## Step 4 — Add environment variables

Create or update `.env.local` in your repo root (this file is already in .gitignore):

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
REPLICATE_API_TOKEN=r8_your-token-here
PINTEREST_ACCESS_TOKEN=your-pinterest-token-here
```

Get your keys:
- Anthropic: https://console.anthropic.com/keys
- Replicate: https://replicate.com/account/api-tokens
- Pinterest: https://developers.pinterest.com (see post-to-pinterest.md for setup)

---

## Step 5 — Test locally first

```bash
npm run dev
```

Visit: http://localhost:3000/rassen/gouden-retriever

You should see a breed page for Golden Retriever (the starter data from breeds.json).
Check that the fonts, colors and layout match the homepage.

---

## Step 6 — Run the generation script

This generates content and portraits for all 30 breeds in the list.
Takes about 5–10 minutes. Cost: ~€1 in API fees total.

```bash
npx tsx scripts/generate-pages.js
```

Watch the output — it saves after every breed so if it crashes you don't lose work.
Run it again after a crash and it skips already-generated breeds.

After it finishes, check `data/breeds.json` — it should have 30 entries.

---

## Step 7 — Test all pages locally

```bash
npm run dev
```

Spot-check a few pages:
- http://localhost:3000/rassen/gouden-retriever
- http://localhost:3000/rassen/franse-bulldog
- http://localhost:3000/rassen/kat-portret
- http://localhost:3000/sitemap.xml (should list all breed pages)

---

## Step 8 — Push and review Vercel preview

```bash
git add .
git commit -m "feat: add programmatic breed pages (50 breeds)"
git push origin feature/seo-breed-pages
```

Vercel will automatically build a preview URL.
Check your Vercel dashboard or the GitHub PR for the preview link.

Review:
- A few breed pages on the preview URL
- The sitemap at [preview-url]/sitemap.xml
- Mobile layout (check on your phone)

---

## Step 9 — Merge to production

When you're happy with the preview:

```bash
# Option A: merge via GitHub UI (recommended)
# Go to github.com/Super60x/RoyalPet → Pull requests → Open PR → Merge

# Option B: merge via terminal
git checkout main
git merge feature/seo-breed-pages
git push origin main
```

Vercel will deploy automatically. Pages are live within 2–3 minutes.

---

## Step 10 — Submit sitemap to Google Search Console

1. Go to https://search.google.com/search-console
2. Select royalpet.app
3. Go to Sitemaps → Add sitemap
4. Enter: `https://royalpet.app/sitemap.xml`
5. Click Submit

Google will start crawling and indexing your breed pages within a few days.

---

## Step 11 — Set up Pinterest boards (one-time, ~30 minutes)

In your Pinterest account, create these boards:

- `Honden Portretten — Renaissance Kunst`
- `Cadeau Ideeën voor Huisdierliefhebbers`
- `Kat Portret Schilderij`
- `Huisdier Kunst & Decoratie`
- `Gouden Retriever Kunst & Portretten`
- `Franse Bulldog Portretten`

Then get the board IDs:

```bash
npx tsx scripts/post-to-pinterest.js --list-boards
```

Copy the IDs into the `BOARD_IDS` object in `scripts/post-to-pinterest.js`.

---

## Step 12 — Run the Pinterest posting script

```bash
npx tsx scripts/post-to-pinterest.js
```

This posts portrait pins and gift pins for every breed that has a portrait image.
It saves progress to `data/pinterest-posted.json` — crash-safe, runs in 2–3 minutes per breed.

---

## Step 13 — Set up GitHub Actions secrets

So the automation can run without you:

1. Go to github.com/Super60x/RoyalPet/settings/secrets/actions
2. Add these secrets:
   - `ANTHROPIC_API_KEY`
   - `REPLICATE_API_TOKEN`

The GitHub Actions workflow will then run every Monday, generate any new breeds,
and open a pull request for you to review before it goes live.

---

## Ongoing maintenance

**Monthly (5 minutes):**
- Check Google Search Console for new keyword impressions
- Merge the weekly automation PR if it looks good

**Quarterly (30 minutes):**
- Add new breeds to `ALL_BREEDS` list in `generate-pages.js`
- Run the script locally
- Push and merge

**That's it.** The engine runs itself after this.
