import { useState } from "react";
import api from "../api/axios";
import { canLog } from "../utils/taskUtils";

export default function QuickLogModal({ task, onClose, onSuccess }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isBooleanDone = task.taskType === "BOOLEAN" && task.completedToday;
  const isQuantDone = task.taskType === "QUANTITATIVE" && task.progressPercent === 100;
  const isDone = isBooleanDone || isQuantDone;

  const submit = async () => {
    if (!canLog(task)) return;

    if (task.taskType === "QUANTITATIVE") {
      const n = Number(value);
      if (!value || !Number.isFinite(n) || n <= 0) {
        setError("Enter a valid value greater than 0");
        return;
      }
    }

    setSubmitting(true);
    setError("");
    try {
      await api.post("/api/progress/log", {
        taskId: task.id,
        valueCompleted: task.taskType === "BOOLEAN" ? null : Number(value),
        completed: true,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log progress.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded w-80">
        <h3 className="font-bold mb-4">{task.title}</h3>

        {task.taskType === "QUANTITATIVE" && !isDone && (
          <input
            type="number"
            min="0"
            className={`w-full p-2 mb-2 bg-gray-700 rounded border ${
              error ? "border-red-500" : "border-transparent"
            }`}
            placeholder="Enter value"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
          />
        )}

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        {isDone && (
          <p className="text-green-400 text-sm mb-3">
            ✔ Task already completed today
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Cancel
          </button>

          <button
            disabled={isDone || submitting}
            onClick={submit}
            className={`px-3 py-1 rounded font-semibold ${
              isDone || submitting
                ? "bg-gray-600 cursor-not-allowed opacity-60"
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            {submitting ? "Saving…" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
