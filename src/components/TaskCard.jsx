import { canLog } from "../utils/taskUtils";

export default function TaskCard({ task, onLog, onUndo }) {
  const logAllowed = canLog(task);

  return (
    <div
      className={`bg-gray-800 p-4 rounded-xl border transition
        ${!logAllowed ? "opacity-70 border-green-500/40" : "border-gray-700"}
      `}
    >
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
            <p className="text-sm text-green-400 mt-2">
              ✔ Completed today
            </p>
          )}

          {/* QUANTITATIVE DETAILS */}
          {task.taskType === "QUANTITATIVE" && (
            <p className="text-sm text-gray-400 mt-2">
              Progress:{" "}
              <span className="text-white font-medium">
                {task.progressPercent ?? 0}%
              </span>

              {task.target && (
                <>
                  {" "}
                  • Target:{" "}
                  <span className="text-white font-medium">
                    {task.target} {task.unit ?? ""}
                  </span>
                </>
              )}
            </p>
          )}
        </div>

        {/* ACTION */}
        {logAllowed ? (
          <button
            onClick={() => onLog(task)}
            className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm font-semibold"
          >
            Log
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-600 cursor-not-allowed px-3 py-1 rounded text-sm opacity-50"
          >
            Logged
          </button>
        )}
      </div>
    </div>
  );
}
