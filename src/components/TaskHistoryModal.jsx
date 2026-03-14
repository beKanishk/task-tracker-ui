import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { DEMO_TASK_HISTORY } from "../data/demoData";

export default function TaskHistoryModal({ task, onClose }) {
  const { demoMode } = useAuth();
  const [history, setHistory] = useState(demoMode ? (DEMO_TASK_HISTORY[task.id] ?? []) : []);
  const [loading, setLoading] = useState(!demoMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (demoMode) return;
    api
      .get(`/api/progress/task/${task.id}/history`)
      .then((res) => setHistory(res.data))
      .catch(() => setError("Failed to load history."))
      .finally(() => setLoading(false));
  }, [task.id]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{task.title} — History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && !error && history.length === 0 && (
          <p className="text-gray-400 text-sm">No progress recorded yet.</p>
        )}

        {!loading && !error && history.length > 0 && (
          <ul className="space-y-2 overflow-y-auto flex-1">
            {history.map((entry, i) => (
              <li
                key={i}
                className="bg-gray-700 rounded p-3 flex justify-between items-center text-sm"
              >
                <span className="text-gray-300">{entry.date}</span>
                <span className="text-green-400 font-medium">
                  {task.taskType === "BOOLEAN"
                    ? entry.completedToday ? "Done" : "Not done"
                    : `${entry.valueCompleted ?? 0} / ${task.targetValue} ${task.unit ?? ""}`}
                </span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
