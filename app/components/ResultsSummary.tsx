interface ResultsSummaryProps {
  total: number;
  page: number;
  pageSize: number;
  detectedTags: string[];
}

export default function ResultsSummary({
  total,
  page,
  pageSize,
  detectedTags,
}: ResultsSummaryProps) {
  const tagSummary = detectedTags.join(", ");
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mb-5">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Recommended for you
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        Showing {from}–{to} of {total} {total === 1 ? "match" : "matches"}
        {tagSummary && (
          <>
            {" · "}Based on:{" "}
            <span className="font-medium text-zinc-700">{tagSummary}</span>
          </>
        )}
      </p>
    </div>
  );
}
