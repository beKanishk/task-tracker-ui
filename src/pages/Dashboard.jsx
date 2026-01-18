import { useEffect, useState } from "react";
import api from "../api/axios";
import MiniHeatmap from "../components/MiniHeatmap";
import QuickLogModal from "../components/QuickLogModal";
import TodayTaskList from "../components/TodayTaskList";
import CompletionBanner from "../components/CompletionBanner";
import StreakCard from "../components/StreakCard";
import { canLog } from "../utils/taskUtils";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const [
        summaryRes,
        taskStateRes,
        heatmapRes,
        streakRes,
      ] = await Promise.all([
        api.get("/api/summary/today"),
        api.get("/api/tasks/state/today"),
        api.get(`/api/heatmap/month?year=${year}&month=${month}`),
        api.get("/api/streak"), // ✅ NEW
      ]);

      setSummary(summaryRes.data);
      setStreak(streakRes.data);

      const allTodayTasks = [
        ...(taskStateRes.data.inProgressToday || []),
        ...(taskStateRes.data.completedToday || []),
      ];
      setTodayTasks(allTodayTasks);

      const todayIndex = new Date().getDate() - 1;
      const last7Days = heatmapRes.data.activity.slice(
        Math.max(0, todayIndex - 6),
        todayIndex + 1
      );
      setHeatmap(last7Days);

    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshDashboard() {
    setLoading(true);
    await loadDashboard();
  }

  async function undoTask(task) {
    try {
      await api.post("/api/progress/log", {
        taskId: task.id,
        completed: false,
        valueCompleted: task.valueCompleted ?? 0,
      });

      setTodayTasks(prev =>
        prev.map(t =>
          t.id === task.id
            ? { ...t, completedToday: false, progressPercent: null }
            : t
        )
      );
    } catch (err) {
      console.error("Undo failed", err);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-gray-400 animate-pulse">
        Loading dashboard…
      </div>
    );
  }

  if (!summary || !streak) {
    return (
      <div className="p-6 text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back <span className="text-green-400">Kanishk</span> 👋
        </h1>

        {streak.forgivenessUsed > 0 ? (
          <p className="text-yellow-400 mt-1 text-sm">
            ⚠️ Forgiveness used: {streak.forgivenessUsed} /{" "}
            {streak.forgivenessAllowed}
          </p>
        ) : (
          <p className="text-green-400 mt-1 text-sm">
            🏆 Perfect streak — no forgiveness used
          </p>
        )}
      </div>

      {/* STATS + STREAK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          label="Completed"
          value={summary.tasksCompleted}
          color="green"
        />

        <StatCard
          label="In Progress"
          value={summary.tasksInProgress}
          color="yellow"
        />

        <StatCard
          label="Avg Progress"
          value={`${summary.totalProgressPercent}%`}
          color="blue"
        />

        {/* STREAK CARD SPANS */}
        <div className="sm:col-span-2">
          <StreakCard streak={streak} />
        </div>
      </div>

      {/* HEATMAP */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <MiniHeatmap activity={heatmap} />
      </div>

      {/* TODAY TASKS */}
      <TodayTaskList
        tasks={todayTasks}
        onLog={(task) => {
          if (!canLog(task)) return; // 🔒 HARD BLOCK
          setActiveTask(task);
        }}
        onUndo={undoTask}
      />

      <CompletionBanner
        allCompleted={
          todayTasks.length > 0 &&
          todayTasks.every(t => t.completedToday)
        }
      />

      {/* QUICK LOG MODAL */}
      {activeTask && (
        <QuickLogModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onSuccess={refreshDashboard}
        />
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function StatCard({ label, value, color }) {
  const colors = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    red: "text-red-400",
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}
