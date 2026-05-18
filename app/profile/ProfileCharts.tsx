"use client";

import dynamic from "next/dynamic";

const WeeklyPerformanceChart = dynamic(() => import("./LineChart"), {
  ssr: false,
  loading: () => (
    <div className="h-48 mx-5 animate-pulse bg-muted rounded-xl" />
  ),
});

const ModeBreakdownChart = dynamic(() => import("./PieChart"), {
  ssr: false,
  loading: () => (
    <div className="h-48 mx-5 animate-pulse bg-muted rounded-xl" />
  ),
});

const Achievements = dynamic(() => import("./Achievements"), {
  ssr: false,
  loading: () => (
    <div className="h-24 mx-5 animate-pulse bg-muted rounded-xl" />
  ),
});

export type StudySession = {
  id: string;
  user_id: string;
  subject_id: string;
  topic: string;
  mode: "flashcards" | "quiz";
  score: number | null;
  created_at: string;
};

export type TopicBySubject = {
  subject_id: string;
  subjects: {
    id: string;
    name: string;
  } | null; // ← was missing | null
};

type Props = {
  studySessions: StudySession[];
  modeCount: { mode: string }[];
  longestStreak: number;
};

export default function ProfileCharts({
  studySessions,
  modeCount,
  longestStreak,
}: Props) {
  return (
    <>
      <WeeklyPerformanceChart sessions={studySessions} />
      {/**FOR FUTURE 😴🥱🥱*/}
      {/* <TopicsBySubjectChart topicsBySubject={topicsBySubject} /> */}
      <ModeBreakdownChart modes={modeCount} />
      <Achievements sessions={studySessions} longestStreak={longestStreak} />
    </>
  );
}
