import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateTaskPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("BOOLEAN");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description: description.trim() || null,
      taskType,
      targetValue:
        taskType === "QUANTITATIVE" ? Number(targetValue) : null,
      unit: taskType === "QUANTITATIVE" ? unit : null,
    };

    try {
      await api.post("/api/tasks", payload);
      navigate("/tasks");
    } catch (err) {
      console.error("Task creation failed", err);
      alert("Failed to create task");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Task</h2>

      <form
        onSubmit={submit}
        className="bg-gray-800 p-6 rounded-xl space-y-4 border border-gray-700"
      >
        {/* TITLE */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Title
          </label>
          <input
            required
            className="w-full p-2 bg-gray-700 rounded"
            placeholder="e.g. Go to gym"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Description (optional)
          </label>
          <textarea
            rows={3}
            className="w-full p-2 bg-gray-700 rounded resize-none"
            placeholder="Why this task matters, notes, rules…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* TASK TYPE */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Task Type
          </label>
          <select
            className="w-full p-2 bg-gray-700 rounded"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
          >
            <option value="BOOLEAN">Boolean (Yes / No)</option>
            <option value="QUANTITATIVE">Quantitative</option>
          </select>
        </div>

        {/* QUANTITATIVE FIELDS */}
        {taskType === "QUANTITATIVE" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Target Value
              </label>
              <input
                required
                type="number"
                min="1"
                className="w-full p-2 bg-gray-700 rounded"
                placeholder="e.g. 30"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Unit
              </label>
              <input
                className="w-full p-2 bg-gray-700 rounded"
                placeholder="e.g. reps, km, minutes"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-semibold"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
