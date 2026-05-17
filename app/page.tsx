import Link from "next/link";
import Footer from "@/app/dashboard/Footer";
import Logo from "@/app/_components/Logo";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Glow blobs — subtle in light, vivid in dark */}
      <div className="fixed top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full bg-primary-300/20 dark:bg-primary-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full bg-primary-400/10 dark:bg-primary-500/15 blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-border backdrop-blur-sm bg-background/80">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm bg-primary hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-44 pb-20">
        {" "}
        {/* floating emoji decorations */}
        <span
          className="absolute left-[8%] top-32 text-3xl animate-bounce hidden md:block"
          style={{ animationDuration: "2.5s" }}
        >
          📚
        </span>
        <span
          className="absolute right-[10%] top-32 text-2xl animate-bounce hidden md:block"
          style={{ animationDuration: "3s" }}
        >
          ✨
        </span>
        <span
          className="absolute left-[15%] bottom-16 text-2xl animate-bounce hidden md:block"
          style={{ animationDuration: "2s" }}
        >
          🧠
        </span>
        <span
          className="absolute right-[8%] bottom-20 text-3xl animate-bounce hidden md:block"
          style={{ animationDuration: "3.5s" }}
        >
          🎯
        </span>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-6 shadow-sm">
          🎉 Free to use · No credit card needed
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-2xl mb-5 text-foreground">
          Your personal{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-violet-400 to-primary-300">
              study buddy
            </span>
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 200 8"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6 Q50 0 100 5 Q150 10 200 4"
                stroke="#818CF8"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          is here! 🚀
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed mb-3">
          Struggling with a tough topic? Just ask. Get clear explanations,
          practice quizzes, and flashcards — made for students like you.
        </p>
        <p className="text-muted-foreground/60 text-sm mb-10">
          Students are already using it for React, SQL, Biology, History, and
          more 🌍
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/signup"
            className="px-7 py-3.5 bg-primary hover:bg-primary-600 text-white rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/30"
          >
            Let&apos;s start learning! 🎓
          </Link>
          <Link
            href="/login"
            className="px-7 py-3.5 border border-border hover:border-primary-400 rounded-2xl text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            I have an account →
          </Link>
        </div>
        {/* social proof */}
        <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
          {/* <div className="flex -space-x-2">
            {["🧑‍🎓", "👩‍💻", "🧑‍🔬", "👨‍📚"].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 border-2 border-background flex items-center justify-center text-sm"
              >
                {emoji}
              </div>
            ))}
          </div> */}
          <span>Join students already studying smarter ⚡</span>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "💬",
              title: "AI Explanations",
              desc: "Ask anything and get clear, structured answers instantly.",
            },
            {
              icon: "🧠",
              title: "Smart Quizzes",
              desc: "Test your knowledge with AI-generated quizzes on any topic.",
            },
            {
              icon: "🃏",
              title: "Flashcards",
              desc: "Reinforce memory with auto-generated flashcard decks.",
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              desc: "See your streaks, scores, and study history at a glance.",
            },
            {
              icon: "🎯",
              title: "Any Subject",
              desc: "From math to history — Study Buddy covers it all.",
            },
            {
              icon: "⚡",
              title: "Instant Feedback",
              desc: "Know right away what you got right and what to review.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-5 rounded-xl border border-border bg-card hover:border-primary-400/50 transition-all"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-semibold text-sm text-card-foreground mb-1">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="relative z-10 px-6 pb-24 flex flex-col items-center text-center">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to ace your studies?
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Join thousands of students already using AI Study Buddy to learn
            faster and retain more.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold text-sm transition-all hover:scale-105"
          >
            Create your free account
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
