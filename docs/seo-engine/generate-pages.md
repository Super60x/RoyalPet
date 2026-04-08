# File: scripts/generate-pages.js

Create a `scripts/` folder in your repo root and save this file there.

Run with: `npx tsx scripts/generate-pages.js`

First install tsx if you don't have it: `npm install -D tsx`

Add these to your `.env.local` before running:
- `ANTHROPIC_API_KEY=sk-ant-...`
- `REPLICATE_API_TOKEN=r8_...`

---

```js
import Anthropic from '@anthropic-ai/sdk'
import Replicate from 'replicate'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.join(__dirname, '../data/breeds.json')

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

// Full breed list — NL/BE market
// Add English names for Replicate image generation prompts
const ALL_BREEDS = [
  { naam: 'Gouden Retriever',  slug: 'gouden-retriever',  nameEn: 'Golden Retriever' },
  { naam: 'Labrador',          slug: 'labrador',           nameEn: 'Labrador Retriever' },
  { naam: 'Franse Bulldog',    slug: 'franse-bulldog',     nameEn: 'French Bulldog' },
  { naam: 'Beagle',            slug: 'beagle',             nameEn: 'Beagle' },
  { naam: 'Teckel',            slug: 'teckel',             nameEn: 'Dachshund' },
  { naam: 'Chihuahua',         slug: 'chihuahua',          nameEn: 'Chihuahua' },
  { naam: 'Pug',               slug: 'pug',                nameEn: 'Pug' },
  { naam: 'Shih Tzu',          slug: 'shih-tzu',           nameEn: 'Shih Tzu' },
  { naam: 'Border Collie',     slug: 'border-collie',      nameEn: 'Border Collie' },
  { naam: 'Maltezer',          slug: 'maltezer',           nameEn: 'Maltese' },
  { naam: 'Poedel',            slug: 'poedel',             nameEn: 'Poodle' },
  { naam: 'Rottweiler',        slug: 'rottweiler',         nameEn: 'Rottweiler' },
  { naam: 'Husky',             slug: 'husky',              nameEn: 'Siberian Husky' },
  { naam: 'Dalmatier',         slug: 'dalmatier',          nameEn: 'Dalmatian' },
  { naam: 'Spaniël',           slug: 'spaniel',            nameEn: 'Cocker Spaniel' },
  { naam: 'Bulldog',           slug: 'bulldog',            nameEn: 'English Bulldog' },
  { naam: 'Boxer',             slug: 'boxer',              nameEn: 'Boxer' },
  { naam: 'Dobermann',         slug: 'dobermann',          nameEn: 'Dobermann' },
  { naam: 'Weimaraner',        slug: 'weimaraner',         nameEn: 'Weimaraner' },
  { naam: 'Berner Sennenhond', slug: 'berner-sennenhond',  nameEn: 'Bernese Mountain Dog' },
  { naam: 'Samoyed',           slug: 'samoyed',            nameEn: 'Samoyed' },
  { naam: 'Akita',             slug: 'akita',              nameEn: 'Akita' },
  { naam: 'Chow Chow',         slug: 'chow-chow',          nameEn: 'Chow Chow' },
  { naam: 'Australische Herder', slug: 'australische-herder', nameEn: 'Australian Shepherd' },
  { naam: 'Dwergschnauzer',    slug: 'dwergschnauzer',     nameEn: 'Miniature Schnauzer' },
  // Cats
  { naam: 'Kat',               slug: 'kat-portret',        nameEn: 'domestic cat' },
  { naam: 'Perzische Kat',     slug: 'perzische-kat',      nameEn: 'Persian cat' },
  { naam: 'Maine Coon',        slug: 'maine-coon',         nameEn: 'Maine Coon cat' },
  { naam: 'Britse Korthaar',   slug: 'britse-korthaar',    nameEn: 'British Shorthair cat' },
  { naam: 'Siamese Kat',       slug: 'siamese-kat',        nameEn: 'Siamese cat' },
]

// Generate a Renaissance portrait using Replicate FLUX model
async function generatePortrait(breed) {
  console.log(`  🎨 Generating portrait for ${breed.naam}...`)
  try {
    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: `Renaissance oil painting portrait of a ${breed.nameEn}, 16th century Flemish master style, dramatic chiaroscuro lighting, rich jewel tones, velvet background, gold decorative details, highly detailed brushwork, museum quality fine art, dark background, no text, no watermark`,
          width: 1024,
          height: 1024,
          num_inference_steps: 4,
          output_format: 'webp',
        },
      }
    )
    const url = Array.isArray(output) ? output[0] : String(output)
    console.log(`  ✓ Portrait URL: ${url}`)
    return url
  } catch (err) {
    console.error(`  ✗ Portrait failed for ${breed.naam}:`, err.message)
    return ''
  }
}

// Generate Dutch SEO content using Claude
async function generateContent(breed, portraitUrl) {
  console.log(`  ✍️  Generating Dutch content for ${breed.naam}...`)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `Je bent een SEO-copywriter voor RoyalPet.app — een Nederlandse dienst die huisdierfoto's omzet naar AI-gegenereerde Renaissance-portretten in Vlaamse meesterstijl.

Genereer SEO-content voor een pagina over ras: ${breed.naam}
Doelmarkt: Nederland en België (Vlaanderen)
Taal: Nederlands, warm en persoonlijk maar stijlvol

Geef ALLEEN geldig JSON terug. Geen uitleg, geen markdown-blokken, geen tekst voor of na de JSON.

{
  "slug": "${breed.slug}",
  "naam": "${breed.naam}",
  "nameEn": "${breed.nameEn}",
  "portraitUrl": "${portraitUrl}",
  "title": "(max 60 tekens, bevat ras naam + portret schilderij + RoyalPet)",
  "metaDescription": "(max 155 tekens, bevat prijs €24,99, CTA, ras naam)",
  "h1": "(natuurlijke Nederlandse zin, bevat ras naam en Renaissance portret)",
  "intro": "(180 woorden over het ras karakter + waarom perfect als Renaissance portret, warm en persoonlijk)",
  "altText": "(beschrijvende alt-tekst, keyword-rijk, max 125 tekens)",
  "pinterestTitle": "(max 100 tekens, Dutch, keyword-rijk, bevat ras naam)",
  "pinterestDescription": "(max 500 tekens, Dutch, bevat royalpet.app, bevat prijs €24,99)",
  "faq": [
    {"vraag": "vraag specifiek over dit ras en portretten", "antwoord": "antwoord 2-3 zinnen"},
    {"vraag": "vraag over kwaliteit of het proces", "antwoord": "antwoord 2-3 zinnen"},
    {"vraag": "vraag over prijs, bestellen of bezorging", "antwoord": "antwoord 2-3 zinnen"}
  ]
}`,
      },
    ],
  })

  const raw = response.content[0].text.trim()
  try {
    return JSON.parse(raw)
  } catch {
    // Strip markdown code fences if Claude added them
    const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(cleaned)
  }
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  // Load existing data — script is crash-safe and skips already-generated breeds
  let existing = []
  if (fs.existsSync(dataPath)) {
    existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  }
  const existingSlugs = new Set(existing.map((b) => b.slug))

  const results = [...existing]

  console.log(`\n🚀 Starting breed page generation`)
  console.log(`   Already done: ${existing.length} breeds`)
  console.log(`   To generate: ${ALL_BREEDS.filter(b => !existingSlugs.has(b.slug)).length} breeds\n`)

  for (const breed of ALL_BREEDS) {
    if (existingSlugs.has(breed.slug)) {
      console.log(`⏭  Skipping ${breed.naam} — already exists`)
      continue
    }

    console.log(`\n📋 Processing: ${breed.naam}`)

    // 1. Generate portrait image
    const portraitUrl = await generatePortrait(breed)

    // 2. Generate Dutch content with portrait URL embedded
    const content = await generateContent(breed, portraitUrl)
    results.push(content)

    // 3. Save after every single breed — if script crashes you lose nothing
    fs.mkdirSync(path.dirname(dataPath), { recursive: true })
    fs.writeFileSync(dataPath, JSON.stringify(results, null, 2))
    console.log(`  💾 Saved — total: ${results.length} breeds`)

    // Polite pause between API calls
    await sleep(1500)
  }

  console.log(`\n✅ Done! ${results.length} breed pages saved to data/breeds.json`)
  console.log(`   Next step: git add data/ && git commit -m "feat: add breed pages"`)
}

main().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})
```
