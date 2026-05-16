import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getModecounts,
  getProfile,
  getStreak,
  getStudySessions,
} from "../_lib/actions";
import ProgressSection from "../dashboard/ProgressSection";
import InfoCard from "./InfoCard";
import ProfileCharts from "./ProfileCharts";

export const revalidate = 60 * 5;

async function page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = user.id;
  // console.log(userId);

  const studySessions = (await getStudySessions(userId)) ?? [];
  // console.log("session", studySessions);
  // const topicsBySubject = (await getSubjectsByUser(userId)) ?? [];
  // console.log("session", topicsBySubject);
  const streaks = await getStreak(userId);
  const profile = await getProfile(userId);
  const modes = await getModecounts(userId);

  const longestStreak = streaks?.longest_streak ?? 0;

  const safeProfile = profile ?? {
    id: userId,
    full_name: user.user_metadata?.full_name ?? "",
    email: user.email ?? "",
    avatar_url: user.user_metadata?.avatar_url ?? null,
    Bio: "",
    phone: "",
    created_at: user.created_at ?? "",
  };

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
        <ProfileCharts
          studySessions={studySessions ?? []}
          modeCount={modes}
          longestStreak={longestStreak}
        />
      </section>
    </section>
  );
}

export default page;
