import { Clock, X } from "lucide-react";
import type { StudySession } from "./MainContent";
import HistoryItem from "./HistoryItem";
import SidebarHeader from "./SidebarHeader";

type Props = {
  sessions: StudySession[];
  onClose: () => void;
  user_id: string;
};

function SessionsSidebar({ sessions, onClose }: Props) {
  const length: number = sessions.length;
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SidebarHeader
        userId={sessions?.at(0)?.user_id}
        onClose={onClose}
        length={length}
      />

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
          sessions.map((s) => <HistoryItem session={s} key={s.id} />)
        )}
      </div>
    </div>
  );
}

export default SessionsSidebar;
