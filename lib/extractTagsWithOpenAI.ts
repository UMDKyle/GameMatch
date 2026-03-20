/**
 * extractTagsWithOpenAI.ts
 *
 * Server-side ONLY utility. Never import this from client components.
 *
 * Attempts to extract game recommendation tags from a user query using
 * OpenAI's structured output mode. Falls back gracefully to the local
 * extractor on any failure.
 *
 * ── Cost controls (read before changing anything) ─────────────────────────
 *  1. Disabled by default — only runs when ENABLE_OPENAI_TAGS=true.
 *  2. Input is hard-capped at MAX_QUERY_CHARS before being sent.
 *  3. Uses gpt-4o-mini — the cheapest model that supports structured outputs.
 *  4. max_tokens=80 — a JSON tags array never needs more than ~60 tokens.
 *  5. Strict JSON schema — model returns only the tags array, no prose.
 *  6. Asks for at most MAX_TAGS tags.
 *  7. Hard timeout of TIMEOUT_MS — if OpenAI is slow, we fall back immediately.
 *  8. Output is allowlist-filtered — any tag the model invents is dropped.
 *  9. Caller receives null on any failure, triggering local fallback.
 * ──────────────────────────────────────────────────────────────────────────
 */

import OpenAI from "openai";

// ── Cost-control constants ────────────────────────────────────────────────────

/** Max characters sent to OpenAI. Inputs beyond this are silently truncated. */
const MAX_QUERY_CHARS = 100;

/** Max tags to request — keeps the model focused and output tiny. */
const MAX_TAGS = 5;

/** Request timeout in ms. Abort and fall back if OpenAI takes too long. */
const TIMEOUT_MS = 8_000;

/** Model used for extraction. gpt-4o-mini is cheapest with structured output support. */
const MODEL = "gpt-4o-mini" as const;

// ── Feature flag ──────────────────────────────────────────────────────────────
// Both env vars must be present and correctly set for AI to activate.
// This check runs at module load time so there's no per-request overhead.
const AI_ENABLED =
  process.env.ENABLE_OPENAI_TAGS === "true" &&
  typeof process.env.OPENAI_API_KEY === "string" &&
  process.env.OPENAI_API_KEY.length > 0;

// ── Lazy singleton client ─────────────────────────────────────────────────────
// Instantiated only when actually needed, avoiding import side-effects on the
// client bundle (though this file should never reach the client).
let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

// ── Strict JSON schema for structured output ──────────────────────────────────
// "strict: true" forces the model to follow the schema exactly.
// The schema is intentionally minimal — just an array of strings.
const RESPONSE_SCHEMA: OpenAI.ResponseFormatJSONSchema = {
  type: "json_schema",
  json_schema: {
    name: "tag_extraction",
    strict: true,
    schema: {
      type: "object",
      properties: {
        tags: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["tags"],
      additionalProperties: false,
    },
  },
};

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Tries to extract tags from `query` using OpenAI structured outputs.
 *
 * Returns:
 *  - string[]  — valid tags from the allowedTags list (may be empty array)
 *  - null      — AI is disabled, timed out, or returned unusable data;
 *                caller should fall back to the local extractor
 *
 * @param query       Raw user query (will be trimmed and capped internally).
 * @param allowedTags Complete tag vocabulary; model output is filtered to this set.
 */
export async function extractTagsWithOpenAI(
  query: string,
  allowedTags: string[]
): Promise<string[] | null> {
  if (!AI_ENABLED) return null;

  // ── Input guard ───────────────────────────────────────────────────────────
  const safeQuery = query.trim().slice(0, MAX_QUERY_CHARS);
  if (!safeQuery) return null;

  // ── Abort controller for timeout ──────────────────────────────────────────
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await getClient().chat.completions.create(
      {
        model: MODEL,
        // 80 tokens is more than enough for a short tags JSON array
        max_tokens: 80,
        response_format: RESPONSE_SCHEMA,
        messages: [
          {
            role: "system",
            content: [
              "You are a tag extractor for a game recommendation engine.",
              `Select up to ${MAX_TAGS} tags from this allowed list that best describe what the user is looking for.`,
              `Allowed tags: ${allowedTags.join(", ")}.`,
              "Rules:",
              "- Only choose tags from the allowed list above.",
              "- Prefer the most specific matching tags.",
              "- Return no prose — only valid JSON.",
              "- If nothing matches, return an empty list.",
            ].join(" "),
          },
          { role: "user", content: safeQuery },
        ],
      },
      // Pass the abort signal as a request option (openai SDK v4+)
      { signal: controller.signal }
    );

    clearTimeout(timer);

    // ── Parse and validate output ─────────────────────────────────────────
    const raw = response.choices[0]?.message?.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn("[extractTagsWithOpenAI] Could not parse JSON response — using fallback.");
      return null;
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !Array.isArray((parsed as Record<string, unknown>).tags)
    ) {
      console.warn("[extractTagsWithOpenAI] Unexpected response shape — using fallback.");
      return null;
    }

    // ── Allowlist filter — drop any tag the model invented ────────────────
    const allowedSet = new Set(allowedTags);
    const validTags = ((parsed as { tags: unknown[] }).tags)
      .filter((t): t is string => typeof t === "string" && allowedSet.has(t))
      .slice(0, MAX_TAGS);

    // Return null (not empty array) so caller knows to try local extraction
    return validTags.length > 0 ? validTags : null;

  } catch (err: unknown) {
    clearTimeout(timer);

    // The OpenAI SDK wraps AbortController signals as APIUserAbortError.
    // Check both the native name and the OpenAI SDK class name.
    const isAbort =
      (err instanceof Error && err.name === "AbortError") ||
      (err instanceof Error && err.constructor.name === "APIUserAbortError");

    if (isAbort) {
      console.warn("[extractTagsWithOpenAI] Timed out after 8 s — using fallback.");
    } else {
      console.warn("[extractTagsWithOpenAI] Request failed — using fallback.", (err instanceof Error ? err.message : err));
    }
    return null;
  }
}
