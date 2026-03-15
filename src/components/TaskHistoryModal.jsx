import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { DEMO_TASK_HISTORY } from "../data/demoData";
import { BlurFade } from "./magicui/blur-fade";
import { MagicCard } from "./magicui/magic-card";
import { ShimmerButton } from "./magicui/shimmer-button";
import { BorderBeam } from "./magicui/border-beam";
import { SparklesText } from "./magicui/sparkles-text";
import { NumberTicker } from "./magicui/number-ticker";

export default function TaskHistoryModal({ task, onClose }) {
  const { demoMode } = useAuth();
  const [history, setHistory] = useState(demoMode ? (DEMO_TASK_HISTORY[task.id] ?? []) : []);
  const [loading, setLoading] = useState(!demoMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (demoMode) return;
    api
      .get(`/api/progress/task/${task.id}/history`)
      .then((res) => setHistory(res.data))
      .catch(() => setError("Failed to load history."))
      .finally(() => setLoading(false));
  }, [task.id]);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-surface-elevated border border-[#2a2a42] rounded-2xl p-6 w-full max-w-md max-h-[80vh] flex flex-col shadow-modal overflow-hidden">
        <BorderBeam size={250} duration={10} colorFrom="#22c55e" colorTo="#6366f1" />

        {/* HEADER */}
        <BlurFade delay={0.04}>
          <div className="relative z-10 flex justify-between items-start mb-1">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">
                Progress History
              </p>
              <SparklesText className="text-lg font-bold tracking-tight text-white">
                {task.title}
              </SparklesText>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-300 text-xl leading-none transition-colors p-1 mt-0.5"
            >
              &times;
            </button>
          </div>

          {!loading && !error && history.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-emerald-400 font-semibold">
                <NumberTicker value={history.length} />
              </span>{" "}
              {history.length === 1 ? "entry" : "entries"} recorded
            </p>
          )}

          <div className="border-t border-surface-border mt-3 mb-4" />
        </BlurFade>

        {/* STATES */}
        {loading && (
          <p className="text-gray-400 text-sm animate-pulse">Loading…</p>
        )}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {!loading && !error && history.length === 0 && (
          <BlurFade delay={0.08}>
            <div className="flex flex-col items-center py-8 text-gray-500">
              <span className="text-3xl mb-2">📭</span>
              <p className="text-sm">No progress recorded yet.</p>
            </div>
          </BlurFade>
        )}

        {/* HISTORY LIST */}
        {!loading && !error && history.length > 0 && (
          <ul className="space-y-2 overflow-y-auto flex-1 pr-1">
            {history.map((entry, i) => (
              <BlurFade key={i} delay={0.04 + 0.04 * i}>
                <MagicCard
                  gradientColor="#22c55e11"
                  className="bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 flex justify-between items-center text-sm shadow-card"
                >
                  <span className="text-gray-400 tabular-nums">{entry.date}</span>
                  <span className={`font-semibold ${
                    task.taskType === "BOOLEAN"
                      ? entry.completedToday ? "text-emerald-400" : "text-gray-500"
                      : "text-green-400"
                  }`}>
                    {task.taskType === "BOOLEAN"
                      ? entry.completedToday ? "✔ Done" : "✗ Not done"
                      : `${entry.valueCompleted ?? 0} / ${task.targetValue} ${task.unit ?? ""}`}
                  </span>
                </MagicCard>
              </BlurFade>
            ))}
          </ul>
        )}

        {/* CLOSE */}
        <BlurFade delay={0.1}>
          <div className="mt-4 flex justify-end">
            <ShimmerButton
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
            >
              Close
            </ShimmerButton>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
