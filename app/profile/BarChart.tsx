"use client";
import { Black_And_White_Picture } from "next/font/google";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TopicsBySubject = {
  subject_id: string;
  subjects: {
    id: string;
    name: string;
  } | null;
};

export default function TopicsBySubjectChart({
  topicsBySubject,
}: {
  topicsBySubject: TopicsBySubject[];
}) {
  const subjectCounts = topicsBySubject.reduce(
    (acc, session) => {
      const name = session.subjects?.name ?? "unknown";
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  // console.log(subjectCounts);
  // Sort by count descending
  const sorted = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]);

  // Top 5 + "Others"
  const top5 = sorted.slice(0, 5);
  const others = sorted.slice(5);

  const chartData = top5.map(([subject, count]) => ({
    subject: subject.split(" ")[0],
    count,
  }));
  if (others.length > 0) {
    const othersCount = others.reduce((sum, [, count]) => sum + count, 0);
    chartData.push({ subject: "Others", count: othersCount });
  }
  // console.log(others);
  // console.log(chartData);

  return (
    <div
      className="bg-card rounded-xl p-2 mx-8 
     shadow-md border border-gray-200
     hover:border-primary-400 transition-all duration-75"
    >
      <h3 className="font-semibold text-lg mb-4">Topics by Subject</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6c63ff" stopOpacity={1} />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis dataKey="subject" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              color: "blueviolet",
            }}
            formatter={(value) => [`Count: ${value}`]}
          />
          <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
