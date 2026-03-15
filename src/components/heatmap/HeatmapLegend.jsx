import { BlurFade } from "../magicui/blur-fade";

export default function HeatmapLegend() {
  return (
    <BlurFade delay={0.05}>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-sm bg-surface-border" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-700/70" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-600/60" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500" />
        <div className="w-3.5 h-3.5 rounded-sm bg-emerald-400" />
        <span>More</span>
      </div>
    </BlurFade>
  );
}
