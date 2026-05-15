"use client";
import { BookOpen, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface Card {
  choice: string;
  topic: string;
  conversationId: string;
  children: React.ReactNode;
}

export default function StudyChoiceCard({
  choice,
  topic,
  children,
  conversationId,
}: Card) {
  const isNew = choice === "new";
  const router = useRouter();

  return (
    <section
      onClick={() => {
        if (isNew) {
          router.push(`/study`);
        } else {
          router.push(`/study/${conversationId}`);
        }
      }}
      className={`w-full  flex flex-col  gap-2 px-4 py-10  mx-auto
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
