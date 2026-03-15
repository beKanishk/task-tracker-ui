import { BlurFade } from "../magicui/blur-fade";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import HeatmapLegend from "./HeatmapLegend";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyHeatmap({ yearData }) {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate() - 1;

  const startIndex = Math.max(0, day - 6);
  const week = yearData[month].activity.slice(startIndex, day + 1);

  // Compute day-of-week labels for the slice
  const dayLabels = week.map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (week.length - 1 - i));
    return DAY_LABELS[d.getDay()];
  });

  function cellColor(v) {
    if (v === 0) return "bg-surface-border";
    if (v < 3)  return "bg-emerald-700/70";
    if (v < 6)  return "bg-emerald-500";
    return "bg-emerald-400";
  }

  return (
    <div>
      <BlurFade delay={0.05}>
        <AnimatedShinyText className="text-sm font-medium text-gray-300 mb-4 inline-block">
          Last 7 days
        </AnimatedShinyText>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="overflow-x-auto">
          <div className="flex gap-3 min-w-fit">
            {week.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <p className="text-[10px] text-gray-600 uppercase tracking-wide">
                  {dayLabels[i]}
                </p>
                <div
                  title={`${dayLabels[i]}: ${v} completion${v !== 1 ? "s" : ""}`}
                  className={`w-10 h-10 rounded-lg cursor-default transition-all duration-150 hover:scale-110 hover:ring-2 hover:ring-emerald-400/40 ${cellColor(v)}`}
                />
                <p className="text-[10px] text-gray-600 tabular-nums">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </BlurFade>

      <HeatmapLegend />
    </div>
  );
}
