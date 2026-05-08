import ActivityTable from "./ActivityTable";
import Footer from "./Footer";
import ProgressSection from "./ProgressSection";

export default async function Page() {
  return (
    <main className="flex flex-col">
      <ProgressSection />
      <ActivityTable />
      <Footer />
    </main>
  );
}
