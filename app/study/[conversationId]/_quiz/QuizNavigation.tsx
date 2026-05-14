"use client";

type Props = {
  current: number;
  total: number;
  isAnswered: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function QuizNavigation({
  current,
  total,
  isAnswered,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex-shrink-0 border-t border-border px-6 py-4 bg-background flex gap-3 max-w-2xl mx-auto w-full">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium
                   disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-all"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={!isAnswered}
        className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700
                   disabled:opacity-40 disabled:cursor-not-allowed
                   text-white text-sm font-semibold transition-all"
      >
        {current + 1 === total ? "See Results" : "Next"}
      </button>
    </div>
  );
}
