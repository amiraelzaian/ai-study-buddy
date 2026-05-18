import { Metadata } from "next";
import { getCurrentUser, getStreak, getStudySessions } from "../_lib/actions";
import ActivityTable from "./ActivityTable";
import Footer from "./Footer";
import ProgressSection from "./ProgressSection";
import StudySessionChoice from "./StudySessionChoice";
import WelcomeSection from "./WelcomeSection";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "AI study buddy || dashboard",
  description: "Your powered AI study buddy to enhance your study sessions",
};

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
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
