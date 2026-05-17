import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI study buddy || confirmation",
  description: "Your powered AI study buddy to enhance your study sessions",
};

export default function CheckEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-2xl font-bold mb-2">Check your email</h1>
      <p className="text-muted-foreground">
        We sent a confirmation link to your email. <br />
        Please confirm it before signing in 📧
      </p>
    </div>
  );
}
