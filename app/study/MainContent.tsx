"use client";

import { useState } from "react";
import SessionsSidebar from "./SessionsSidebar";
import StudyArea from "./StudyArea";

export type StudySession = {
  id: string;
  user_id: string;
  subject_id: string | null;
  topic: string;
  mode: "flashcards" | "quiz" | string;
  score: number | null;
  created_at: string;
};

type Props = {
  userId: string;
  sessions: StudySession[];
};

function MainContent({ userId, sessions }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 h-[calc(100vh-74px)] overflow-hidden">
      {/* Sessions Sidebar */}
      <aside
        className={`
    fixed inset-y-0 left-0 z-40 w-72 md:w-auto
    md:static md:col-span-1
    bg-card border-r border-border
    transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    pt-16 md:pt-0 h-full overflow-hidden
  `}
      >
        <SessionsSidebar
          sessions={sessions}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Study Area */}
      <main className="col-span-1 md:col-span-3 flex flex-col h-full overflow-hidden">
        <StudyArea userId={userId} onOpenSidebar={() => setSidebarOpen(true)} />
      </main>
    </section>
  );
}

export default MainContent;
