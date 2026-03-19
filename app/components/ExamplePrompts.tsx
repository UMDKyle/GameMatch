"use client";

import { ExamplePrompt } from "@/app/types";

interface ExamplePromptsProps {
  prompts: ExamplePrompt[];
  onSelect: (text: string) => void;
}

export default function ExamplePrompts({
  prompts,
  onSelect,
}: ExamplePromptsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-zinc-500 mr-1">Try:</span>
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => onSelect(prompt.text)}
          className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-600 transition-all duration-150 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 active:scale-95"
        >
          {prompt.text}
        </button>
      ))}
    </div>
  );
}
