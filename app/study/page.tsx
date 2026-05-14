import { redirect } from "next/navigation";
import { getCurrentUser, getStudySessions } from "../_lib/actions";
import MainContent from "./MainContent";

export const revalidate = 0;

async function page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sessions = await getStudySessions(user.id);

  return <MainContent userId={user.id} sessions={sessions} />;
}

export default page;
