export default function StreakDetailsModal({ streak, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-xl w-96 space-y-4">

        <h2 className="text-xl font-bold">🔥 Streak Details</h2>

        <div className="space-y-1 text-sm text-gray-300">
          <p>Current streak: {streak.currentStreak} days</p>
          <p>Longest streak: {streak.longestStreak} days</p>
          <p>
            Forgiveness used: {streak.forgivenessUsed} /{" "}
            {streak.forgivenessAllowed}
          </p>

          {streak.lastBrokenDate && (
            <p className="text-gray-400">
              Last broken on {streak.lastBrokenDate}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="bg-green-600 px-4 py-2 rounded w-full"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
