import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getProfile,
  getStreak,
  getStudySessions,
  getSubjectsByUser,
} from "../_lib/actions";
import ProgressSection from "../dashboard/ProgressSection";
import WeeklyPerformanceChart from "./LineChart";
import TopicsBySubjectChart from "./BarChart";
import Achievements from "./Achievements";
import InfoCard from "./InfoCard";

export const revalidate = 60 * 5;

async function page() {
  const user = await getCurrentUser();
  console.log("USER:", user);
  if (!user) redirect("/login");

  const userId = user.id;

  const studySessions = (await getStudySessions(userId)) ?? [];
  const topicsBySubject = (await getSubjectsByUser(userId)) ?? [];
  const streaks = await getStreak(userId);
  const profile = await getProfile(userId);

  const longestStreak = streaks?.longest_streak ?? 0;

  // ✅ fallback if profile doesn't exist yet (e.g. new Google user)
  const safeProfile = profile ?? {
    id: userId,
    full_name: user.user_metadata?.full_name ?? "",
    email: user.email ?? "",
    avatar_url: user.user_metadata?.avatar_url ?? null,
    Bio: "",
    phone: "",
    created_at: user.created_at ?? "",
  };

  // ✅ fallback if streaks don't exist yet
  const safeStreaks = streaks ?? {
    current_streak: 0,
    longest_streak: 0,
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 mx-2">
      <section className="cols-span-1">
        <InfoCard profile={safeProfile} />
      </section>
      <section className="col-span-2 flex flex-col gap-5">
        <ProgressSection
          pathname="profile"
          studySessions={studySessions ?? []}
          streaks={safeStreaks}
        />
        <WeeklyPerformanceChart sessions={studySessions ?? []} />
        <TopicsBySubjectChart topicsBySubject={topicsBySubject ?? []} />
        <Achievements
          sessions={studySessions ?? []}
          longestStreak={longestStreak}
        />
      </section>
    </section>
  );
}

export default page;
