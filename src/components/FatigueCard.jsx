import { useState } from "react";
import FatigueWhyModal from "./FatigueWhyModal";
import { BorderBeam } from "./magicui/border-beam";

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
    NONE:   "text-green-400",
    LOW:    "text-yellow-400",
    MEDIUM: "text-orange-400",
    HIGH:   "text-red-400",
  }[level] ?? "text-gray-100";

  const levelGradient = {
    NONE:   "bg-[linear-gradient(to_bottom,rgba(34,197,94,0.06),transparent_40%)]",
    LOW:    "bg-[linear-gradient(to_bottom,rgba(234,179,8,0.06),transparent_40%)]",
    MEDIUM: "bg-[linear-gradient(to_bottom,rgba(249,115,22,0.07),transparent_40%)]",
    HIGH:   "bg-[linear-gradient(to_bottom,rgba(239,68,68,0.08),transparent_40%)]",
  }[level] ?? "";

  const beamColor = {
    NONE:   "#22c55e",
    LOW:    "#eab308",
    MEDIUM: "#f97316",
    HIGH:   "#ef4444",
  }[level] ?? "#6366f1";

  const evaluatedLabel = formatEvaluatedOn(evaluatedOn);

  return (
    <div className={`relative ${levelGradient} bg-surface-card p-4 rounded-xl border border-surface-border shadow-card h-[180px] overflow-hidden`}>
      <BorderBeam size={200} duration={8} colorFrom={beamColor} colorTo="#13131f" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Fatigue Level</p>

          <span
            className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition-colors"
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
        <div className="pt-2 border-t border-surface-border flex justify-end">
          <button
            onClick={onRecompute}
            disabled={loading}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${
              loading
                ? "bg-surface-elevated border-surface-border text-gray-600 cursor-not-allowed"
                : "bg-surface-elevated border-surface-border text-gray-400 hover:bg-surface-hover hover:text-gray-200"
            }`}
          >
            {loading ? "Recomputing…" : "Recompute"}
          </button>
        </div>
      </div>

      {/* TOOLTIP */}
      {showTooltip && !showModal && (
        <div className="absolute top-10 right-4 z-20 w-64 bg-surface-elevated border border-[#2a2a42] rounded-xl p-3 text-xs text-gray-300 shadow-modal">
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
