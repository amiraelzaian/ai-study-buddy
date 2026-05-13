import { ArrowUpRight, Flame, Target } from "lucide-react";
import ProgressCard from "./ProgressCard";

export const revalidate = 60 * 5;

type Session = {
  topic: string;
  score: number | null;
  subject_id: string;
};

type Streak = {
  current_streak: number;
  longest_streak: number;
};

async function ProgressSection({
  pathname,
  studySessions,
  streaks,
}: {
  pathname: string;
  studySessions: Session[];
  streaks: Streak;
}) {
  const uniqueTopics = new Set(studySessions.map((s) => s.topic)).size;

  const sessionsWithScore = studySessions.filter((s) => s.score !== null);
  const avgScore =
    sessionsWithScore.length > 0
      ? Math.round(
          sessionsWithScore.reduce((sum, s) => sum + (s.score ?? 0), 0) /
            sessionsWithScore.length,
        )
      : 0;

  const uniqueSubjects = new Set(studySessions.map((s) => s.subject_id)).size;

  return (
    <section className="flex flex-col pt-4 mx-4">
      <h4 className="p-4 font-semibold">
        {pathname === "profile" ? "Statistics" : "Your Progress"}
      </h4>
      <section className="flex gap-5 flex-col md:flex-row px-4">
        <ProgressCard
          Icon={Flame}
          iconBG="#ffd6c9"
          iconColor="#e6582d"
          topic="Day Streak"
          number={streaks?.current_streak ?? 0}
        >
          Keep it up! You are on fire!
        </ProgressCard>
        <ProgressCard
          Icon={Target}
          iconBG="#efc0ed"
          iconColor="#eb69d5"
          topic="Topics Studied"
          number={uniqueTopics}
        >
          Across {uniqueSubjects} different subjects
        </ProgressCard>
        <ProgressCard
          Icon={ArrowUpRight}
          iconBG="#b6eac4"
          iconColor="#05180a52"
          topic="Average Score"
          number={`${avgScore}%`}
        >
          Based on {sessionsWithScore.length} sessions
        </ProgressCard>
      </section>
    </section>
  );
}

export default ProgressSection;
