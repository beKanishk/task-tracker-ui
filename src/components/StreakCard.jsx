import { useState } from "react";
import { ShineBorder } from "./magicui/shine-border";
import { NumberTicker } from "./magicui/number-ticker";

export default function StreakCard({ streak }) {
  const {
    currentStreak,
    longestStreak,
    forgivenessUsed,
    forgivenessAllowed,
    forgivenessPending,
  } = streak;

  const forgivenessLeft = forgivenessAllowed - forgivenessUsed;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <ShineBorder
      color={["#22c55e", "#34d399", "#6ee7b7"]}
      borderWidth={1}
      borderRadius={12}
      duration={14}
      className="w-full"
    >
      <div className="bg-[linear-gradient(to_bottom,rgba(251,146,60,0.06),transparent_30%)] bg-surface-card rounded-xl p-4 space-y-3 w-full">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Current Streak</p>
          <span className="text-xl">🔥</span>
        </div>

        {/* CURRENT STREAK */}
        <p className="text-3xl font-bold text-emerald-400 tracking-tight">
          <NumberTicker value={currentStreak} /> day{currentStreak !== 1 && "s"}
        </p>

        {/* FORGIVENESS STATUS */}
        {forgivenessAllowed > 0 && (
          <div className="space-y-1">

            <div className="relative flex items-center gap-1">
              <p className="text-xs text-gray-400">
                Forgiveness left:{" "}
                <span
                  className={`font-semibold ${
                    forgivenessLeft > 0 ? "text-yellow-400" : "text-red-400"
                  }`}
                >
                  {forgivenessLeft}
                </span>{" "}
                / {forgivenessAllowed}
              </p>

              <span
                className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 ml-1 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                ?
              </span>

              {showTooltip && (
                <div className="absolute left-0 top-5 z-20 w-64 bg-surface-elevated border border-[#2a2a42] rounded-xl p-3 text-xs text-gray-300 shadow-modal">
                  <p className="font-semibold text-gray-200 mb-1">What is Forgiveness?</p>
                  <p>
                    If you miss a day, forgiveness lets you keep your streak alive without breaking it.
                    You have a limited number of forgiveness uses per streak lifetime.
                    Once used up, missing a day will reset your streak.
                  </p>
                </div>
              )}
            </div>

            {/* FORGIVENESS METER */}
            <div className="flex gap-1">
              {Array.from({ length: forgivenessAllowed }).map((_, i) => {
                const used = i < forgivenessUsed;
                return (
                  <div
                    key={i}
                    className={`h-2 w-6 rounded-sm transition ${
                      used ? "bg-amber-500" : "bg-emerald-400"
                    }`}
                  />
                );
              })}
            </div>

            {forgivenessPending && (
              <p className="text-xs text-orange-400 mt-1">
                ⚠ Forgiveness decision pending
              </p>
            )}
          </div>
        )}

        {/* LONGEST STREAK */}
        <p className="text-xs text-gray-400 pt-2 border-t border-surface-border">
          Longest streak:{" "}
          <span className="font-semibold text-gray-300">
            {longestStreak} day{longestStreak !== 1 && "s"}
          </span>
        </p>
      </div>
    </ShineBorder>
  );
}
