import { NextRequest, NextResponse } from "next/server";
import { extractTags } from "@/lib/extractTags";
import { scoreGames } from "@/lib/scoreGames";
import { extractTagsWithOpenAI } from "@/lib/extractTagsWithOpenAI";
import { allowedTags } from "@/lib/allowedTags";
import { RecommendApiResponse } from "@/app/types";

export async function POST(req: NextRequest) {
  // ── Parse body ────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  // ── Validate ──────────────────────────────────────────────────────────────
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).query !== "string"
  ) {
    return NextResponse.json(
      { error: 'Missing required field: "query" (string).' },
      { status: 400 }
    );
  }

  const query = ((body as Record<string, unknown>).query as string).trim();

  if (!query) {
    return NextResponse.json(
      { error: "query must not be empty." },
      { status: 400 }
    );
  }

  // ── Extract tags (AI → local fallback) ───────────────────────────────────
  try {
    // Step 1: try AI extraction (returns null if disabled, timed out, or failed)
    const aiTags = await extractTagsWithOpenAI(query, allowedTags);

    let detectedTags: string[];
    if (aiTags !== null) {
      // AI succeeded — use its tags directly
      detectedTags = aiTags;
      console.log(`[/api/recommend] extraction=openai tags=[${detectedTags.join(", ")}]`);
    } else {
      // AI unavailable or returned nothing — use the deterministic local extractor
      const { tags } = extractTags(query);
      detectedTags = tags;
      console.log(`[/api/recommend] extraction=local tags=[${detectedTags.join(", ")}]`);
    }

    // Step 2: score and rank games (always deterministic, never AI)
    const recommendations = scoreGames(detectedTags);

    const response: RecommendApiResponse = {
      query,
      detectedTags,
      recommendations,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[POST /api/recommend]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
