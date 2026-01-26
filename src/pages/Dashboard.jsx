import { useEffect, useState } from "react";
import api from "../api/axios";

import MiniHeatmap from "../components/MiniHeatmap";
import QuickLogModal from "../components/QuickLogModal";
import TodayTaskList from "../components/TodayTaskList";
import CompletionBanner from "../components/CompletionBanner";
import StreakCard from "../components/StreakCard";
import ForgivenessBanner from "../components/ForgivenessBanner";

import { canLog } from "../utils/taskUtils";

/* ================= HELPERS ================= */

function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const [user, setUser] = useState(null);
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
        userRes,
      ] = await Promise.all([
        api.get("/api/summary/today"),
        api.get("/api/tasks/state/today"),
        api.get(`/api/heatmap/month?year=${year}&month=${month}`),
        api.get("/api/streak"),
        api.get("/api/users/me"), // ✅ USER
      ]);

      setSummary(summaryRes.data);
      setStreak(streakRes.data);
      setUser(userRes.data);

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

  /* ================= LOADING / ERROR ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-400 animate-pulse">
        Loading dashboard…
      </div>
    );
  }

  if (!summary || !streak || !user) {
    return (
      <div className="p-6 text-red-400">
        Failed to load dashboard
      </div>
    );
  }

  /* ================= FORGIVENESS STATE ================= */

  const today = new Date();

  const missedDays =
    streak.lastActiveDate
      ? daysBetween(streak.lastActiveDate, today) - 1
      : 0;

  const forgivenessPending =
    missedDays > 0 &&
    streak.forgivenessAllowed > 0 &&
    streak.forgivenessUsed + missedDays <= streak.forgivenessAllowed;

  const forgivenessUsed = streak.forgivenessUsed > 0;
  const forgivenessLeft =
    streak.forgivenessAllowed - streak.forgivenessUsed;

  const streakAtRisk =
    missedDays === 1 && !forgivenessPending;

  /* ================= RENDER ================= */

  return (
    <div className="p-6 text-white space-y-8">

      {/* ================= HEADER ================= */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

    {/* LEFT */}
    <div>
      <h1 className="text-2xl font-bold">
        Welcome back{" "}
        <span className="text-green-400">{user.name}</span> 👋
      </h1>

      <p className="mt-1 text-sm">
        <span className="text-gray-400">Forgiveness left:</span>{" "}
        <span
          className={
            forgivenessLeft === 0
              ? "text-red-400 font-semibold"
              : forgivenessLeft === 1
              ? "text-yellow-400 font-semibold"
              : "text-green-400 font-semibold"
          }
        >
          {forgivenessLeft}
        </span>
        <span className="text-gray-400">
          {" "}
          / {streak.forgivenessAllowed}
        </span>
      </p>

      {forgivenessLeft === 0 && (
        <p className="text-red-400 text-xs mt-1">
          🚨 Next missed day will break your streak
        </p>
      )}
    </div>

    {/* RIGHT */}
    <button
      onClick={() => window.location.href = "/tasks/new"}
      className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold self-start sm:self-center"
    >
      + Add Task
    </button>
  </div>



      {/* ================= FORGIVENESS DECISION ================= */}
      {forgivenessPending && (
        <ForgivenessBanner onDecision={refreshDashboard} />
      )}

      {/* ================= STATS + STREAK ================= */}
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

        <div className="sm:col-span-2">
          <StreakCard streak={streak} />
        </div>
      </div>

      {/* ================= HEATMAP ================= */}
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <MiniHeatmap activity={heatmap} />

        <div className="flex gap-4 text-xs text-gray-400 mt-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded-sm" />
            Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-400 rounded-sm" />
            Forgiven
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-600 rounded-sm" />
            Missed
          </span>
        </div>
      </div>

      {/* ================= TODAY TASKS ================= */}
      <TodayTaskList
        tasks={todayTasks}
        onLog={(task) => {
          if (!canLog(task)) return;
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

      {/* ================= QUICK LOG MODAL ================= */}
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

/* ================= STAT CARD ================= */

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
