import ScrollButtons from "./_components/ScrollButtons"; // inside body:
import { Plus_Jakarta_Sans, Tajawal, Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./_components/ThemePovider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AI Study Buddy",
  description: "Your AI-powered study companion",
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className={`${jakarta.variable} ${tajawal.variable} font-jakarta `}>
        <ThemeProvider>{children}</ThemeProvider>
        <ScrollButtons />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
