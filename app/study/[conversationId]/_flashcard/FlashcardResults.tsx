"use client";

import { CheckCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { FlashcardHeader } from "./FlashcardHeader";

type Flashcard = {
  front: string;
  back: string;
};

type Props = {
  flashcards: Flashcard[];
  known: Set<number>;
  progress: number;
  onRestart: () => void;
};

export function FlashcardResults({
  flashcards,
  known,
  progress,
  onRestart,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FlashcardHeader current={0} total={1} knownCount={0} label="Complete" />

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full space-y-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
          <h2 className="text-2xl font-bold mb-1">
            {known.size} / {flashcards.length} Known
          </h2>
          <p className="text-purple-200 text-sm">{progress}% mastered</p>
          <p className="text-purple-100 mt-2 font-medium">
            {progress >= 90
              ? "Amazing! You know these well 🎉"
              : progress >= 60
                ? "Good progress! Keep going 👍"
                : "Review more to master them 💪"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Review Again
          </button>
          <button
            onClick={() => router.push("/study")}
            className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all"
          >
            New Session
          </button>
        </div>

        <h3 className="text-base font-semibold text-foreground">All Cards</h3>
        {flashcards.map((fc, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 space-y-2 ${
              known.has(i)
                ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                {fc.front}
              </p>
              {known.has(i) && (
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{fc.back}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
