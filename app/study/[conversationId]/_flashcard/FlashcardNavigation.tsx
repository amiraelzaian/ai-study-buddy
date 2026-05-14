"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  current: number;
  total: number;
  known: Set<number>;
  onPrev: () => void;
  onNext: () => void;
};

export function FlashcardNavigation({
  current,
  total,
  known,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex-shrink-0 border-t border-border px-6 py-4 bg-background flex gap-3 max-w-2xl mx-auto w-full">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium
                   disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      <div className="flex-1 flex items-center justify-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current
                ? "bg-purple-600 w-3"
                : known.has(i)
                  ? "bg-emerald-400"
                  : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700
                   text-white text-sm font-semibold transition-all"
      >
        {current + 1 === total ? "Finish" : "Next"}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
