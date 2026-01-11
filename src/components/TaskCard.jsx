import { CheckCircle } from "lucide-react";

export default function TaskCard({ task, onLog, onUndo }) {
  const isCompleted = task.completedToday;

  return (
    <div
      className={`bg-gray-800 p-4 rounded-xl border transition
        ${isCompleted ? "border-green-500/40 opacity-80" : "border-gray-700"}
      `}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{task.title}</p>

          {task.progressPercent != null && (
            <p className="text-sm text-gray-400 mt-1">
              Progress: {task.progressPercent}%
            </p>
          )}
        </div>

        {!isCompleted ? (
          <button
            onClick={() => onLog(task)}
            className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm font-semibold"
          >
            Log
          </button>
        ) : (
          <button
            onClick={() => onUndo(task)}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Undo
          </button>
        )}
      </div>
    </div>
  );
}
