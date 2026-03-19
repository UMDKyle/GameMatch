import tagDictionary from "@/data/tagDictionary";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExtractTagsResult {
  /** Normalized tag keys matched from the dictionary, in dictionary order. */
  tags: string[];
  /**
   * Which synonym triggered each tag match.
   * Useful for debugging and future confidence scoring.
   * e.g. { "co-op": ["friends"], "difficult": ["hard", "brutal"] }
   */
  matchedKeywords: Record<string, string[]>;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Normalize a string for matching:
 * - lowercase
 * - replace hyphens with spaces (so "co-op" ≡ "co op")
 * - collapse multiple whitespace characters into a single space
 * - trim surrounding whitespace
 */
function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pad a normalized string with a leading and trailing space.
 * Lets us match whole words/phrases via simple `includes()` without regex.
 *
 * Examples:
 *   " fast " will NOT match inside " breakfast " ✓
 *   " open world " WILL match inside " i want an open world game " ✓
 *   " co op " WILL match inside " i want a co op game " ✓
 */
function pad(normalized: string): string {
  return ` ${normalized} `;
}

// ─── Main function ────────────────────────────────────────────────────────────

/**
 * Extract normalized tag keys from a free-form user prompt using the
 * local tag dictionary.
 *
 * Strategy:
 * 1. Normalize + pad the input.
 * 2. For every tag in the dictionary, scan all its synonyms against the input.
 * 3. Collect the first synonym match per tag (synonyms are tried in order).
 * 4. Return unique tag keys in the tag dictionary's insertion order.
 *
 * This is intentionally deterministic and dependency-free — no AI/embeddings.
 *
 * @example
 * extractTags("I want a relaxing farming game with friends")
 * // { tags: ["relaxing", "farming", "co-op"], matchedKeywords: { relaxing: ["relaxing"], farming: ["farming"], "co-op": ["friends"] } }
 *
 * extractTags("difficult samurai game")
 * // { tags: ["samurai", "difficult"], matchedKeywords: { samurai: ["samurai"], difficult: ["difficult"] } }
 *
 * extractTags("play with my buddy in a spooky house")
 * // { tags: ["horror", "co-op"], matchedKeywords: { horror: ["spooky"], "co-op": ["buddy"] } }
 *
 * extractTags("")
 * // { tags: [], matchedKeywords: {} }
 */
export function extractTags(input: string): ExtractTagsResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { tags: [], matchedKeywords: {} };
  }

  const paddedInput = pad(normalizeText(trimmed));
  const matchedTags: string[] = [];
  const matchedKeywords: Record<string, string[]> = {};

  for (const [tag, synonyms] of Object.entries(tagDictionary)) {
    const hits: string[] = [];

    for (const synonym of synonyms) {
      const paddedSynonym = pad(normalizeText(synonym));
      if (paddedInput.includes(paddedSynonym)) {
        hits.push(synonym);
      }
    }

    if (hits.length > 0) {
      matchedTags.push(tag);
      matchedKeywords[tag] = hits;
    }
  }

  return { tags: matchedTags, matchedKeywords };
}

// ─── Convenience wrapper ──────────────────────────────────────────────────────

/**
 * Shorthand that returns only the tag keys array.
 * Use this in the UI; use `extractTags` when you need debug detail.
 */
export function extractTagNames(input: string): string[] {
  return extractTags(input).tags;
}

/*
 * ─── Manual test cases ────────────────────────────────────────────────────────
 *
 * Input: "I want a difficult samurai game"
 *   Expected tags: ["samurai", "difficult"]
 *
 * Input: "I want a relaxing farming game"
 *   Expected tags: ["relaxing", "farming"]
 *
 * Input: "I want a co-op horror game"
 *   Expected tags: ["horror", "co-op"]
 *
 * Input: "co op game with friends"
 *   Expected tags: ["co-op"]   ← both "co op" and "friends" match same tag
 *
 * Input: "open world rpg with a great story"
 *   Expected tags: ["open-world", "story-rich", "rpg"]
 *
 * Input: "something fast paced and intense"
 *   Expected tags: ["fast-paced"]   ← "fast paced" and "intense" both hit fast-paced
 *
 * Input: "scary game to play alone"
 *   Expected tags: ["horror", "single-player"]   ← "scary"→horror, "alone"→single-player
 *
 * Input: ""
 *   Expected tags: []
 *
 * Input: "I want a game"
 *   Expected tags: []   ← no dictionary keywords present
 */
