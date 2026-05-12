"use client";

type Card = {
  Icon: string;
  topic: string;
  isActive: boolean;
};

function AchievementCard({ Icon, topic, isActive }: Card) {
  return (
    <section
      className={`flex flex-col items-center justify-between gap-3 p-4 border rounded-xl
        ${isActive ? "border-primary-300 bg-primary-50" : "grayscale opacity-60 border-gray-200 bg-white"}
        transition-all duration-200
      `}
    >
      <span className="text-5xl">{Icon}</span>
      <h3 className="text-sm text-center font-medium text-secondary-foreground">
        {topic}
      </h3>
      <span className="text-yellow-400 text-base">⭐</span>
    </section>
  );
}

export default AchievementCard;
