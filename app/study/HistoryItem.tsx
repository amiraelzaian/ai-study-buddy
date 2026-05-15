"use client";
import { BookOpen, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export type StudySession = {
  id: string;
  topic: string;
  mode: string;
  score: number | null;
  created_at: string;
  conversation_id: string;
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
  if (mins < 60 && mins > 0) return `${mins}m age`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
}

function HistoryItem({ session }: { session: StudySession }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/study/${session.conversation_id}`)}
      key={session.id}
      className="flex items-start gap-3 p-3 rounded-xl bg-background
                         border border-border hover:border-purple-300
                         dark:hover:border-purple-700 transition-colors cursor-pointer group"
    >
      <div className="mt-0.5">{modeIcon(session.mode)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {session.topic}
        </p>
        <p className="text-xs text-muted-foreground capitalize mt-0.5">
          {session.mode}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {session.score !== null && (
          <span
            className={`text-xs font-semibold ${scoreColor(session.score)}`}
          >
            {session.score}%
          </span>
        )}
        <span className="text-xs text-muted-foreground/60">
          {timeAgo(session.created_at)}
        </span>
      </div>
    </div>
  );
}

export default HistoryItem;
