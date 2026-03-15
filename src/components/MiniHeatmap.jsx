import { BlurFade } from "./magicui/blur-fade";

export default function MiniHeatmap({ activity }) {
  return (
    <BlurFade delay={0.05}>
      <div className="flex gap-1">
        {activity.map((count, idx) => (
          <div
            key={idx}
            title={`Activity: ${count}`}
            className={`w-4 h-4 rounded-sm cursor-default transition-all duration-150 hover:scale-110 hover:ring-1 hover:ring-emerald-400/50 ${
              count === 0
                ? "bg-surface-border"
                : count < 3
                ? "bg-emerald-600/80"
                : "bg-emerald-400"
            }`}
          />
        ))}
      </div>
    </BlurFade>
  );
}
