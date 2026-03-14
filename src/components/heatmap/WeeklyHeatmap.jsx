import HeatmapLegend from "./HeatmapLegend";

export default function WeeklyHeatmap({ yearData }) {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate() - 1;

  const week = yearData[month].activity.slice(
    Math.max(0, day - 6),
    day + 1
  );

  return (
    <div>
      <p className="text-sm text-gray-400 mb-3">Last 7 days</p>

      <div className="overflow-x-auto">
      <div className="flex gap-2 min-w-fit">
        {week.map((v, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded ${
              v === 0 ? "bg-gray-700" :
              v < 3 ? "bg-green-700" :
              v < 6 ? "bg-green-500" :
              "bg-green-400"
            }`}
          />
        ))}
      </div>
      </div>
      <HeatmapLegend />
    </div>
  );
}
