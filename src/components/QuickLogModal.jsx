import { useState } from "react";
import api from "../api/axios";
import { canLog } from "../utils/taskUtils";

export default function QuickLogModal({ task, onClose, onSuccess }) {
  const [value, setValue] = useState("");

  const isBooleanDone =
    task.taskType === "BOOLEAN" && task.completedToday;

  const isQuantDone =
    task.taskType === "QUANTITATIVE" && task.progressPercent === 100;

  const isDone = isBooleanDone || isQuantDone;

  const submit = async () => {
    if (!canLog(task)) return;

    await api.post("/api/progress/log", {
      taskId: task.id,
      valueCompleted:
        task.taskType === "BOOLEAN" ? null : Number(value),
      completed: true,
    });

    onSuccess();
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded w-80">
        <h3 className="font-bold mb-4">{task.title}</h3>

        {task.taskType === "QUANTITATIVE" && !isDone && (
          <input
            className="w-full p-2 mb-4 bg-gray-700 rounded"
            placeholder="Enter value"
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        {isDone && (
          <p className="text-green-400 text-sm mb-3">
            ✔ Task already completed today
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button
            disabled={isDone}
            onClick={submit}
            className={`px-3 py-1 rounded font-semibold
              ${
                isDone
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
              }
            `}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
