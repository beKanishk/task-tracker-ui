export default function FatigueWhyModal({ fatigue, onClose }) {
  const { level, fatigueScore, lowEffortDays, avoidedTasks } = fatigue;

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-900 w-full max-w-md rounded-xl p-6 border border-gray-700">

        <h2 className="text-lg font-semibold mb-2">
          Why your fatigue is {level}
        </h2>

        <div className="text-sm text-gray-300 space-y-2">
          <p>Fatigue score: <b>{fatigueScore}</b></p>

          {lowEffortDays > 0 && (
            <p>Low-effort days: <b>{lowEffortDays}</b></p>
          )}

          {avoidedTasks?.length > 0 && (
            <div>
              <p className="mb-1">Avoided tasks:</p>
              <ul className="list-disc list-inside text-yellow-400">
                {avoidedTasks.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-4 bg-gray-800 p-3 rounded text-sm text-gray-400">
          💡 Suggestion: Try reducing task difficulty, skipping one habit,
          or switching to maintenance mode for 1–2 days.
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
