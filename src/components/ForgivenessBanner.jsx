import { useState } from "react";
import api from "../api/axios";

export default function ForgivenessBanner({
  missedDays,
  forgivenessLeft,
  onDecision,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        <p className="font-semibold text-yellow-300">
          ⚠ You missed {missedDays} day{missedDays !== 1 && "s"}
        </p>

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
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={accept}
          disabled={loading || forgivenessLeft === 0}
          className={`px-4 py-2 rounded font-semibold
            ${
              loading || forgivenessLeft === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }
          `}
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
