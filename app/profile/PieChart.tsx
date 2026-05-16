"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ModeCount = { mode: string };

const COLORS = ["#6c63ff", "#a78bfa", "#c4b5fd"];

export default function ModeBreakdownChart({ modes }: { modes: ModeCount[] }) {
  const counts = modes.reduce(
    (acc, { mode }) => {
      acc[mode] = (acc[mode] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div
      className="bg-card rounded-xl p-2 mx-8 shadow-md border hover:border-primary-400 transition-all duration-75"
      tabIndex={-1}
    >
      <h3 className="font-semibold text-lg mb-4">Study Modes</h3>
      <ResponsiveContainer
        width="100%"
        height={300}
        style={{ outline: "none" }}
      >
        <PieChart style={{ outline: "none" }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              color: "blueviolet",
            }}
            formatter={(value, name) => [`Count: ${value}`, name]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
