import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------- WEEK DATA (FIXED) ---------- */
function getWeekData(yearData, year, month) {
  const monthData = yearData.find(m => m.month === month);
  if (!monthData) return [];

  const activity = monthData.activity;
  const today = new Date();

  // If viewing current month → current week
  // Else → first week of that month
  const baseDate =
    today.getFullYear() === year && today.getMonth() + 1 === month
      ? today
      : new Date(year, month - 1, 1);

  const dayOfWeek = baseDate.getDay(); // 0 (Sun) → 6 (Sat)
  const weekStart = new Date(baseDate);
  weekStart.setDate(baseDate.getDate() - dayOfWeek);

  const week = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);

    const day = d.getDate();
    const value =
      d.getMonth() + 1 === month ? activity[day - 1] ?? 0 : 0;

    week.push({
      label: d.toLocaleDateString("en", { weekday: "short" }),
      value,
    });
  }

  return week;
}

/* ---------- MONTH DATA ---------- */
function getMonthData(yearData, month) {
  const m = yearData.find(x => x.month === month);
  return m.activity.map((v, i) => ({
    label: i + 1,
    value: v,
  }));
}

/* ---------- YEAR DATA ---------- */
function getYearData(yearData) {
  return yearData.map(m => ({
    label: new Date(0, m.month - 1).toLocaleString("en", { month: "short" }),
    value: m.activity.reduce((a, b) => a + b, 0),
  }));
}

export default function HeatmapChart({ yearData, mode, year, month }) {
  let data = [];

  if (mode === "week") data = getWeekData(yearData, year, month);
  if (mode === "month") data = getMonthData(yearData, month);
  if (mode === "year") data = getYearData(yearData);

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" stroke="#9CA3AF" />
          <YAxis allowDecimals={false} stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
          />
          <Bar
            dataKey="value"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
