import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { BlurFade } from "../magicui/blur-fade";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";

/* ---------- CUSTOM TOOLTIP ---------- */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-elevated border border-[#2a2a42] rounded-xl px-3 py-2.5 text-sm shadow-modal">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-emerald-400 font-semibold">
        {payload[0].value} completion{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

/* ---------- WEEK DATA ---------- */
function getWeekData(yearData, year, month) {
  const monthData = yearData.find(m => m.month === month);
  if (!monthData) return [];

  const activity = monthData.activity;
  const today = new Date();
  const baseDate =
    today.getFullYear() === year && today.getMonth() + 1 === month
      ? today
      : new Date(year, month - 1, 1);

  const dayOfWeek = baseDate.getDay();
  const weekStart = new Date(baseDate);
  weekStart.setDate(baseDate.getDate() - dayOfWeek);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const day = d.getDate();
    const value = d.getMonth() + 1 === month ? activity[day - 1] ?? 0 : 0;
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
  return m.activity.map((v, i) => ({ label: i + 1, value: v }));
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
  if (mode === "week")  data = getWeekData(yearData, year, month);
  if (mode === "month") data = getMonthData(yearData, month);
  if (mode === "year")  data = getYearData(yearData);

  return (
    <BlurFade delay={0.1}>
      <div>
        <div className="overflow-x-auto">
          <div className="h-[320px] min-w-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="30%">
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.4} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e1e30"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  stroke="#4B5563"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#2a2a42" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#4B5563"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  axisLine={{ stroke: "#2a2a42" }}
                  tickLine={false}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#22c55e08" }}
                />

                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-2 text-right">
          <AnimatedShinyText className="text-xs text-gray-500">
            Bar height = total completions
          </AnimatedShinyText>
        </div>
      </div>
    </BlurFade>
  );
}
