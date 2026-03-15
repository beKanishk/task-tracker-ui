import { BlurFade } from "./magicui/blur-fade";
import { MagicCard } from "./magicui/magic-card";
import { NumberTicker } from "./magicui/number-ticker";
import { ShimmerButton } from "./magicui/shimmer-button";

export default function StreakDetailsModal({ streak, onClose }) {
  const stats = [
    { label: "Current Streak", value: streak.currentStreak, unit: "days", color: "text-emerald-400", gradient: "#22c55e18" },
    { label: "Longest Streak", value: streak.longestStreak, unit: "days", color: "text-blue-400", gradient: "#6366f118" },
    { label: "Forgiveness Used", value: streak.forgivenessUsed, unit: `/ ${streak.forgivenessAllowed}`, color: "text-amber-400", gradient: "#f59e0b18" },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-[#2a2a42] rounded-2xl p-6 w-full max-w-sm shadow-modal">

        <BlurFade delay={0.05}>
          <h2 className="text-xl font-bold tracking-tight mb-5">🔥 Streak Details</h2>
        </BlurFade>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {stats.map((s, i) => (
            <BlurFade key={s.label} delay={0.05 + i * 0.07}>
              <MagicCard
                gradientColor={s.gradient}
                className="bg-surface-card border border-surface-border rounded-xl p-3 text-center shadow-card"
              >
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">{s.label}</p>
                <p className={`text-xl font-bold tabular-nums ${s.color}`}>
                  <NumberTicker value={s.value} />
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{s.unit}</p>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        {streak.lastBrokenDate && (
          <BlurFade delay={0.26}>
            <p className="text-xs text-gray-600 mb-5">Last broken: {streak.lastBrokenDate}</p>
          </BlurFade>
        )}

        <BlurFade delay={0.3}>
          <div className="flex justify-end">
            <ShimmerButton
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
            >
              Got it
            </ShimmerButton>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
