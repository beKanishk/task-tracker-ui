import { BlurFade } from "../magicui/blur-fade";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import HeatmapLegend from "./HeatmapLegend";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function MonthlyHeatmap({ yearData }) {
  if (!Array.isArray(yearData) || yearData.length === 0) {
    return <div className="text-gray-500 text-sm">No monthly data available</div>;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const monthData =
    yearData.find(m => m.month === currentMonth) ||
    { month: currentMonth, activity: new Array(31).fill(0) };

  function cellColor(v) {
    if (v === 0) return "bg-surface-border";
    if (v < 2)  return "bg-emerald-600/50";
    return "bg-emerald-500";
  }

  return (
    <div className="space-y-4">

      <BlurFade delay={0.05}>
        <AnimatedShinyText className="text-sm font-medium text-gray-300 inline-block">
          {MONTH_NAMES[currentMonth - 1]} {currentYear}
        </AnimatedShinyText>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="grid grid-cols-7 gap-2">
          {monthData.activity.map((value, i) => (
            <div
              key={i}
              title={`Day ${i + 1}: ${value} completion${value !== 1 ? "s" : ""}`}
              className={`w-6 h-6 rounded-md cursor-default transition-all duration-150 hover:scale-110 hover:ring-2 hover:ring-emerald-400/40 ${cellColor(value)}`}
            />
          ))}
        </div>
      </BlurFade>

      <HeatmapLegend />
    </div>
  );
}
