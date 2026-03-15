import { canLog } from "../utils/taskUtils";
import { MagicCard } from "./magicui/magic-card";
import { ShimmerButton } from "./magicui/shimmer-button";

export default function TaskCard({ task, onLog, onUndo }) {
  const logAllowed = canLog(task);

  return (
    <MagicCard
      gradientColor="#22c55e18"
      className={`rounded-xl border transition-all duration-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 ${
        !logAllowed ? "opacity-80 border-emerald-500/35" : "border-surface-border"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            {/* TITLE */}
            <p className="font-semibold text-white">{task.title}</p>

            {/* DESCRIPTION */}
            {task.description && (
              <p className="text-sm text-gray-400 mt-1">
                {task.description}
              </p>
            )}

            {/* BOOLEAN STATUS */}
            {task.taskType === "BOOLEAN" && task.completedToday && (
              <p className="text-xs text-emerald-400 mt-2 font-medium">
                ✔ Completed today
              </p>
            )}

            {/* QUANTITATIVE DETAILS */}
            {task.taskType === "QUANTITATIVE" && (
              <p className="text-xs text-gray-500 mt-2">
                Progress:{" "}
                <span className="text-gray-300 font-medium">
                  {task.progressPercent ?? 0}%
                </span>

                {task.target && (
                  <>
                    {" "}
                    • Target:{" "}
                    <span className="text-gray-300 font-medium">
                      {task.target} {task.unit ?? ""}
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* ACTION */}
          {logAllowed ? (
            <ShimmerButton
              onClick={() => onLog(task)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
              shimmerDuration="2s"
            >
              Log
            </ShimmerButton>
          ) : (
            <button
              disabled
              className="bg-surface-elevated border border-surface-border cursor-not-allowed px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 opacity-60 shrink-0"
            >
              Logged
            </button>
          )}
        </div>
      </div>
    </MagicCard>
  );
}
