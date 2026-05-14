"use client";

import { X, BookOpen, HelpCircle, Clock } from "lucide-react";
import type { StudySession } from "./MainContent";
import { useRouter } from "next/navigation";

type Props = {
  sessions: StudySession[];
  onClose: () => void;
};

function modeIcon(mode: string) {
  if (mode === "quiz")
    return <HelpCircle className="w-4 h-4 text-purple-500" />;
  if (mode === "flashcards")
    return <BookOpen className="w-4 h-4 text-emerald-500" />;
  return <BookOpen className="w-4 h-4 text-muted-foreground" />;
}

function scoreColor(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
}

function SessionsSidebar({ sessions, onClose }: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-4 border-b border-border flex-shrink-0">
        <h2 className="font-semibold text-base text-foreground">
          Recent Sessions
        </h2>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
            <Clock className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No sessions yet</p>
            <p className="text-xs text-muted-foreground/60">
              Start studying to see your history
            </p>
          </div>
        ) : (
          sessions.map((s) => (
            <div
              onClick={() => router.push(`/study/${s.conversation_id}`)}
              key={s.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-background
                         border border-border hover:border-purple-300
                         dark:hover:border-purple-700 transition-colors cursor-pointer group"
            >
              <div className="mt-0.5">{modeIcon(s.mode)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {s.topic}
                </p>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {s.mode}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {s.score !== null && (
                  <span
                    className={`text-xs font-semibold ${scoreColor(s.score)}`}
                  >
                    {s.score}%
                  </span>
                )}
                <span className="text-xs text-muted-foreground/60">
                  {timeAgo(s.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SessionsSidebar;
