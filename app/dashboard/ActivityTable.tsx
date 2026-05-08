import { getCurrentUser, getStudySessions } from "../_lib/actions";
import ActivityRow from "./ActivityRow";

async function ActivityTable() {
  const user = await getCurrentUser();
  const studySessions = await getStudySessions(user?.id);

  const recentSessions = studySessions
    .toSorted(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="flex flex-col pt-4 mx-4">
      <h4 className="p-4 font-semibold">Recent Activities</h4>
      <section className="flex flex-col  rounded-lg border overflow-hidden mx-4">
        {recentSessions.length === 0 && (
          <p className="text-muted-foreground text-sm p-4">No activity yet.</p>
        )}
        {recentSessions.map((session) => (
          <ActivityRow key={session.id} session={session} />
        ))}
      </section>
    </section>
  );
}

export default ActivityTable;
