"use client";
import { Book, BookOpen, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useLongPress } from "../_hooks/useLongPress";
import ConfirmDialog from "./DeletePopup";
import { deleteConversationFromHistory } from "../_lib/actions";
import toast from "react-hot-toast";

export type StudySession = {
  id: string;
  topic: string;
  mode: string;
  score: number | null;
  created_at: string;
  conversation_id: string;
  conversations: { created_at: string };
};

function modeIcon(mode: string) {
  if (mode === "quiz")
    return <HelpCircle className="w-4 h-4 text-orange-500" />;
  if (mode === "flashcards")
    return <BookOpen className="w-4 h-4 text-emerald-500" />;
  return <Book className="w-4 h-4 text-primary-500" />;
}

function scoreColor(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

function timeAgo(dateStr: string) {
  const dbTime = new Date(dateStr).getTime();
  const nowTime = Date.now();
  const diff = nowTime - dbTime;

  console.log({
    dateStr,
    dbTime: new Date(dbTime).toISOString(),
    nowTime: new Date(nowTime).toISOString(),
    diffMinutes: Math.floor(diff / 60000),
  });

  if (diff < 0) return "just now";

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);

  if (days > 0) return `${days}d ago`;
  if (hours >= 2) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

function HistoryItem({ session }: { session: StudySession }) {
  console.log(session);
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const isDoubleClick = useRef<boolean>(false);

  const longPress = useLongPress(() => setShowDeleteModal(true));

  function handleClick() {
    isDoubleClick.current = false; // reset on each click
    clickTimer.current = setTimeout(() => {
      if (!isDoubleClick.current) {
        router.push(`/study/${session.conversation_id}`);
      }
    }, 250);
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    isDoubleClick.current = true;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    setShowDeleteModal(true);
  }

  async function handleDelete() {
    try {
      setLoading(true);
      await deleteConversationFromHistory(session?.conversation_id);
      toast.success("Session deleted successfully");
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        {...longPress}
        className="flex items-start gap-3 p-3 rounded-xl bg-background
                 border border-border hover:border-primary-300
                 dark:hover:border-primary-700 transition-colors cursor-pointer group"
      >
        <div className="mt-0.5">{modeIcon(session.mode)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
            {timeAgo(session.conversations.created_at)}
          </span>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete this session?"
        description="This will permanently delete this study session and all its messages."
        loading={loading}
      />
    </>
  );
}

export default HistoryItem;
