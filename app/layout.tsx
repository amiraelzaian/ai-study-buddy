import { Plus_Jakarta_Sans, Tajawal } from "next/font/google";

import "./globals.css";

import type { Metadata } from "next";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${tajawal.variable} font-jakarta`}>
        {children}
      </body>
    </html>
  );
}
