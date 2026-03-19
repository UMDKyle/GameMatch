import { NextRequest, NextResponse } from "next/server";
import { extractTags } from "@/lib/extractTags";
import { scoreGames } from "@/lib/scoreGames";
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

  // ── Generate recommendations ──────────────────────────────────────────────
  try {
    // Extract tags once; pass to scoreGames to avoid doing it twice.
    const { tags: detectedTags } = extractTags(query);
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
