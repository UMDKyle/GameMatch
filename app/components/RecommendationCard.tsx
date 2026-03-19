import Image from "next/image";
import { RecommendationResult } from "@/types/game";

interface RecommendationCardProps {
  result: RecommendationResult;
  rank: number;
}

export default function RecommendationCard({
  result,
  rank,
}: RecommendationCardProps) {
  const { game, matchedTags, whyItMatches, score } = result;
  const matchedSet = new Set(matchedTags);

  // Matched tags float to the front so the user instantly sees the match reason.
  const sortedTags = [
    ...game.tags.filter((t) => matchedSet.has(t)),
    ...game.tags.filter((t) => !matchedSet.has(t)),
  ];

  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-200 hover:border-zinc-300 hover:shadow-md">
      <div className="flex items-start gap-4 p-5">

        {/* ── Square cover thumbnail ───────────────────────────────────────── */}
        <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
          <Image
            src={game.image}
            alt={`${game.name} cover`}
            fill
            sizes="96px"
            className="object-cover object-top"
          />
        </div>

        {/* ── Card content ────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 flex-1 min-w-0">

            {/* Rank badge */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-200">
              {rank}
            </span>

            <div className="flex-1 min-w-0">

              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-zinc-900 leading-snug">
                    {game.igdbUrl ? (
                      <a
                        href={game.igdbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-500 transition-colors duration-150"
                      >
                        {game.name}
                      </a>
                    ) : (
                      game.name
                    )}
                  </h3>
                  {game.genres && game.genres.length > 0 && (
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {game.genres.join(" · ")}
                    </p>
                  )}
                </div>
                {score > 0 && (
                  <span className="shrink-0 mt-0.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500 tabular-nums">
                    {score} pts
                  </span>
                )}
              </div>

              {/* Description — clamped to 2 lines to keep cards compact */}
              {game.description && (
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed line-clamp-2">
                  {game.description}
                </p>
              )}

              {/* Tags — matched first, highlighted in dark */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sortedTags.map((tag) =>
                  matchedSet.has(tag) ? (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-900 px-3 py-0.5 text-xs font-semibold text-white"
                    >
                      {tag}
                    </span>
                  ) : (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium text-zinc-500"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              {/* Why it matches */}
              <div className="mt-3 border-l-2 border-zinc-200 pl-3">
                <p className="text-sm text-zinc-600 leading-relaxed">
                  <span className="font-medium text-zinc-800">
                    Why it matches:{" "}
                  </span>
                  {whyItMatches}
                </p>
              </div>

            </div>
          </div>

      </div>
    </div>
  );
}
