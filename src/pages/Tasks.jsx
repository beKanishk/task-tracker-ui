import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import EditTaskModal from "../components/EditTaskModal";
import TaskHistoryModal from "../components/TaskHistoryModal";

const STATUS_TABS = ["ALL", "ACTIVE", "PAUSED", "COMPLETED"];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [historyTask, setHistoryTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data);
    } catch {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/api/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const pauseTask = async (taskId) => {
    const res = await api.put(`/api/tasks/state/${taskId}/status?status=PAUSED`);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
  };

  const resumeTask = async (taskId) => {
    const res = await api.put(`/api/tasks/state/${taskId}/status?status=ACTIVE`);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
  };

  const filtered = tasks.filter((t) => {
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Tasks</h2>
        <Link
          to="/tasks/new"
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-semibold text-sm"
        >
          + New Task
        </Link>
      </div>

      {/* SEARCH */}
      <input
        className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded text-sm placeholder-gray-500"
        placeholder="Search tasks…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* STATUS FILTER TABS */}
      <div className="flex gap-2 mb-5">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              statusFilter === tab
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* STATES */}
      {loading && (
        <p className="text-gray-400 text-sm">Loading tasks…</p>
      )}

      {!loading && error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-3">No tasks yet</p>
          <Link
            to="/tasks/new"
            className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded font-semibold text-sm text-white"
          >
            Create your first task
          </Link>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No tasks match the current filter.</p>
      )}

      {/* TASK LIST */}
      <div className="space-y-3">
        {filtered.map((task) => (
          <div
            key={task.id}
            className={`bg-gray-800 p-4 rounded-xl border flex justify-between items-center ${
              task.status === "PAUSED"
                ? "border-yellow-500/40 opacity-80"
                : task.status === "COMPLETED"
                ? "border-green-700/40 opacity-70"
                : "border-gray-700"
            }`}
          >
            {/* LEFT */}
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-gray-400">
                {task.taskType} • {task.status}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setHistoryTask(task)}
                className="text-gray-400 hover:text-white"
              >
                History
              </button>

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

      {/* HISTORY MODAL */}
      {historyTask && (
        <TaskHistoryModal
          task={historyTask}
          onClose={() => setHistoryTask(null)}
        />
      )}
    </div>
  );
}
