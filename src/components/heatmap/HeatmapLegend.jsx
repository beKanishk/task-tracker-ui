export default function HeatmapLegend() {
  return (
    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
      <span>Less</span>
      <div className="w-3 h-3 rounded-sm bg-gray-700" />
      <div className="w-3 h-3 rounded-sm bg-green-400/50" />
      <div className="w-3 h-3 rounded-sm bg-green-500" />
      <div className="w-3 h-3 rounded-sm bg-green-400" />
      <span>More</span>
    </div>
  );
}
