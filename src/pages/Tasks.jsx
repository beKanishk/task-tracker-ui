import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EditTaskModal from "../components/EditTaskModal";
import TaskHistoryModal from "../components/TaskHistoryModal";
import DemoAuthModal from "../components/DemoAuthModal";
import { DEMO_TASKS } from "../data/demoData";
import { BlurFade } from "../components/magicui/blur-fade";
import { ShimmerButton } from "../components/magicui/shimmer-button";

const STATUS_TABS = ["ALL", "ACTIVE", "PAUSED", "COMPLETED"];

export default function Tasks() {
  const { demoMode } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [historyTask, setHistoryTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    if (demoMode) {
      setTasks(DEMO_TASKS);
      setLoading(false);
    } else {
      loadTasks();
    }
  }, [demoMode]);

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
    if (demoMode) { setShowDemoModal(true); return; }
    await api.delete(`/api/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const pauseTask = async (taskId) => {
    if (demoMode) { setShowDemoModal(true); return; }
    const res = await api.put(`/api/tasks/state/${taskId}/status?status=PAUSED`);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
  };

  const resumeTask = async (taskId) => {
    if (demoMode) { setShowDemoModal(true); return; }
    const res = await api.put(`/api/tasks/state/${taskId}/status?status=ACTIVE`);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
  };

  const completeTask = async (taskId) => {
    if (demoMode) { setShowDemoModal(true); return; }
    const res = await api.put(`/api/tasks/state/${taskId}/status?status=COMPLETED`);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
  };

  const filtered = tasks.filter((t) => {
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6">
      <BlurFade delay={0.05}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
          {demoMode ? (
            <ShimmerButton
              onClick={() => setShowDemoModal(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
            >
              + New Task
            </ShimmerButton>
          ) : (
            <Link to="/tasks/new">
              <ShimmerButton className="px-4 py-2 rounded-lg text-sm font-semibold">
                + New Task
              </ShimmerButton>
            </Link>
          )}
        </div>
      </BlurFade>

      <BlurFade delay={0.1}>
        {/* SEARCH */}
        <input
          className="w-full px-3 py-2.5 mb-4 bg-surface-input border border-surface-border rounded-lg text-sm placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all duration-150"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* STATUS FILTER TABS */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                statusFilter === tab
                  ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-glow-green"
                  : "bg-surface-elevated border border-surface-border text-gray-400 hover:text-white hover:bg-surface-hover"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </BlurFade>

      {/* STATES */}
      {loading && (
        <p className="text-gray-400 text-sm">Loading tasks…</p>
      )}

      {!loading && error && (
        <div className="bg-red-500/8 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-3">No tasks yet</p>
          <Link to="/tasks/new">
            <ShimmerButton className="px-5 py-2 rounded-lg text-sm font-semibold">
              Create your first task
            </ShimmerButton>
          </Link>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No tasks match the current filter.</p>
      )}

      {/* TASK LIST */}
      <div className="space-y-3">
        {filtered.map((task, index) => (
          <BlurFade key={task.id} delay={0.05 * index}>
            <div
              className={`bg-surface-card p-4 rounded-xl border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 ${
                task.status === "PAUSED"
                  ? "border-amber-500/40 opacity-80"
                  : task.status === "COMPLETED"
                  ? "border-emerald-600/40 opacity-70"
                  : "border-surface-border"
              }`}
            >
              {/* LEFT */}
              <div className="mb-2">
                <p className="font-semibold text-white">{task.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {task.taskType} • {task.status}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs font-medium">
                <button
                  onClick={() => setHistoryTask(task)}
                  className="text-gray-500 hover:text-slate-200 transition-colors"
                >
                  History
                </button>

                {task.status !== "COMPLETED" && (
                  <button
                    onClick={() => demoMode ? setShowDemoModal(true) : setEditingTask(task)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Edit
                  </button>
                )}

                {task.status === "ACTIVE" && (
                  <button
                    onClick={() => pauseTask(task.id)}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Pause
                  </button>
                )}

                {task.status === "PAUSED" && (
                  <button
                    onClick={() => resumeTask(task.id)}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Resume
                  </button>
                )}

                {task.status !== "COMPLETED" && (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500/80 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </BlurFade>
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

      {/* DEMO AUTH MODAL */}
      {showDemoModal && (
        <DemoAuthModal onClose={() => setShowDemoModal(false)} />
      )}
    </div>
  );
}
