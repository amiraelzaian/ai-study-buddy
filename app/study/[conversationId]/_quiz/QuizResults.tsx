"use client";

import { Trophy, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizHeader } from "./QuizHeader";

type Question = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type Props = {
  topic: string;
  questions: Question[];
  answers: (number | null)[];
  score: number;
};

export function QuizResults({ questions, answers, score }: Props) {
  const router = useRouter();
  const correctCount = answers.filter(
    (a, i) => a === questions[i]?.correct,
  ).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <QuizHeader current={0} total={1} label="Quiz Results" />

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full space-y-6">
        {/* Score card */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
          <h2 className="text-2xl font-bold mb-1">{score}%</h2>
          <p className="text-purple-200 text-sm">
            {correctCount} of {questions.length} correct
          </p>
          <p className="text-purple-100 mt-2 font-medium">
            {score >= 90
              ? "Excellent! 🎉"
              : score >= 70
                ? "Good job! 👍"
                : "Keep practicing! 💪"}
          </p>
        </div>

        {/* Review */}
        <h3 className="text-base font-semibold text-foreground">Review</h3>
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const correct = userAnswer === q.correct;
          return (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 space-y-3"
            >
              <div className="flex items-start gap-2">
                {correct ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium text-foreground">
                  {q.question}
                </p>
              </div>
              <div className="space-y-1 pl-7">
                {q.options.map((opt, j) => (
                  <div
                    key={j}
                    className={`text-xs px-3 py-1.5 rounded-lg ${
                      j === q.correct
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-medium"
                        : j === userAnswer && !correct
                          ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pl-7 italic">
                {q.explanation}
              </p>
            </div>
          );
        })}

        <button
          onClick={() => router.push("/study")}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
}
