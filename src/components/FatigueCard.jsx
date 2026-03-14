import { useState } from "react";
import FatigueWhyModal from "./FatigueWhyModal";

function formatEvaluatedOn(dateStr) {
  if (!dateStr) return null;
  const evaluated = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  evaluated.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - evaluated) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

export default function FatigueCard({ fatigue, onRecompute, loading }) {
  const { level, fatigueScore, lowEffortDays, evaluatedOn } = fatigue;

  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const levelColor = {
    NONE: "text-green-400",
    LOW: "text-yellow-400",
    MEDIUM: "text-orange-400",
    HIGH: "text-red-400",
  }[level];

  const evaluatedLabel = formatEvaluatedOn(evaluatedOn);

  return (
    <div className="relative bg-gray-800 p-4 rounded-xl border border-gray-700 h-[180px] flex flex-col justify-between">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">Fatigue Level</p>

        <span
          className="text-xs text-gray-500 cursor-pointer hover:text-gray-300"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowModal(true)}
        >
          Why?
        </span>
      </div>

      {/* LEVEL */}
      <p className={`text-xl font-bold ${levelColor}`}>
        {level}
      </p>

      {/* DETAILS */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>Score: {fatigueScore}</p>
        <p>Low-effort days: {lowEffortDays}</p>
        {evaluatedLabel && (
          <p className="text-gray-500">Evaluated: {evaluatedLabel}</p>
        )}
      </div>

      {/* ACTION */}
      <div className="pt-2 border-t border-gray-700 flex justify-end">
        <button
          onClick={onRecompute}
          disabled={loading}
          className={`text-xs px-3 py-1.5 rounded-md transition
            ${
              loading
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }
          `}
        >
          {loading ? "Recomputing…" : "Recompute"}
        </button>
      </div>

      {/* TOOLTIP */}
      {showTooltip && !showModal && (
        <div className="absolute top-10 right-4 z-20 w-64 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-300 shadow-xl">
          <p className="font-semibold text-gray-200 mb-1">
            Fatigue detected due to:
          </p>
          <p>• {lowEffortDays} low-effort days</p>
          <p className="mt-2 text-gray-400">
            Click to see detailed explanation
          </p>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <FatigueWhyModal
          fatigue={fatigue}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
