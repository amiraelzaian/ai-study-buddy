"use client";

type Flashcard = {
  front: string;
  back: string;
};

type Props = {
  topic: string;
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onMarkKnown: () => void;
};

export function FlashcardCard({
  topic,
  card,
  flipped,
  onFlip,
  onNext,
  onMarkKnown,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide text-center">
        {topic} — {flipped ? "Answer" : "Question"}
      </p>

      <div
        onClick={onFlip}
        className="cursor-pointer select-none min-h-52 rounded-2xl border-2 border-border bg-card
                   flex items-center justify-center p-8 text-center
                   hover:border-purple-300 dark:hover:border-purple-700 transition-all
                   active:scale-[0.98]"
      >
        <p
          className={`text-lg font-medium leading-relaxed ${
            flipped ? "text-purple-600 dark:text-purple-400" : "text-foreground"
          }`}
        >
          {flipped ? card.back : card.front}
        </p>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Tap card to {flipped ? "see question" : "reveal answer"}
      </p>

      {flipped && (
        <div className="flex gap-3">
          <button
            onClick={onNext}
            className="flex-1 py-3 rounded-xl border-2 border-red-300 dark:border-red-700
                       text-red-600 dark:text-red-400 text-sm font-semibold
                       hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            Still Learning
          </button>
          <button
            onClick={onMarkKnown}
            className="flex-1 py-3 rounded-xl border-2 border-emerald-400 dark:border-emerald-600
                       text-emerald-700 dark:text-emerald-300 text-sm font-semibold
                       hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
          >
            Got It ✓
          </button>
        </div>
      )}
    </div>
  );
}
