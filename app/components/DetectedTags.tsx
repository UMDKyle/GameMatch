interface DetectedTagsProps {
  tags: string[];
  /** Show the component only when the user has typed something. */
  hasInput: boolean;
  /** Optional clear handler — renders a "× clear" button when provided. */
  onClear?: () => void;
}

export default function DetectedTags({
  tags,
  hasInput,
  onClear,
}: DetectedTagsProps) {
  if (!hasInput) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-1.5 min-h-[28px]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-400 shrink-0">Detected:</span>

        {tags.length === 0 ? (
          <span className="text-xs text-zinc-400 italic">
            No tags detected yet
          </span>
        ) : (
          tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-0.5 text-xs font-medium text-white"
            >
              {tag}
            </span>
          ))
        )}
      </div>

      {onClear && (
        <button
          onClick={onClear}
          className="shrink-0 text-xs text-zinc-400 hover:text-zinc-700 transition-colors duration-150"
          aria-label="Clear query and results"
        >
          Clear ×
        </button>
      )}
    </div>
  );
}
