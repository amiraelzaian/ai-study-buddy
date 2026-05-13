import { getCurrentUser, getStreak, getStudySessions } from "../_lib/actions";
import ActivityTable from "./ActivityTable";
import Footer from "./Footer";
import ProgressSection from "./ProgressSection";
import StudySessionChoice from "./StudySessionChoice";
import WelcomeSection from "./WelcomeSection";

export default async function Page() {
  const user = await getCurrentUser();
  const studySessions = (await getStudySessions(user?.id)) ?? [];
  const streaks = (await getStreak(user?.id)) ?? [];

  return (
    <main className="flex flex-col overflow-x-hidden">
      <WelcomeSection />
      <StudySessionChoice />
      <ProgressSection
        pathname="dashboard"
        studySessions={studySessions}
        streaks={streaks}
      />
      <ActivityTable studySessions={studySessions} />
      <Footer />
    </main>
  );
}
