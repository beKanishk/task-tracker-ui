import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/api/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Tasks</h2>

      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between"
          >
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-400">
                {task.taskType} • {task.status}
              </p>
            </div>

            <div className="space-x-2">
              <button className="text-yellow-400 hover:underline">
                Pause
              </button>
              <button className="text-red-400 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
