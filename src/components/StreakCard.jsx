import { useState } from "react";

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
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-3">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">Current Streak</p>
        <span className="text-xl">🔥</span>
      </div>

      {/* CURRENT STREAK */}
      <p className="text-3xl font-bold text-green-400">
        {currentStreak} day{currentStreak !== 1 && "s"}
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

            {/* INFO TOOLTIP */}
            <span
              className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 ml-1"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ?
            </span>

            {showTooltip && (
              <div className="absolute left-0 top-5 z-20 w-64 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-300 shadow-xl">
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
                    used ? "bg-yellow-600" : "bg-green-500"
                  }`}
                />
              );
            })}
          </div>

          {/* PENDING WARNING */}
          {forgivenessPending && (
            <p className="text-xs text-orange-400 mt-1">
              ⚠ Forgiveness decision pending
            </p>
          )}
        </div>
      )}

      {/* LONGEST STREAK */}
      <p className="text-xs text-gray-400 pt-2 border-t border-gray-700">
        Longest streak:{" "}
        <span className="font-semibold text-gray-300">
          {longestStreak} day{longestStreak !== 1 && "s"}
        </span>
      </p>
    </div>
  );
}
