"use client";
import { BookOpen, Zap } from "lucide-react";

interface Card {
  choice: string;
  topic: string;
  children: React.ReactNode;
}

export default function StudyChoiceCard({ choice, topic, children }: Card) {
  const isNew = choice === "new";

  return (
    <section
      onClick={() => {}}
      className={`w-full md:w-1/2 flex flex-col gap-2 px-4 py-10 
        cursor-pointer rounded-lg border hover:shadow-lg transition-shadow
        ${isNew ? "bg-primary" : "bg-card"}`}
    >
      <span
        className={`p-2 rounded-md w-fit ${isNew ? "bg-white/20" : "bg-primary/20"}`}
      >
        {isNew ? (
          <BookOpen
            className={`w-5 h-5 ${isNew ? "text-white" : "text-primary"}`}
          />
        ) : (
          <Zap className="w-5 h-5 text-primary" />
        )}
      </span>
      <p
        className={`font-semibold ${isNew ? "text-white" : "text-card-foreground"}`}
      >
        {topic}
      </p>
      <p
        className={`text-sm ${isNew ? "text-white/80" : "text-muted-foreground"}`}
      >
        {children}
      </p>
    </section>
  );
}
