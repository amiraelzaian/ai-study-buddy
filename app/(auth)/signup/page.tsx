import SignupPage from "@/app/_components/SignupPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup || AI Study Buddy",
  description: "Your AI-powered study companion",
};
function page() {
  return <SignupPage />;
}

export default page;
