import { tagDictionary } from "@/data/tagDictionary";

/**
 * The complete set of tag keys the recommendation engine understands.
 * Single source of truth — derived directly from tagDictionary so it
 * never drifts out of sync.
 *
 * Used by the OpenAI extractor as an allowlist so the model cannot
 * invent tags that don't exist in the scoring catalog.
 */
export const allowedTags: string[] = Object.keys(tagDictionary);
