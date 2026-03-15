import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import MiniHeatmap from "../components/MiniHeatmap";
import QuickLogModal from "../components/QuickLogModal";
import TodayTaskList from "../components/TodayTaskList";
import CompletionBanner from "../components/CompletionBanner";
import StreakCard from "../components/StreakCard";
import ForgivenessBanner from "../components/ForgivenessBanner";
import FatigueCard from "../components/FatigueCard";
import FatigueWarning from "../components/FatigueWarning";
import DemoAuthModal from "../components/DemoAuthModal";

import { BlurFade } from "../components/magicui/blur-fade";
import { MagicCard } from "../components/magicui/magic-card";
import { NumberTicker } from "../components/magicui/number-ticker";
import { ShimmerButton } from "../components/magicui/shimmer-button";
import { AnimatedShinyText } from "../components/magicui/animated-shiny-text";

import { canLog } from "../utils/taskUtils";
import {
  DEMO_USER,
  DEMO_SUMMARY,
  DEMO_STREAK,
  DEMO_FATIGUE,
  DEMO_HEATMAP_7,
  DEMO_TODAY_TASKS,
} from "../data/demoData";

/* ================= HELPERS ================= */

function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const { demoMode } = useAuth();

  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [fatigue, setFatigue] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fatigueLoading, setFatigueLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    if (demoMode) {
      loadDemoData();
    } else {
      loadDashboard();
    }
  }, [demoMode]);

  function loadDemoData() {
    setUser(DEMO_USER);
    setSummary(DEMO_SUMMARY);
    setStreak(DEMO_STREAK);
    setFatigue(DEMO_FATIGUE);
    setHeatmap(DEMO_HEATMAP_7);
    setTodayTasks([
      ...DEMO_TODAY_TASKS.inProgressToday,
      ...DEMO_TODAY_TASKS.completedToday,
    ]);
    setLoading(false);
  }

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
        fatigueRes,
      ] = await Promise.all([
        api.get("/api/summary/today"),
        api.get("/api/tasks/state/today"),
        api.get(`/api/heatmap/month?year=${year}&month=${month}`),
        api.get("/api/streak"),
        api.get("/api/users/me"),
        api.get("/api/fatigue"),
      ]);

      setSummary(summaryRes.data);
      setStreak(streakRes.data);
      setUser(userRes.data);
      setFatigue(fatigueRes.data);

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
    if (demoMode) return;
    setLoading(true);
    await loadDashboard();
  }

  async function recomputeFatigue() {
    if (demoMode) { setShowDemoModal(true); return; }
    try {
      setFatigueLoading(true);
      const res = await api.post("/api/fatigue/recompute");
      setFatigue(res.data);
    } catch (err) {
      console.error("Failed to recompute fatigue", err);
    } finally {
      setFatigueLoading(false);
    }
  }

  async function undoTask(task) {
    if (demoMode) { setShowDemoModal(true); return; }
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

  if (!summary || !streak || !user || !fatigue) {
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

  const forgivenessLeft =
    streak.forgivenessAllowed - streak.forgivenessUsed;

  /* ================= RENDER ================= */

  return (
    <div className="p-4 md:p-6 text-white space-y-6">

      {/* ================= HEADER ================= */}
      <BlurFade delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <AnimatedShinyText className="text-white text-2xl font-bold">
                Welcome back{" "}
              </AnimatedShinyText>
              <span className="text-green-400">{user.name}</span> 👋
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Forgiveness left:{" "}
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
              </span>{" "}
              / {streak.forgivenessAllowed}
            </p>
          </div>

          <ShimmerButton
            onClick={() => demoMode ? setShowDemoModal(true) : (window.location.href = "/tasks/new")}
            className="px-4 py-2 rounded-lg text-sm font-semibold shrink-0"
          >
            + Add Task
          </ShimmerButton>
        </div>
      </BlurFade>

      {/* ================= FORGIVENESS ================= */}
      {forgivenessPending && (
        <BlurFade delay={0.1}>
          <ForgivenessBanner
            missedDays={missedDays}
            forgivenessLeft={forgivenessLeft}
            onDecision={refreshDashboard}
            onDemoAction={() => setShowDemoModal(true)}
          />
        </BlurFade>
      )}

      {/* ================= FATIGUE WARNING ================= */}
      <BlurFade delay={0.12}>
        <FatigueWarning fatigue={fatigue} />
      </BlurFade>

      {/* ================= STATS + FATIGUE + STREAK ================= */}
      <BlurFade delay={0.15} className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          <StatCard label="Completed" value={summary.tasksCompleted} color="green" />
          <StatCard label="In Progress" value={summary.tasksInProgress} color="yellow" />
          <StatCard label="Avg Progress" value={summary.totalProgressPercent} suffix="%" color="blue" />

          <div className="lg:col-span-2">
            <FatigueCard
              fatigue={fatigue}
              onRecompute={recomputeFatigue}
              loading={fatigueLoading}
            />
          </div>

          <div className="lg:col-span-2">
            <StreakCard streak={streak} />
          </div>
        </div>
      </BlurFade>

      {/* ================= HEATMAP ================= */}
      <BlurFade delay={0.2}>
        <div className="bg-surface-card p-4 rounded-xl border border-surface-border shadow-card">
          <MiniHeatmap activity={heatmap} />
        </div>
      </BlurFade>

      {/* ================= TODAY TASKS ================= */}
      <BlurFade delay={0.25}>
        <TodayTaskList
          tasks={todayTasks}
          onLog={(task) => {
            if (demoMode) { setShowDemoModal(true); return; }
            if (!canLog(task)) return;
            setActiveTask(task);
          }}
          onUndo={undoTask}
        />
      </BlurFade>

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

      {/* ================= DEMO AUTH MODAL ================= */}
      {showDemoModal && (
        <DemoAuthModal onClose={() => setShowDemoModal(false)} />
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ label, value, color, suffix = "" }) {
  const colors = {
    green:  "text-green-400",
    yellow: "text-yellow-400",
    blue:   "text-blue-400",
    red:    "text-red-400",
  };

  const gradients = {
    green:  "bg-gradient-card-green",
    yellow: "bg-gradient-card-amber",
    blue:   "bg-gradient-card-blue",
    red:    "",
  };

  return (
    <MagicCard
      gradientColor={
        color === "green" ? "#22c55e22" :
        color === "yellow" ? "#f59e0b22" :
        "#6366f122"
      }
      className={`${gradients[color]} bg-surface-card px-4 py-3 rounded-xl border border-surface-border shadow-card h-[90px] flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200`}
    >
      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
        {label}
      </p>
      <p className={`text-xl font-semibold tabular-nums ${colors[color]}`}>
        <NumberTicker value={typeof value === "number" ? value : 0} />
        {suffix}
      </p>
    </MagicCard>
  );
}
