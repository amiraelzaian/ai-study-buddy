"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  current: number;
  total: number;
  knownCount: number;
  label?: string;
};

export function FlashcardHeader({ current, total, knownCount, label }: Props) {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0 bg-background">
        <button
          onClick={() => router.push("/study")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-sm font-medium text-foreground">
          {label ?? `${current + 1} / ${total}`}
        </span>
        {!label && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            {knownCount} known
          </span>
        )}
        {label && <div className="w-16" />}
      </div>
      {!label && (
        <div className="h-1 bg-muted flex-shrink-0">
          <div
            className="h-full bg-purple-600 transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      )}
    </>
  );
}
