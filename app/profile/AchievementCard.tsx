"use client";

type Card = {
  Icon: string;
  topic: string;
  isActive: boolean;
};

function AchievementCard({ Icon, topic, isActive }: Card) {
  return (
    <section
      className={`flex flex-col items-center justify-between gap-3 p-4 border rounded-xl transition-all duration-200
        ${
          isActive
            ? "border-primary-300 bg-primary-50 dark:bg-primary-950 dark:bg-primary-400"
            : "grayscale opacity-60 border-gray-200 bg-gray-50 dark:bg-zinc-900"
        }
      `}
    >
      <span className="text-5xl">{Icon}</span>
      <h3
        className={`text-sm text-center font-medium
        ${isActive ? "text-secondary-foreground" : "text-muted-foreground"}`}
      >
        {topic}
      </h3>
      <span className="text-yellow-400 text-base">⭐</span>
    </section>
  );
}

export default AchievementCard;
