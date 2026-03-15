import { BlurFade } from "./magicui/blur-fade";
import { ShimmerButton } from "./magicui/shimmer-button";

function getSuggestion(level, lowEffortDays, avoidedTasks) {
  if (level === "NONE") return "You're doing great! Keep up your current routine.";

  const parts = [];

  if (avoidedTasks?.length > 0)
    parts.push(`Resume avoided tasks gradually — start with just "${avoidedTasks[0]}" today.`);

  if (lowEffortDays >= 3)
    parts.push("You've had several low-effort days. Consider reducing the number of active tasks temporarily.");
  else if (lowEffortDays > 0)
    parts.push("Try logging at least 2 tasks tomorrow to rebuild momentum.");

  if (level === "HIGH")
    parts.push("Switch to maintenance mode for 1–2 days: only do your most essential tasks.");
  else if (level === "MEDIUM")
    parts.push("Consider skipping one non-essential habit to reduce load.");
  else if (level === "LOW")
    parts.push("A slight dip detected — keep going but watch your effort levels.");

  return parts.length > 0 ? parts.join(" ") : "Try reducing task difficulty or taking a lighter day.";
}

export default function FatigueWhyModal({ fatigue, onClose }) {
  const { level, fatigueScore, lowEffortDays, avoidedTasks } = fatigue;
  const suggestion = getSuggestion(level, lowEffortDays, avoidedTasks);

  return (
    <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-elevated border border-[#2a2a42] w-full max-w-md rounded-2xl p-6 shadow-modal">

        <BlurFade delay={0.05}>
          <h2 className="text-lg font-semibold tracking-tight mb-4">
            Why your fatigue is {level}
          </h2>
        </BlurFade>

        <BlurFade delay={0.1}>
          <div className="text-sm text-gray-300 space-y-2 mb-4">
            <p>Fatigue score: <span className="font-semibold text-white">{fatigueScore}</span></p>

            {lowEffortDays > 0 && (
              <p>Low-effort days: <span className="font-semibold text-amber-400">{lowEffortDays}</span></p>
            )}

            {avoidedTasks?.length > 0 && (
              <div>
                <p className="mb-1">Avoided tasks:</p>
                <ul className="list-disc list-inside text-amber-400">
                  {avoidedTasks.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </BlurFade>

        <BlurFade delay={0.15}>
          <div className="bg-surface-card border border-surface-border p-3 rounded-xl text-sm text-gray-400 mb-6">
            💡 {suggestion}
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
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
