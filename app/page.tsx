"use client";

import { useMemo, useState } from "react";
import SearchBox from "@/app/components/SearchBox";
import ExamplePrompts from "@/app/components/ExamplePrompts";
import RecommendationCard from "@/app/components/RecommendationCard";
import DetectedTags from "@/app/components/DetectedTags";
import ResultsSummary from "@/app/components/ResultsSummary";
import { ExamplePrompt, RecommendApiResponse, RecommendationResult } from "@/app/types";
import { extractTagNames } from "@/lib/extractTags";

const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  { id: "1", text: "I want a relaxing farming game" },
  { id: "2", text: "I want a co-op horror game" },
  { id: "3", text: "I want an open world RPG with a great story" },
  { id: "4", text: "I want a fast-paced sci-fi shooter" },
];

// idle     → nothing submitted yet
// loading  → waiting for API
// no-tags  → API returned but extracted zero tags (local + AI both found nothing)
// done     → API returned (results may be empty)
// error    → API call failed
type ResultStatus = "idle" | "loading" | "no-tags" | "done" | "error";

const PAGE_SIZE = 5;
const MAX_PAGES = 10;

export default function Home() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [results, setResults] = useState<RecommendationResult[]>([]);
  // Tags actually used for scoring — may differ from local preview when AI is on.
  const [apiDetectedTags, setApiDetectedTags] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side preview only — shown while typing, never used for scoring.
  const detectedTags = useMemo(() => extractTagNames(query), [query]);

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Always send to the API — the backend decides tags (local or AI).
    // We no longer gate on client-side detectedTags so that queries like
    // "zombies" can still reach the OpenAI extractor when it's enabled.
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json() as RecommendApiResponse;

      // Store the tags the backend actually used (may be AI-extracted).
      setApiDetectedTags(data.detectedTags);
      setResults(data.recommendations);
      setCurrentPage(1);

      // If the backend found no tags at all, show the no-tags state.
      setStatus(data.detectedTags.length === 0 ? "no-tags" : "done");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setStatus("error");
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setApiDetectedTags([]);
    setStatus("idle");
    setErrorMessage(null);
    setCurrentPage(1);
  };

  const handleExampleSelect = (text: string) => {
    setQuery(text);
    setStatus("idle");
    setResults([]);
    setApiDetectedTags([]);
    setCurrentPage(1);
  };

  const hasInput = query.trim().length > 0;
  const isLoading = status === "loading";

  // Pagination derived values
  const cappedResults = results.slice(0, MAX_PAGES * PAGE_SIZE);
  const totalPages = Math.ceil(cappedResults.length / PAGE_SIZE);
  const pagedResults = cappedResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-100 bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-zinc-900">
              GameMatch
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
              demo
            </span>
          </div>
          <nav className="text-sm text-zinc-400 hidden sm:block">
            AI-powered game discovery
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* Hero */}
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Find your next game.
          </h1>
          <p className="mt-3 text-base text-zinc-500 sm:text-lg">
            Describe the kind of game you want, and get recommendations
            instantly.
          </p>
        </section>

        {/* Search */}
        <section className="mb-3">
          <SearchBox
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </section>

        {/* Detected tags + clear */}
        <section className="mb-5 px-0.5">
          <DetectedTags
            tags={detectedTags}
            hasInput={hasInput}
            onClear={handleClear}
          />
        </section>

        {/* Example prompts */}
        <section className="mb-12">
          <ExamplePrompts
            prompts={EXAMPLE_PROMPTS}
            onSelect={handleExampleSelect}
          />
        </section>

        {/* Results — driven entirely by status */}
        <section>
          {status === "idle" && <IdleState />}

          {status === "loading" && <LoadingState />}

          {status === "error" && (
            <ErrorState
              message={errorMessage ?? "Something went wrong."}
              onRetry={handleSubmit}
            />
          )}

          {status === "no-tags" && <EmptyState kind="no-tags" />}

          {status === "done" && results.length === 0 && (
            <EmptyState kind="no-results" />
          )}

          {status === "done" && results.length > 0 && (
            <>
              <ResultsSummary
                total={cappedResults.length}
                page={currentPage}
                pageSize={PAGE_SIZE}
                detectedTags={apiDetectedTags}
              />
              <div className="flex flex-col gap-4">
                {pagedResults.map((result, index) => (
                  <RecommendationCard
                    key={result.game.id}
                    result={result}
                    rank={(currentPage - 1) * PAGE_SIZE + index + 1}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  current={currentPage}
                  total={totalPages}
                  onChange={setCurrentPage}
                />
              )}
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-100 px-6 py-6 mt-8">
        <p className="text-center text-xs text-zinc-400">
          GameMatch · Built with Next.js 14 · Demo
        </p>
      </footer>
    </div>
  );
}

// ── Supporting UI components ───────────────────────────────────────────────────

/** Decorative tag pills shown in the idle state to hint at what's searchable. */
const EXAMPLE_TAGS = [
  "samurai", "horror", "relaxing", "open-world",
  "sci-fi", "roguelike", "co-op", "story-rich",
];

function IdleState() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-8 py-12 text-center">
      <p className="text-base font-medium text-zinc-700">
        What kind of game are you looking for?
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        Describe it above or pick one of the example prompts to get started.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {EXAMPLE_TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

type EmptyStateKind = "no-tags" | "no-results";

const EMPTY_STATE_COPY: Record<EmptyStateKind, { heading: string; body: string }> = {
  "no-tags": {
    heading: "No recognizable keywords found.",
    body: 'Words like "scary", "relaxing", "samurai", "open world", or "roguelike" work great.',
  },
  "no-results": {
    heading: "No matches for these tags.",
    body: 'Try broader words like "action", "story", "exploration", or "dark" to widen the results.',
  },
};

function EmptyState({ kind }: { kind: EmptyStateKind }) {
  const { heading, body } = EMPTY_STATE_COPY[kind];
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-8 py-12 text-center">
      <p className="text-base font-medium text-zinc-700">{heading}</p>
      <p className="mt-2 text-sm text-zinc-400">{body}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-4">
      {/* Faint summary bar placeholder to prevent layout shift */}
      <div className="mb-1 h-9 rounded-lg bg-zinc-100 animate-pulse w-3/5" />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200 bg-white p-6 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-zinc-100 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-2/5 rounded bg-zinc-100" />
              <div className="h-3 w-full rounded bg-zinc-100" />
              <div className="h-3 w-4/5 rounded bg-zinc-100" />
              <div className="flex gap-2 pt-1">
                <div className="h-5 w-16 rounded-full bg-zinc-900/10" />
                <div className="h-5 w-20 rounded-full bg-zinc-900/10" />
                <div className="h-5 w-14 rounded-full bg-zinc-100" />
              </div>
              <div className="mt-1 h-3 w-3/5 rounded bg-zinc-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-8 py-10 text-center">
      <p className="text-sm font-medium text-red-700">
        Failed to get recommendations
      </p>
      <p className="mt-1 text-xs text-red-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
      >
        Try again
      </button>
    </div>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      {/* Prev */}
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-30 transition-colors duration-150"
        aria-label="Previous page"
      >
        ‹
      </button>

      {/* Page numbers */}
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors duration-150 ${
            page === current
              ? "bg-zinc-900 text-white"
              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
          }`}
          aria-label={`Page ${page}`}
          aria-current={page === current ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:pointer-events-none disabled:opacity-30 transition-colors duration-150"
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
}
