import { useState } from "react";
import api from "../api/axios";
import { canLog } from "../utils/taskUtils";
import { ShimmerButton } from "./magicui/shimmer-button";

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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-[#2a2a42] rounded-2xl p-6 w-full max-w-xs shadow-modal">
        <h3 className="font-bold tracking-tight mb-4 text-white">{task.title}</h3>

        {task.taskType === "QUANTITATIVE" && !isDone && (
          <input
            type="number"
            min="0"
            className={`w-full px-3 py-2.5 mb-2 bg-surface-input rounded-lg border text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all ${
              error ? "border-red-500" : "border-surface-border focus:border-green-500/60"
            }`}
            placeholder="Enter value"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
          />
        )}

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        {isDone && (
          <p className="text-emerald-400 text-sm mb-3 font-medium">
            ✔ Task already completed today
          </p>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Cancel
          </button>

          {!isDone ? (
            <ShimmerButton
              disabled={submitting}
              onClick={submit}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold"
            >
              {submitting ? "Saving…" : "Done"}
            </ShimmerButton>
          ) : (
            <button
              disabled
              className="bg-surface-elevated border border-surface-border px-4 py-1.5 rounded-lg text-sm opacity-50 cursor-not-allowed"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
