# File: scripts/post-to-pinterest.js

Save this file at `scripts/post-to-pinterest.js` in your repo root.

Run with: `npx tsx scripts/post-to-pinterest.js`

Before running, add to your `.env.local`:
- `PINTEREST_ACCESS_TOKEN=...` (get from Pinterest Developer App)

---

## How to get a Pinterest Access Token

1. Go to https://developers.pinterest.com
2. Create an app (free)
3. Request the `boards:read`, `boards:write`, `pins:read`, `pins:write` scopes
4. Use the OAuth flow to get your access token
5. Paste it in `.env.local`

---

## Pinterest Board Setup (do this once manually)

Create these boards in your Pinterest account before running the script:

| Board name | Slug to use in script |
|---|---|
| Honden Portretten — Renaissance Kunst | `honden-portretten` |
| Gouden Retriever Kunst & Portretten | `gouden-retriever` |
| Franse Bulldog Portretten | `franse-bulldog` |
| Cadeau Ideeën voor Huisdierliefhebbers | `cadeau-huisdier` |
| Kat Portret Schilderij | `kat-portret` |
| Huisdier Kunst & Decoratie | `huisdier-kunst` |

After creating boards, update the `BOARD_IDS` object in the script below with the real IDs.
Get board IDs by running: `npx tsx scripts/post-to-pinterest.js --list-boards`

---

```js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataPath = path.join(__dirname, '../data/breeds.json')
const postedPath = path.join(__dirname, '../data/pinterest-posted.json')

const ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN
const BASE_URL = 'https://api.pinterest.com/v5'

// Replace with your real board IDs after running --list-boards
// Board IDs look like: "1234567890123456789"
const BOARD_IDS = {
  'honden-portretten': 'REPLACE_WITH_REAL_BOARD_ID',
  'gouden-retriever':  'REPLACE_WITH_REAL_BOARD_ID',
  'franse-bulldog':    'REPLACE_WITH_REAL_BOARD_ID',
  'labrador':          'REPLACE_WITH_REAL_BOARD_ID',
  'cadeau-huisdier':   'REPLACE_WITH_REAL_BOARD_ID',
  'kat-portret':       'REPLACE_WITH_REAL_BOARD_ID',
  'huisdier-kunst':    'REPLACE_WITH_REAL_BOARD_ID',
}

// Determine which boards a breed should be pinned to
function getBoardsForBreed(breed) {
  const boards = ['honden-portretten', 'huisdier-kunst']

  // Specific breed board if it exists
  if (BOARD_IDS[breed.slug]) {
    boards.push(breed.slug)
  }

  // Cat breeds go to cat board instead of dog board
  if (breed.slug.includes('kat') || breed.nameEn.includes('cat')) {
    return ['kat-portret', 'huisdier-kunst']
  }

  return [...new Set(boards)] // deduplicate
}

// List all boards (run with --list-boards to get IDs)
async function listBoards() {
  const res = await fetch(`${BASE_URL}/boards?page_size=25`, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  })
  const data = await res.json()
  console.log('\nYour Pinterest boards:')
  data.items?.forEach(board => {
    console.log(`  "${board.name}" → ID: ${board.id}`)
  })
}

// Create a single pin
async function createPin(boardId, breed, pinType = 'portrait') {
  const isGift = pinType === 'gift'

  const title = isGift
    ? `Origineel cadeau voor ${breed.naam} liefhebbers | RoyalPet`
    : breed.pinterestTitle

  const description = isGift
    ? `Op zoek naar een origineel cadeau voor een ${breed.naam} liefhebber? Een Renaissance portret van hun hond is uniek, persoonlijk en blijft voor altijd. Digitaal vanaf €24,99 of op canvas. royalpet.app`
    : breed.pinterestDescription

  const body = {
    board_id: boardId,
    title: title.slice(0, 100),
    description: description.slice(0, 500),
    link: `https://royalpet.app/rassen/${breed.slug}`,
    media_source: {
      source_type: 'image_url',
      url: breed.portraitUrl,
    },
  }

  const res = await fetch(`${BASE_URL}/pins`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (data.id) {
    console.log(`    ✓ Pin created: ${data.id}`)
    return data.id
  } else {
    console.error(`    ✗ Pin failed:`, JSON.stringify(data))
    return null
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  // Handle --list-boards flag
  if (process.argv.includes('--list-boards')) {
    await listBoards()
    return
  }

  if (!ACCESS_TOKEN) {
    console.error('❌ Missing PINTEREST_ACCESS_TOKEN in .env.local')
    process.exit(1)
  }

  // Load breeds
  const breeds = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

  // Load already-posted pins to avoid duplicates
  let posted = {}
  if (fs.existsSync(postedPath)) {
    posted = JSON.parse(fs.readFileSync(postedPath, 'utf8'))
  }

  console.log(`\n📌 Starting Pinterest posting`)
  console.log(`   Breeds to process: ${breeds.length}`)
  console.log(`   Already posted: ${Object.keys(posted).length} breeds\n`)

  let pinsCreated = 0

  for (const breed of breeds) {
    // Skip breeds without a portrait image
    if (!breed.portraitUrl) {
      console.log(`⏭  Skipping ${breed.naam} — no portrait image yet`)
      continue
    }

    // Skip already posted breeds
    if (posted[breed.slug]) {
      console.log(`⏭  Skipping ${breed.naam} — already posted`)
      continue
    }

    console.log(`\n📌 Posting: ${breed.naam}`)
    const boards = getBoardsForBreed(breed)
    const pinIds = []

    for (const boardKey of boards) {
      const boardId = BOARD_IDS[boardKey]
      if (!boardId || boardId === 'REPLACE_WITH_REAL_BOARD_ID') {
        console.log(`    ⚠️  Board "${boardKey}" has no ID set — skipping`)
        continue
      }

      // Pin 1: Standard portrait pin
      console.log(`    Pinning to board: ${boardKey}`)
      const pinId = await createPin(boardId, breed, 'portrait')
      if (pinId) pinIds.push(pinId)

      // Rate limit: Pinterest allows ~1 pin/second
      await sleep(2000)
    }

    // Also pin a gift-focused version to the cadeau board
    const cadeauBoardId = BOARD_IDS['cadeau-huisdier']
    if (cadeauBoardId && cadeauBoardId !== 'REPLACE_WITH_REAL_BOARD_ID') {
      console.log(`    Pinning gift version to cadeau board`)
      const giftPinId = await createPin(cadeauBoardId, breed, 'gift')
      if (giftPinId) pinIds.push(giftPinId)
      await sleep(2000)
    }

    // Save progress
    posted[breed.slug] = { pinIds, postedAt: new Date().toISOString() }
    fs.writeFileSync(postedPath, JSON.stringify(posted, null, 2))

    pinsCreated += pinIds.length
    console.log(`  💾 Saved — ${pinIds.length} pins created for ${breed.naam}`)

    // Pause between breeds
    await sleep(3000)
  }

  console.log(`\n✅ Done! ${pinsCreated} pins created across Pinterest boards`)
}

main().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})
```
