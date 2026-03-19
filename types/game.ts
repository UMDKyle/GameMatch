export interface Game {
  id: string;
  name: string;
  description: string;
  /** Placeholder image path or URL. Real images can be swapped in later. */
  image: string;
  tags: string[];
  genres?: string[];
}

/**
 * Output shape produced by the recommendation engine.
 * Produced by scoreGames() / recommendGames() in lib/scoreGames.ts.
 */
export interface RecommendationResult {
  game: Game;
  /** Raw relevance score. Higher = better match. */
  score: number;
  /** Tags from the user query that this game's tag list actually contains. */
  matchedTags: string[];
  /** Human-readable explanation generated from matchedTags. */
  whyItMatches: string;
}

/**
 * Maps a normalized tag name to an array of synonyms / related keywords.
 * Used by the matching algorithm to parse free-form user prompts.
 */
export type TagDictionary = Record<string, string[]>;
