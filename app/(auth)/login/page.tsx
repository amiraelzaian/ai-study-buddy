// login by google and email&password
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login || AI Study Buddy",
  description: "Your AI-powered study companion",
};
import LoginPage from "@/app/_components/LoginPage";
async function Page() {
  return <LoginPage />;
}

export default Page;
