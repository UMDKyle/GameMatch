"use client";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function SearchBox({
  value,
  onChange,
  onSubmit,
  isLoading = false,
}: SearchBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      onSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-sm focus-within:border-zinc-400 focus-within:shadow-md transition-all duration-200">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "relaxing farming game", "difficult samurai combat", "co-op horror with friends"'
          rows={3}
          className="w-full resize-none rounded-2xl bg-transparent px-5 py-4 pr-36 text-zinc-800 placeholder-zinc-400 text-base leading-relaxed focus:outline-none"
        />
        <div className="absolute bottom-3 right-3">
          <button
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-zinc-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Spinner />
                Searching…
              </>
            ) : (
              "Recommend"
            )}
          </button>
        </div>
      </div>
      <p className="mt-2 text-right text-xs text-zinc-400">
        ⌘ + Enter to submit
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
