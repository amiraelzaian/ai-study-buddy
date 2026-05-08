import ActivityTable from "./ActivityTable";
import ProgressSection from "./ProgressSection";

export default async function Page() {
  return (
    <main className="flex flex-col">
      <ProgressSection />
      <ActivityTable />
    </main>
  );
}
