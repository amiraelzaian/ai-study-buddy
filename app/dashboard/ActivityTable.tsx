import ActivityRow from "./ActivityRow";

export const revalidate = 300;
type StudySession = {
  created_at: string;
  id: string;
  mode: string;
  topic: string;
  score: number | null;
  user_id: string;
  subject_id: string | null;
};

async function ActivityTable({
  studySessions,
}: {
  studySessions: StudySession[];
}) {
  const recentSessions = [...studySessions]
    .sort(
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
