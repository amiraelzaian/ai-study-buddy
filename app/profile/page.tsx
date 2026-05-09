import { getCurrentUser, getStudySessions } from "../_lib/actions";
import ProgressSection from "../dashboard/ProgressSection";
import WeeklyPerformanceChart from "./LineChart";

async function page() {
  const user = await getCurrentUser();
  const studySessions = await getStudySessions(user?.id);
  console.log(studySessions);

  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const chartData = days.map((day) => {
    const daySessions = studySessions.filter((s) => {
      const sessionDay = new Date(s.created_at).toLocaleDateString("en-us", {
        weekday: "short",
      });
      return sessionDay === day;
    });
    const avg =
      daySessions.length > 0
        ? Math.round(
            daySessions.reduce((sum, s) => sum + (s.score ?? 0), 0) /
              daySessions.length,
          )
        : 0;
    return { day, score: avg };
  });

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4">
      {/*Profile card one col */}
      <section className="cols-span-1"></section>
      {/*statistics and charts  two cols*/}
      <section className="col-span-2 ">
        <ProgressSection pathname="profile" />
        <WeeklyPerformanceChart data={chartData} />
      </section>
    </section>
  );
}

export default page;
