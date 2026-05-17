import { redirect } from "next/navigation";
import { getCurrentUser, getStudySessions } from "../_lib/actions";
import MainContent from "./MainContent";
import { Metadata } from "next";

export const revalidate = 0;
export const metadata: Metadata = {
  title: "AI study buddy || study area",
  description: "Your powered AI study buddy to enhance your study sessions",
};
async function page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sessions = await getStudySessions(user.id);

  return <MainContent userId={user.id} sessions={sessions} />;
}

export default page;
