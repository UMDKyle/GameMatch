interface ResultsSummaryProps {
  count: number;
  detectedTags: string[];
  onClear: () => void;
}

export default function ResultsSummary({
  count,
  detectedTags,
  onClear,
}: ResultsSummaryProps) {
  const tagSummary = detectedTags.join(", ");

  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Recommended for you
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Showing {count} {count === 1 ? "match" : "matches"}
          {tagSummary && (
            <>
              {" · "}Based on:{" "}
              <span className="font-medium text-zinc-700">{tagSummary}</span>
            </>
          )}
        </p>
      </div>
      <button
        onClick={onClear}
        className="shrink-0 mt-0.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors duration-150"
        aria-label="Clear results and start over"
      >
        Try another ↺
      </button>
    </div>
  );
}
