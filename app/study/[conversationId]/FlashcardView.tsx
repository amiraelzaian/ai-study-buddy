"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveStudySession } from "../../_lib/actions";
import { FlashcardHeader } from "./_flashcard/FlashcardHeader";
import { FlashcardCard } from "./_flashcard/FlashcardCard";
import { FlashcardNavigation } from "./_flashcard/FlashcardNavigation";
import { FlashcardResults } from "./_flashcard/FlashcardResults";

type Flashcard = {
  front: string;
  back: string;
};

type Props = {
  topic: string;
  flashcards: Flashcard[];
  userId: string;
  conversationId: string;
};

export default function FlashcardView({
  topic,
  flashcards,
  userId,
  conversationId,
}: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);

  const progress = Math.round((known.size / flashcards.length) * 100);

  useEffect(() => {
    if (!finished || saved) return;

    setSaved(true);
    saveStudySession(
      userId,
      conversationId,
      topic,
      "",
      "flashcard",
      progress,
    ).then(() => router.refresh());
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleNext() {
    setFlipped(false);
    if (current + 1 < flashcards.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  }

  function handlePrev() {
    if (current > 0) {
      setFlipped(false);
      setCurrent(current - 1);
    }
  }

  function markKnown() {
    setKnown((prev) => new Set([...prev, current]));
    handleNext();
  }

  function restart() {
    setCurrent(0);
    setFlipped(false);
    setKnown(new Set());
    setFinished(false);
    setSaved(false);
  }

  if (finished) {
    return (
      <FlashcardResults
        flashcards={flashcards}
        known={known}
        progress={progress}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FlashcardHeader
        current={current}
        total={flashcards.length}
        knownCount={known.size}
      />

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full">
        <FlashcardCard
          topic={topic}
          card={flashcards[current]}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onNext={handleNext}
          onMarkKnown={markKnown}
        />
      </div>

      <FlashcardNavigation
        current={current}
        total={flashcards.length}
        known={known}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
