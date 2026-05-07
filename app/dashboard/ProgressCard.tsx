import { LucideIcon } from "lucide-react";

interface ProgressCardProps {
  children: React.ReactNode;
  Icon: LucideIcon;
  iconBG: string;
  iconColor: string;
  topic: string;
  number: number | string;
}

function ProgressCard({
  children,
  Icon,
  iconBG,
  iconColor,
  topic,
  number,
}: ProgressCardProps) {
  return (
    <section
      className="p-4 border hover:border-primary-500 mx-auto w-full md:w-1/3 bg-card rounded-md
    flex flex-col gap-2 hover:-translate-y-1 transition-all duration-75 hover:shadow-md
    "
    >
      <div className="flex gap-2 items-center">
        <span className="rounded-md p-1" style={{ backgroundColor: iconBG }}>
          <Icon className="w-8 h-8 " style={{ color: iconColor }} />
        </span>
        <div className="flex flex-col">
          <h2 className="font-bold text-2xl">{number}</h2>
          <p className="text-gray-600 text-sm">{topic}</p>
        </div>
      </div>
      <section className="text-gray-600 text-sm">{children}</section>
    </section>
  );
}

export default ProgressCard;
