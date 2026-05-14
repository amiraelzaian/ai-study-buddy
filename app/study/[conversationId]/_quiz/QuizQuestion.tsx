"use client";

import { CheckCircle, XCircle } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type Props = {
  topic: string;
  question: Question;
  selected: number | null;
  onSelect: (i: number) => void;
};

function getOptionStyle(
  i: number,
  selected: number | null,
  correct: number,
): string {
  const isAnswered = selected !== null;
  if (isAnswered) {
    if (i === correct)
      return "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
    if (i === selected) return "border-red-400 bg-red-50 dark:bg-red-900/20";
  } else if (selected === i) {
    return "border-purple-500 bg-purple-50 dark:bg-purple-900/20";
  }
  return "border-border bg-background hover:border-purple-300 dark:hover:border-purple-700";
}

export function QuizQuestion({ topic, question, selected, onSelect }: Props) {
  const isAnswered = selected !== null;
  const isCorrect = selected === question.correct;

  return (
    <div className="space-y-6">
      {/* Question text */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
          {topic}
        </p>
        <h2 className="text-xl font-semibold text-foreground leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${getOptionStyle(i, selected, question.correct)}`}
          >
            <span className="text-muted-foreground mr-2 font-mono">
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div
          className={`rounded-xl p-4 border ${
            isCorrect
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-semibold ${
                isCorrect
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
