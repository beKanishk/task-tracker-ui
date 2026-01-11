import { useState } from "react";
import api from "../api/axios";

export default function QuickLogModal({ task, onClose, onSuccess }) {
  const [value, setValue] = useState("");

  const submit = async () => {
    await api.post("/api/progress/log", {
      taskId: task.id,
      valueCompleted: task.taskType === "BOOLEAN" ? null : Number(value),
      completed: true,
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded w-80">
        <h3 className="font-bold mb-4">{task.title}</h3>

        {task.taskType === "QUANTITATIVE" && (
          <input
            className="w-full p-2 mb-4 bg-gray-700 rounded"
            placeholder={`Enter ${task.unit || "value"}`}
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-green-600 px-3 py-1 rounded"
            onClick={submit}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
