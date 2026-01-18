import { useState } from "react";
import api from "../api/axios";

export default function EditTaskModal({ task, onClose, onSuccess }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [targetValue, setTargetValue] = useState(task.targetValue || "");

  async function handleSave() {
    await api.put("/api/tasks", {
      taskId: task.id,
      title,
      description,
      targetValue:
        task.taskType === "QUANTITATIVE"
          ? Number(targetValue)
          : null,
    });

    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-xl font-bold">Edit Task</h2>

        <input
          className="w-full bg-gray-800 p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="w-full bg-gray-800 p-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {task.taskType === "QUANTITATIVE" && (
          <input
            type="number"
            className="w-full bg-gray-800 p-2 rounded"
            value={targetValue}
            onChange={e => setTargetValue(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-600 rounded font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
