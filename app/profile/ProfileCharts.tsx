"use client";

import dynamic from "next/dynamic";

const WeeklyPerformanceChart = dynamic(() => import("./LineChart"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse bg-muted rounded-xl" />,
});

const TopicsBySubjectChart = dynamic(() => import("./BarChart"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse bg-muted rounded-xl" />,
});

const Achievements = dynamic(() => import("./Achievements"), {
  ssr: false,
  loading: () => <div className="h-24 animate-pulse bg-muted rounded-xl" />,
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
  topicsBySubject: TopicBySubject[];
  longestStreak: number;
};

export default function ProfileCharts({
  studySessions,
  topicsBySubject,
  longestStreak,
}: Props) {
  return (
    <>
      <WeeklyPerformanceChart sessions={studySessions} />
      <TopicsBySubjectChart topicsBySubject={topicsBySubject} />
      <Achievements sessions={studySessions} longestStreak={longestStreak} />
    </>
  );
}
