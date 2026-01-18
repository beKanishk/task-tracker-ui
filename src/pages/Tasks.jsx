import { useEffect, useState } from "react";
import api from "../api/axios";
import EditTaskModal from "../components/EditTaskModal";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await api.get("/api/tasks");
    setTasks(res.data);
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/api/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const pauseTask = async (taskId) => {
    const res = await api.put(
      `/api/tasks/state/${taskId}/status?status=PAUSED`
    );
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? res.data : t))
    );
  };

  const resumeTask = async (taskId) => {
    const res = await api.put(
      `/api/tasks/state/${taskId}/status?status=ACTIVE`
    );
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? res.data : t))
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Tasks</h2>

      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`bg-gray-800 p-4 rounded-xl border flex justify-between items-center
              ${
                task.status === "PAUSED"
                  ? "border-yellow-500/40 opacity-80"
                  : "border-gray-700"
              }
            `}
          >
            {/* LEFT */}
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-400">
                {task.taskType} • {task.status}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setEditingTask(task)}
                className="text-blue-400 hover:underline"
              >
                Edit
              </button>

              {task.status === "ACTIVE" && (
                <button
                  onClick={() => pauseTask(task.id)}
                  className="text-yellow-400 hover:underline"
                >
                  Pause
                </button>
              )}

              {task.status === "PAUSED" && (
                <button
                  onClick={() => resumeTask(task.id)}
                  className="text-green-400 hover:underline"
                >
                  Resume
                </button>
              )}

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={loadTasks}
        />
      )}
    </div>
  );
}
