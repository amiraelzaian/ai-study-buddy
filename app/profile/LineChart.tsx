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

export default function WeeklyPerformanceChart({
  data,
}: {
  data: ChartData[];
}) {
  return (
    <div className="bg-card rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-4">Weekly Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
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
