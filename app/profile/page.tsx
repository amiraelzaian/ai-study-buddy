import { redirect } from "next/navigation";
import { getCurrentUser, getStudySessions } from "../_lib/actions";
import ProgressSection from "../dashboard/ProgressSection";
import WeeklyPerformanceChart from "./LineChart";

async function page() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const studySessions = (await getStudySessions(user?.id)) ?? [];
  console.log(studySessions);

  // bar chart
  const topicsBySubject=

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4">
      {/*Profile card one col */}
      <section className="cols-span-1"></section>
      {/*statistics and charts  two cols*/}
      <section className="col-span-2 flex flex-col gap-5">
        <ProgressSection pathname="profile" />
        <WeeklyPerformanceChart sessions={studySessions} />
      </section>
    </section>
  );
}

export default page;
