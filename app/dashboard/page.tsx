import ActivityTable from "./ActivityTable";
import Footer from "./Footer";
import ProgressSection from "./ProgressSection";
import StudySessionChoice from "./StudySessionChoice";
import WelcomeSection from "./WelcomeSection";

export default async function Page() {
  return (
    <main className="flex flex-col overflow-x-hidden">
      <WelcomeSection />
      <StudySessionChoice />
      <ProgressSection pathname="dashboard" />
      <ActivityTable />
      <Footer />
    </main>
  );
}
