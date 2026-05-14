"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveStudySession } from "../../_lib/actions";
import { QuizHeader } from "./_quiz/QuizHeader";
import { QuizQuestion } from "./_quiz/QuizQuestion";
import { QuizNavigation } from "./_quiz/QuizNavigation";
import { QuizResults } from "./_quiz/QuizResults";

type Question = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type Props = {
  topic: string;
  questions: Question[];
  userId: string;
  conversationId: string;
};

export default function QuizView({
  topic,
  questions,
  userId,
  conversationId,
}: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null),
  );
  const [showResult, setShowResult] = useState(false);
  const [saved, setSaved] = useState(false);

  const score = Math.round(
    (answers.filter((a, i) => a === questions[i]?.correct).length /
      questions.length) *
      100,
  );

  useEffect(() => {
    if (showResult && !saved) {
      setSaved(true);
      saveStudySession(userId, conversationId, topic, "", "quiz", score).then(
        () => router.refresh(),
      );
    }
  }, [showResult, saved, userId, conversationId, topic, score, router]);

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const updated = [...answers];
    updated[current] = i;
    setAnswers(updated);
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(answers[current + 1]);
    } else {
      setShowResult(true);
    }
  }

  function handlePrev() {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(answers[current - 1]);
    }
  }

  if (showResult) {
    return (
      <QuizResults
        topic={topic}
        questions={questions}
        answers={answers}
        score={score}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <QuizHeader current={current} total={questions.length} />

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full">
        <QuizQuestion
          topic={topic}
          question={questions[current]}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>

      <QuizNavigation
        current={current}
        total={questions.length}
        isAnswered={selected !== null}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
