"use client";

import { Award } from "lucide-react";
import AchievementCard from "./AchievementCard";

type Session = {
  mode: string;
  score: number;
  created_at: string;
  is_speed_demon: boolean;
};

type AchievementsProps = {
  sessions: Session[];
  longestStreak: number;
};

function Achievements({ sessions, longestStreak }: AchievementsProps) {
  const numOfQuizzes = sessions.filter((s) => s.mode === "quiz").length;
  const hasPerfectScore = sessions.some((s) => s.score === 100);
  const topics = sessions.length;

  const isEarlyBird = sessions.some((s) => {
    const hour = new Date(s.created_at).getHours();
    return hour >= 5 && hour < 12;
  });

  const isNightOwl = sessions.some((s) => {
    const hour = new Date(s.created_at).getHours();
    return hour >= 21 || hour < 2;
  });

  const isSpeedDemon = sessions.some((s) => s.score >= 90);

  return (
    <section className="flex flex-col bg-card rounded-xl p-4 mx-8 mb-8 shadow-md border hover:border-primary-400 transition-all duration-75">
      <section className="flex justify-start items-center gap-1 mb-4">
        <span className="text-primary-500 text-xl">
          <Award />
        </span>
        <h2 className="text-lg">Achievements</h2>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
        {" "}
        {/*  grid for equal widths */}
        <AchievementCard
          Icon="🔥"
          topic="7-Day Streak"
          isActive={longestStreak >= 7}
        />
        <AchievementCard
          Icon="🎯"
          topic="First Quiz"
          isActive={numOfQuizzes > 0}
        />{" "}
        {/*  fixed topic */}
        <AchievementCard
          Icon="💯"
          topic="Perfect Score"
          isActive={hasPerfectScore}
        />{" "}
        {/*  fixed topic & logic */}
        <AchievementCard Icon="📚" topic="10 Topics" isActive={topics >= 10} />
        <AchievementCard Icon="🌄" topic="Early Bird" isActive={isEarlyBird} />
        <AchievementCard Icon="🦉" topic="Night Owl" isActive={isNightOwl} />
        <AchievementCard Icon="🏆" topic="50 Topics" isActive={topics >= 50} />
        <AchievementCard
          Icon="⚡"
          topic="Speed Demon"
          isActive={isSpeedDemon}
        />
      </section>
    </section>
  );
}

export default Achievements;
