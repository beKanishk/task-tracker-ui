export default function StreakCard({ streak }) {
  const {
    currentStreak,
    longestStreak,
    forgivenessUsed,
    forgivenessAllowed,
    forgivenessPending,
  } = streak;

  const forgivenessLeft = forgivenessAllowed - forgivenessUsed;

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

          <p className="text-xs text-gray-400">
            Forgiveness left:{" "}
            <span
              className={`font-semibold ${
                forgivenessLeft > 0
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {forgivenessLeft}
            </span>{" "}
            / {forgivenessAllowed}
          </p>

          {/* FORGIVENESS METER */}
          <div className="flex gap-1">
            {Array.from({ length: forgivenessAllowed }).map((_, i) => {
              const used = i < forgivenessUsed;

              return (
                <div
                  key={i}
                  className={`h-2 w-6 rounded-sm transition
                    ${
                      used
                        ? "bg-yellow-600"
                        : "bg-green-500"
                    }
                  `}
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
