// No "use client"
import { ArrowUpRight, Flame, Target } from "lucide-react";
import ProgressCard from "./ProgressCard";
import { getStreak, getCurrentUser, getStudySessions } from "../_lib/actions";

async function ProgressSection() {
  const user = await getCurrentUser();
  const streaks = await getStreak(user?.id);
  const studySessions = await getStudySessions(user?.id);

  // unique topics
  const uniqueTopics = new Set(studySessions.map((s) => s.topic)).size;

  // average score (only sessions with a score)
  const sessionsWithScore = studySessions.filter((s) => s.score !== null);
  const avgScore =
    sessionsWithScore.length > 0
      ? Math.round(
          sessionsWithScore.reduce((sum, s) => sum + s.score, 0) /
            sessionsWithScore.length,
        )
      : 0;

  // unique subjects
  const uniqueSubjects = new Set(studySessions.map((s) => s.subject_id)).size;

  return (
    <section className="flex flex-col pt-4">
      <h4 className="p-4 font-semibold">Your Progress</h4>
      <section className="flex gap-5 flex-col md:flex-row px-4">
        <ProgressCard
          Icon={Flame}
          iconBG="#ffd6c9"
          iconColor="#e6582d"
          topic="Day Streak"
          number={streaks?.current_streak ?? 0}
        >
          keep it up! You are on fire!
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
          number={avgScore}
        >
          Based on {sessionsWithScore.length} sessions
        </ProgressCard>
      </section>
    </section>
  );
}

export default ProgressSection;
