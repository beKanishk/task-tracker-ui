import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { MagicCard } from "./magicui/magic-card";
import { AnimatedShinyText } from "./magicui/animated-shiny-text";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeekData(summaries) {
  const map = {};
  summaries.forEach((s) => { map[s.date] = s; });

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const s = map[dateStr];
    return {
      day: DAY_NAMES[d.getDay()],
      completed: s?.tasksCompleted ?? 0,
      inProgress: s?.tasksInProgress ?? 0,
    };
  });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-elevated border border-[#2a2a42] rounded-xl px-3 py-2 text-xs shadow-modal">
      <p className="text-gray-300 font-medium mb-1">{label}</p>
      <p className="text-green-400">Completed: {payload[0]?.value}</p>
      <p className="text-yellow-400">In Progress: {payload[1]?.value}</p>
    </div>
  );
}

export default function WeeklySummaryChart({ summaries = [] }) {
  const data = buildWeekData(summaries);
  const hasData = data.some((d) => d.completed > 0 || d.inProgress > 0);

  return (
    <MagicCard
      gradientColor="#22c55e11"
      className="bg-surface-card border border-surface-border rounded-xl p-4 shadow-card h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <AnimatedShinyText className="text-sm font-semibold text-gray-300">
          Last 7 Days
        </AnimatedShinyText>
        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm bg-green-500" />
            Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm bg-yellow-500" />
            In Progress
          </span>
        </div>
      </div>

      {!hasData ? (
        <div className="h-[140px] flex items-center justify-center text-gray-600 text-sm">
          No activity this week
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={2}>
            <CartesianGrid stroke="#1e1e30" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />
            <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="inProgress" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </MagicCard>
  );
}
