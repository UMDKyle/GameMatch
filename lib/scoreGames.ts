import games from "@/data/games";
import { extractTags } from "@/lib/extractTags";
import { Game, RecommendationResult } from "@/types/game";

// ─── Scoring constants ────────────────────────────────────────────────────────

const POINTS_PER_MATCHED_TAG = 3;
/** Bonus awarded when a game matches 3 or more of the user's tags. */
const MULTI_TAG_BONUS = 2;
const MULTI_TAG_THRESHOLD = 3;

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Convert a hyphen-separated tag key into a readable label for prose.
 * "co-op" → "co-op"   "open-world" → "open world"   "story-rich" → "story-rich"
 * We keep well-known compound terms (co-op, souls-like, story-rich, fast-paced)
 * intact and convert the rest to space-separated form.
 */
const KEEP_HYPHEN = new Set([
  "co-op",
  "souls-like",
  "story-rich",
  "fast-paced",
  "dark-fantasy",
  "open-world",
  "single-player",
]);

function humanizeTag(tag: string): string {
  return KEEP_HYPHEN.has(tag) ? tag : tag.replace(/-/g, " ");
}

/**
 * Build a natural-language explanation from the list of matched tags.
 *
 * Examples:
 *   ["samurai"]                        → "Matches your interest in samurai gameplay."
 *   ["horror", "co-op"]                → "Recommended because it fits horror and co-op."
 *   ["difficult", "samurai", "stealth"]→ "Matches your interest in difficult, samurai, and stealth."
 */
function buildWhyItMatches(matchedTags: string[]): string {
  const labels = matchedTags.map(humanizeTag);

  if (labels.length === 0) {
    return "A strong pick based on your description.";
  }
  if (labels.length === 1) {
    return `Matches your interest in ${labels[0]} gameplay.`;
  }
  if (labels.length === 2) {
    return `Recommended because it fits ${labels[0]} and ${labels[1]}.`;
  }

  const last = labels[labels.length - 1];
  const rest = labels.slice(0, -1).join(", ");
  return `Matches your interest in ${rest}, and ${last}.`;
}

// ─── Core scoring ─────────────────────────────────────────────────────────────

/**
 * Score a single game against a set of extracted query tags.
 * Returns null if the game has zero overlap with the query tags.
 *
 * Scoring formula:
 *   score = (number of overlapping tags × POINTS_PER_MATCHED_TAG)
 *           + MULTI_TAG_BONUS  (if overlapping tags ≥ MULTI_TAG_THRESHOLD)
 */
function scoreGame(
  game: Game,
  queryTags: string[]
): RecommendationResult | null {
  const matchedTags = game.tags.filter((t) => queryTags.includes(t));

  if (matchedTags.length === 0) return null;

  const score =
    matchedTags.length * POINTS_PER_MATCHED_TAG +
    (matchedTags.length >= MULTI_TAG_THRESHOLD ? MULTI_TAG_BONUS : 0);

  return {
    game,
    score,
    matchedTags,
    whyItMatches: buildWhyItMatches(matchedTags),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Score all games in the catalog against a pre-extracted tag list.
 * Returns results sorted by score descending, capped at `maxResults`.
 *
 * Use this when you already have the extracted tags (e.g. in the UI where
 * tags are computed separately for the DetectedTags widget).
 */
export function scoreGames(
  queryTags: string[],
  maxResults = 5
): RecommendationResult[] {
  if (queryTags.length === 0) return [];

  return games
    .map((game) => scoreGame(game, queryTags))
    .filter((r): r is RecommendationResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * End-to-end convenience: extract tags from a raw query string, then score.
 * Called by POST /api/recommend when you want a single function entry point.
 */
export function recommendGames(
  query: string,
  maxResults = 5
): RecommendationResult[] {
  const { tags } = extractTags(query);
  return scoreGames(tags, maxResults);
}

/*
 * ─── Manual test cases ────────────────────────────────────────────────────────
 *
 * recommendGames("I want a difficult samurai game")
 *   top results should include: Sekiro, Nioh 2, Ghost of Tsushima
 *   sekiro tags:  samurai ✓  difficult ✓  → score 6
 *   nioh-2 tags:  samurai ✓  difficult ✓  souls-like  → score 6
 *   ghost-of-tsushima: samurai ✓  → score 3
 *
 * recommendGames("I want a relaxing farming game")
 *   top results should include: Stardew Valley, Coral Island, Garden Story
 *
 * recommendGames("I want a co-op horror game")
 *   top results should include: Phasmophobia (horror ✓  co-op ✓ → score 6 + bonus)
 *                                The Forest    (horror ✓  co-op ✓ → score 6)
 *
 * recommendGames("open world rpg with a great story")
 *   top results: Witcher 3 (open-world ✓ rpg ✓ story-rich ✓ → score 9 + bonus)
 *
 * scoreGames([])  → []
 */
