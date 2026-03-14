import { useState } from "react";
import api from "../api/axios";

export default function ForgivenessBanner({
  missedDays,
  forgivenessLeft,
  onDecision,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  async function accept() {
    try {
      setLoading(true);
      setError(null);
      await api.post("/api/streak/forgiveness/accept");
      onDecision();
    } catch (err) {
      setError("Failed to apply forgiveness. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function decline() {
    try {
      setLoading(true);
      setError(null);
      await api.post("/api/streak/forgiveness/decline");
      onDecision();
    } catch (err) {
      setError("Failed to reset streak. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-yellow-900/40 border border-yellow-600 rounded-xl p-4 space-y-3">
      {/* TEXT */}
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-yellow-300">
            ⚠ You missed {missedDays} day{missedDays !== 1 && "s"}
          </p>

          {/* INFO TOOLTIP */}
          <div className="relative">
            <span
              className="text-xs text-gray-400 cursor-pointer hover:text-gray-200 border border-gray-500 rounded-full px-1.5 py-0.5"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ?
            </span>
            {showTooltip && (
              <div className="absolute left-0 top-6 z-20 w-72 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-300 shadow-xl">
                <p className="font-semibold text-gray-200 mb-1">What is Forgiveness?</p>
                <p className="mb-2">
                  Forgiveness lets you bridge a missed day without losing your streak.
                </p>
                <p className="font-semibold text-gray-200 mb-1">Use Forgiveness</p>
                <p className="mb-2">Your streak continues as if you didn't miss the day. Uses 1 forgiveness token.</p>
                <p className="font-semibold text-gray-200 mb-1">Reset Streak</p>
                <p>Decline forgiveness and start a new streak from today. Your longest streak is preserved.</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-300 mt-1">
          You can use forgiveness to keep your streak alive.
        </p>

        <p className="text-sm mt-1">
          Forgiveness left:{" "}
          <span className="font-semibold text-yellow-400">
            {forgivenessLeft}
          </span>
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={accept}
          disabled={loading || forgivenessLeft === 0}
          className={`px-4 py-2 rounded font-semibold ${
            loading || forgivenessLeft === 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-400 text-black"
          }`}
        >
          Use Forgiveness
        </button>

        <button
          onClick={decline}
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          Reset Streak
        </button>
      </div>
    </div>
  );
}
