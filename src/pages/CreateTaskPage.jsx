import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateTaskPage() {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("BOOLEAN");
  const [targetValue, setTargetValue] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/api/tasks", {
      title,
      taskType,
      targetValue: taskType === "BOOLEAN" ? null : Number(targetValue),
    });

    navigate("/tasks");
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold mb-6">Create Task</h2>

      <input
        className="w-full p-2 mb-4 bg-gray-800 rounded"
        placeholder="Task title"
        onChange={e => setTitle(e.target.value)}
      />

      <select
        className="w-full p-2 mb-4 bg-gray-800 rounded"
        onChange={e => setTaskType(e.target.value)}
      >
        <option value="BOOLEAN">Boolean (Daily habit)</option>
        <option value="QUANTITATIVE">Quantitative</option>
      </select>

      {taskType === "QUANTITATIVE" && (
        <input
          className="w-full p-2 mb-4 bg-gray-800 rounded"
          placeholder="Target value"
          onChange={e => setTargetValue(e.target.value)}
        />
      )}

      <button
        onClick={submit}
        className="bg-green-600 px-4 py-2 rounded font-semibold"
      >
        Create Task
      </button>
    </div>
  );
}
