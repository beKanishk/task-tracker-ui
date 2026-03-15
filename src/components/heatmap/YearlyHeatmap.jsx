import { BlurFade } from "../magicui/blur-fade";
import HeatmapLegend from "./HeatmapLegend";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export default function YearlyHeatmap({ yearData }) {
  if (!Array.isArray(yearData)) {
    return <div className="text-gray-500 text-sm">No yearly data</div>;
  }

  const normalized = MONTHS.map((name, index) => {
    const monthNumber = index + 1;
    const found = yearData.find(m => m.month === monthNumber);
    return {
      name,
      activity: found?.activity ?? new Array(31).fill(0),
    };
  });

  function cellColor(v) {
    if (v === 0) return "bg-surface-border";
    if (v < 2)  return "bg-emerald-600/60";
    return "bg-emerald-500";
  }

  return (
    <div className="space-y-4 overflow-x-auto">
      {normalized.map((month, i) => (
        <BlurFade key={month.name} delay={0.04 * i}>
          <div className="flex gap-4 items-center">

            {/* Month label */}
            <div className="w-24 text-sm text-gray-400 shrink-0">
              {month.name}
            </div>

            {/* Heat cells */}
            <div className="flex items-center">
              {month.activity.map((value, day) => {
                const isWeekEnd = (day + 1) % 7 === 0;
                return (
                  <div
                    key={day}
                    title={`Day ${day + 1}: ${value} completion${value !== 1 ? "s" : ""}`}
                    className={`w-3 h-3 rounded-sm cursor-default transition-all duration-150 hover:scale-125 hover:ring-1 hover:ring-emerald-400/50 ${cellColor(value)}`}
                    style={{ marginRight: isWeekEnd ? "8px" : "2px" }}
                  />
                );
              })}
            </div>
          </div>
        </BlurFade>
      ))}

      <HeatmapLegend />
    </div>
  );
}
