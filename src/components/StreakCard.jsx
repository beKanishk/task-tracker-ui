export default function StreakCard({ streak }) {
  const {
    currentStreak,
    longestStreak,
    forgivenessUsed,
    forgivenessAllowed,
  } = streak;

  console.log("Streak data:", streak);
  

  const forgivenessLeft = forgivenessAllowed - forgivenessUsed;

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-2">

      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">Current Streak</p>
        <span className="text-xl">🔥</span>
      </div>

      <p className="text-3xl font-bold text-green-400">
        {currentStreak} days
      </p>

      {/* Forgiveness meter */}
      {forgivenessAllowed > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-400 mb-1">
            Forgiveness remaining: {forgivenessLeft}
          </p>

          <div className="flex gap-1">
            {Array.from({ length: forgivenessAllowed }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-sm ${
                  i < forgivenessUsed
                    ? "bg-yellow-600"
                    : "bg-green-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Longest streak: {longestStreak} days
      </p>
    </div>
  );
}
