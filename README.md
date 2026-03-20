# GameMatch

A full-stack game recommendation demo app built with Next.js 14. Type a natural-language description of the game you want — GameMatch extracts intent from your words, scores a curated catalog, and returns ranked recommendations with explanations.

---

## Screenshot

> _Add a screenshot here once deployed. Suggested tool: [Vercel](https://vercel.com) → share the preview URL → screenshot with a tool like [Screely](https://screely.com)._

---

## Motivation

I built GameMatch as a product-style full-stack demo to practice:

- designing a clean full-stack API flow (client → Next.js route → utilities → response)
- building deterministic NLP without relying on external AI APIs
- keeping a codebase modular enough to swap in smarter components (e.g. OpenAI) later
- shipping a polished, demo-ready UI that's easy to explain in an interview

The recommendation engine is intentionally simple and transparent. The scoring formula is readable in a few lines of code, which makes it easy to reason about and extend.

---

## Features

- **Natural-language search** — describe a game in plain English; no dropdowns or filters required
- **Live tag preview** — detected keywords appear instantly as you type, before hitting submit
- **Server-side recommendation scoring** — query is sent to a Next.js API route for processing
- **Tag-overlap scoring** — each game is scored by how many of its tags match the detected intent
- **Match explanations** — every result card explains why the game was recommended
- **Matched tags highlighted** — on each card, the tags that drove the match are visually distinct
- **5 example prompts** — one-click starting points to demo the full flow
- **Clean empty and error states** — idle, no-tags, no-results, loading, and error are all handled

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Fonts | Geist (local, via `next/font`) |
| API | Next.js Route Handler (`app/api/recommend/route.ts`) |
| Data | Local TypeScript files (no database) |
| Deployment | Vercel-ready (zero config) |

---

## How It Works

```
User types a prompt
       │
       ▼
extractTagNames(query)          ← runs client-side on every keystroke
       │                           shows detected tags instantly (no API call)
       │
  [user clicks Recommend]
       │
       ▼
POST /api/recommend  { query }
       │
       ├─ extractTags(query)    ← normalizes input, matches synonyms from tagDictionary
       │                           returns: { tags: string[], matchedKeywords: {...} }
       │
       ├─ scoreGames(tags)      ← for each game in the 30-game catalog:
       │                           score = (matching tags × 3) + (2 bonus if ≥ 3 match)
       │                           excludes zero-score games, sorts descending, caps at 5
       │
       └─ returns JSON:
          { query, detectedTags, recommendations: RecommendationResult[] }
                │
                ▼
       Frontend renders cards
       Matched tags float to top of each card
       "Why it matches" explanation generated from matched tag names
```

### Tag extraction

`lib/extractTags.ts` uses a local synonym dictionary (`data/tagDictionary.ts`) to map user words to normalized tag keys. Both the input and each synonym are lowercased, hyphen-normalized, and padded with spaces before a simple `String.includes()` check — giving whole-word matching without regex. Handles multi-word phrases like `"open world"`, `"co op"`, `"single player"` naturally.

When `ENABLE_OPENAI_TAGS=true` is set, `lib/extractTagsWithOpenAI.ts` is tried first on the server. It sends the query (capped at 100 chars) to `gpt-4o-mini` with a strict JSON schema, asking for at most 5 tags from the controlled vocabulary. The model cannot invent new tags — its output is allowlist-filtered before use. If OpenAI is disabled, times out (4 s), or returns nothing useful, the route silently falls back to the local extractor. Scoring is always deterministic regardless of which extractor ran.

### Scoring formula

```
score = (number of overlapping tags × 3)
      + (2 bonus if ≥ 3 tags match)
```

Simple, deterministic, and easy to replace with a vector-similarity or AI-based scorer later.

---

## Project Structure

```
gamematch/
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts        # POST /api/recommend — validates, extracts, scores
│   ├── components/
│   │   ├── DetectedTags.tsx    # Live tag chip preview (client-side)
│   │   ├── ExamplePrompts.tsx  # Clickable example query chips
│   │   ├── RecommendationCard.tsx  # Single result card with matched tag highlights
│   │   ├── ResultsSummary.tsx  # "Showing N matches · Based on: ..." header
│   │   └── SearchBox.tsx       # Textarea + submit button
│   ├── types/
│   │   └── index.ts            # Re-exports core types + RecommendApiResponse shape
│   ├── globals.css
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Homepage — state machine + UI composition
├── data/
│   ├── games.ts                # 30-game catalog with tags and genres
│   └── tagDictionary.ts        # Tag → synonyms map (26 tags, ~250 keywords)
├── lib/
│   ├── extractTags.ts          # Tag extraction from natural-language input
│   └── scoreGames.ts           # Scoring, ranking, and explanation generation
└── types/
    └── game.ts                 # Core domain types: Game, RecommendationResult, TagDictionary
```

---

## Local Setup

**Prerequisites:** Node.js 18+, npm

```bash
# 1. Clone the repo
git clone https://github.com/your-username/gamematch.git
cd gamematch

# 2. Install dependencies
npm install

# 3. (Optional) Copy the environment file
#    No environment variables are required to run the app locally.
#    The .env.example file documents variables used in future steps.
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

No database is required. No API keys are required to run the app — AI tag extraction is disabled by default and the app works fully without it.

To enable AI-assisted extraction locally, add these to `.env.local`:
```
ENABLE_OPENAI_TAGS=true
OPENAI_API_KEY=sk-...
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start local development server at `localhost:3000` |
| `npm run build` | Build for production |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint |

---

## Deploying to Vercel

This project is zero-config on Vercel:

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Click **Deploy** — no build settings needed

Once an `OPENAI_API_KEY` is added (future step), add it as an environment variable in the Vercel dashboard.

---

## Future Improvements

| Idea | Details |
|---|---|
| **OpenAI-assisted extraction** | ✅ Implemented — set `ENABLE_OPENAI_TAGS=true` to activate structured tag extraction via `gpt-4o-mini` with deterministic fallback |
| **Better ranking** | Add weighted tags (genre > mood > setting), or use cosine similarity on tag vectors |
| **External game metadata** | Pull real game data from IGDB, RAWG, or a CMS instead of the local catalog |
| **User preferences** | Save liked games to localStorage or a DB; use history to personalize scoring |
| **Filtering and sorting** | Let users narrow results by platform, release year, or genre after getting recommendations |
| **Expand the catalog** | Current catalog is 30 games; a larger dataset makes the tag coverage much more useful |

---

## API Reference

### `POST /api/recommend`

**Request body**

```json
{ "query": "I want a difficult samurai game" }
```

**Response**

```json
{
  "query": "I want a difficult samurai game",
  "detectedTags": ["samurai", "difficult"],
  "recommendations": [
    {
      "game": {
        "id": "sekiro",
        "name": "Sekiro: Shadows Die Twice",
        "description": "...",
        "image": "...",
        "tags": ["samurai", "difficult", "action", "single-player", "souls-like", "japanese", "stealth"],
        "genres": ["Action"]
      },
      "score": 6,
      "matchedTags": ["samurai", "difficult"],
      "whyItMatches": "Matches your interest in samurai and difficult."
    }
  ]
}
```

**Error responses**

| Status | Condition |
|---|---|
| `400` | Missing or non-string `query` field, or empty string |
| `500` | Unexpected server error |

---

## License

MIT
