import { redirect } from "next/navigation";
import {
  getCurrentUser,
  getStudySessions,
  getSubjectsByUser,
} from "../_lib/actions";
import ProgressSection from "../dashboard/ProgressSection";
import WeeklyPerformanceChart from "./LineChart";
import TopicsBySubjectChart from "./BarChart";

async function page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userId = user!.id;

  const studySessions = (await getStudySessions(userId)) ?? [];
  const topicsBySubject = (await getSubjectsByUser(userId)) ?? [];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4">
      {/*Profile card one col */}
      <section className="cols-span-1"></section>
      {/*statistics and charts  two cols*/}
      <section className="col-span-2 flex flex-col gap-5">
        <ProgressSection pathname="profile" />
        <WeeklyPerformanceChart sessions={studySessions} />
        <TopicsBySubjectChart topicsBySubject={topicsBySubject} />
      </section>
    </section>
  );
}

export default page;
