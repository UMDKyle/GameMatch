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
  { id: "1", text: "I want a difficult samurai game" },
  { id: "2", text: "I want a relaxing farming game" },
  { id: "3", text: "I want a co-op horror game" },
  { id: "4", text: "I want an open world RPG with a great story" },
  { id: "5", text: "I want a fast-paced sci-fi shooter" },
];

// idle     → nothing submitted yet
// loading  → waiting for API
// no-tags  → submitted but no tags detected (skipped API)
// done     → API returned (results may be empty)
// error    → API call failed
type ResultStatus = "idle" | "loading" | "no-tags" | "done" | "error";

export default function Home() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ResultStatus>("idle");
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Detected tags are always client-side — instant, no API call.
  const detectedTags = useMemo(() => extractTagNames(query), [query]);

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (detectedTags.length === 0) {
      setStatus("no-tags");
      setResults([]);
      return;
    }

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
      setResults(data.recommendations);
      setStatus("done");
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
    setStatus("idle");
    setErrorMessage(null);
  };

  const handleExampleSelect = (text: string) => {
    setQuery(text);
    // Reset result state so the user sees the prompt filled in cleanly,
    // ready to submit — not stale results from a previous query.
    setStatus("idle");
    setResults([]);
  };

  const hasInput = query.trim().length > 0;
  const isLoading = status === "loading";

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
                count={results.length}
                detectedTags={detectedTags}
                onClear={handleClear}
              />
              <div className="flex flex-col gap-4">
                {results.map((result, index) => (
                  <RecommendationCard
                    key={result.game.id}
                    result={result}
                    rank={index + 1}
                  />
                ))}
              </div>
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
