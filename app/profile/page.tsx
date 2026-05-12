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
  if (!user) redirect("/login");

  const userId = user!.id;

  const studySessions = (await getStudySessions(userId)) ?? [];
  const topicsBySubject = (await getSubjectsByUser(userId)) ?? [];
  const streaks = (await getStreak(userId)) ?? [];
  // console.log(streaks.longest_streak);
  const longestStreak = streaks.longest_streak || 0;
  const profile = (await getProfile(userId)) ?? {};
  console.log(profile);
  return (
    <section className="grid grid-cols-1 md:grid-cols-3  mx-2">
      {/*Profile card one col */}
      <section className="cols-span-1">
        <InfoCard profile={profile} />
      </section>
      {/*statistics and charts  two cols*/}
      <section className="col-span-2 flex flex-col gap-5">
        <ProgressSection pathname="profile" />
        <WeeklyPerformanceChart sessions={studySessions} />
        <TopicsBySubjectChart topicsBySubject={topicsBySubject} />
        <Achievements sessions={studySessions} longestStreak={longestStreak} />
      </section>
    </section>
  );
}

export default page;
