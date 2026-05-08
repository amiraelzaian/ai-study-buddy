import { Award, BookOpen, Brain } from "lucide-react";

interface Session {
  id: string;
  user_id: string;
  topic: string;
  mode: string;
  score: number | null;
  created_at: string;
  subject_id: string | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (mins > 0) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  return "Just now";
}

function ActivityRow({ session }: { session: Session }) {
  return (
    <section className="flex justify-between items-center p-4 border-b last:border-b-0 bg-card hover:bg-muted/50 transition-colors">
      <section className="flex gap-3 items-center">
        <span className="text-violet-600 bg-violet-100 dark:bg-violet-900/30 p-2 rounded-md">
          {session.mode === "quiz" && <Award className="w-5 h-5" />}
          {session.mode === "flashcards" && <BookOpen className="w-5 h-5" />}
          {session.mode !== "flashcards" && session.mode !== "quiz" && (
            <Brain className="w-5 h-5" />
          )}
        </span>

        <section className="flex flex-col gap-0.5">
          <p className="font-semibold text-sm">{session.topic}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {session.mode}
          </p>
        </section>
      </section>

      <section className="text-right flex flex-col gap-0.5">
        <p className="font-semibold text-sm">
          {/* ✅ fixed logic */}
          {session.score === null || session.score === 100
            ? "Completed"
            : `${session.score}/100`}
        </p>
        <p className="text-xs text-muted-foreground">
          {timeAgo(session.created_at)}{" "}
        </p>
      </section>
    </section>
  );
}

export default ActivityRow;
