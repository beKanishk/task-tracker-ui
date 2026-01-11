import { useEffect, useState } from "react";
import api from "../api/axios";
import MiniHeatmap from "../components/MiniHeatmap";
import QuickLogModal from "../components/QuickLogModal";
import TodayTaskList from "../components/TodayTaskList";
import CompletionBanner from "../components/CompletionBanner";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryRes, taskStateRes, heatmapRes] = await Promise.all([
          api.get("/api/summary/today"),
          api.get("/api/tasks/state/today"),
          api.get(`/api/heatmap/month?year=2026&month=1`),
        ]);

        setSummary(summaryRes.data);

        const allTodayTasks = [
          ...(taskStateRes.data.inProgressToday || []),
          ...(taskStateRes.data.completedToday || []),
        ];

        setTodayTasks(allTodayTasks);
        setHeatmap(heatmapRes.data.activity.slice(-7));
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

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
    return <div className="p-6 text-gray-400 animate-pulse">Loading dashboard…</div>;
  }

  if (!summary) {
    return <div className="p-6 text-red-400">Failed to load dashboard</div>;
  }

  const streak = calculateStreak(heatmap);

  return (
    <div className="p-6 text-white space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back <span className="text-green-400">Kanishk</span> 👋
        </h1>
        <p className="text-gray-400 mt-1">
          🔥 {streak}-day streak — keep going
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Completed" value={summary.tasksCompleted} color="green" />
        <StatCard label="In Progress" value={summary.tasksInProgress} color="yellow" />
        <StatCard label="Avg Progress" value={`${summary.totalProgressPercent}%`} color="blue" />
        <StatCard label="Streak" value={`🔥 ${streak}`} color="red" />
      </div>

      {/* HEATMAP */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <MiniHeatmap activity={heatmap} />
      </div>

      {/* TODAY TASKS */}
      <TodayTaskList
        tasks={todayTasks}
        onLog={(task) => setActiveTask(task)}
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
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}

/* ===== HELPERS ===== */

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
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

function calculateStreak(activity) {
  let streak = 0;
  for (let i = activity.length - 1; i >= 0; i--) {
    if (activity[i] > 0) streak++;
    else break;
  }
  return streak;
}
