"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Session = {
  day: string;
  created_at: string;
  score: number | null;
};
export default function WeeklyPerformanceChart({
  sessions,
}: {
  sessions: Session[];
}) {
  // dots chart (line chart)
  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  const chartData = days.map((day) => {
    const daySessions = sessions.filter((s) => {
      const sessionDay = new Date(s.created_at).toLocaleDateString("en-us", {
        weekday: "short",
      });
      return sessionDay === day;
    });
    const avg =
      daySessions.length > 0
        ? Math.round(
            daySessions.reduce((sum, s) => sum + (s.score ?? 0), 0) /
              daySessions.length,
          )
        : 0;
    return { day, score: avg };
  });

  return (
    <div
      className="bg-card rounded-xl p-4 mx-8 shadow-md border
      hover:border-primary-400 transition-all duration-75 "
    >
      <h3 className="font-semibold text-lg mb-4">Weekly Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              color: "#6c63ff",
            }}
            formatter={(value) => [`score : ${value}`]}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#6c63ff"
            strokeWidth={2}
            fill="url(#scoreGradient)"
            dot={{ fill: "#6c63ff", r: 5 }}
            activeDot={{
              r: 7,
              fill: "#fff",
              stroke: "#6c63ff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
