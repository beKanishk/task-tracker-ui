import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import WeeklyHeatmap from "../components/heatmap/WeeklyHeatmap";
import MonthlyHeatmap from "../components/heatmap/MonthlyHeatMap";
import YearlyHeatmap from "../components/heatmap/YearlyHeatmap";
import HeatmapChart from "../components/heatmap/HeatmapChart";
import { DEMO_YEAR_DATA } from "../data/demoData";
import { BlurFade } from "../components/magicui/blur-fade";

const TABS = ["week", "month", "year", "graph"];

function generateEmptyMonth(year, month) {
  const days = new Date(year, month, 0).getDate();
  return Array(days).fill(0);
}

function normalizeYearHeatmap(raw, year) {
  const map = new Map();
  raw.forEach(m => map.set(m.month, m));

  return Array.from({ length: 12 }, (_, i) => ({
    year,
    month: i + 1,
    activity: map.get(i + 1)?.activity ?? generateEmptyMonth(year, i + 1),
  }));
}

const selectClass = "bg-surface-input border border-surface-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all";

export default function HeatmapPage() {
  const now = new Date();
  const { demoMode } = useAuth();

  const [activeTab, setActiveTab] = useState("week");
  const [graphMode, setGraphMode] = useState("week");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (demoMode) {
      setHeatmapData(DEMO_YEAR_DATA);
      setLoading(false);
    } else {
      loadHeatmap();
    }
  }, [year, demoMode]);

  async function loadHeatmap() {
    try {
      const res = await api.get(`/api/heatmap/year?year=${year}`);
      setHeatmapData(normalizeYearHeatmap(res.data, year));
    } catch (e) {
      console.error("Heatmap load failed", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-400 animate-pulse">Loading heatmap…</div>;
  }

  return (
    <div className="p-3 sm:p-6 text-white space-y-6">

      {/* HEADER */}
      <BlurFade delay={0.05}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">🔥 Activity Heatmap</h1>
          <p className="text-gray-400 text-sm mt-1">Visualize your consistency over time</p>
        </div>
      </BlurFade>

      {/* TABS */}
      <BlurFade delay={0.1}>
        <div className="flex flex-wrap gap-2">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => {
                setActiveTab(t);
                if (t === "graph") setGraphMode("week");
              }}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-150 ${
                activeTab === t
                  ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-glow-green"
                  : "bg-surface-elevated border border-surface-border text-gray-400 hover:text-white hover:bg-surface-hover"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </BlurFade>

      {/* GRAPH FILTERS */}
      {activeTab === "graph" && (
        <BlurFade delay={0.12}>
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className={selectClass}
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {graphMode !== "year" && (
              <select
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
                className={selectClass}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(0, i).toLocaleString("en", { month: "long" })}
                  </option>
                ))}
              </select>
            )}

            <div className="flex gap-2">
              {["week", "month", "year"].map(m => (
                <button
                  key={m}
                  onClick={() => setGraphMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    graphMode === m
                      ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white"
                      : "bg-surface-elevated border border-surface-border text-gray-400 hover:text-white hover:bg-surface-hover"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </BlurFade>
      )}

      {/* CONTENT */}
      <BlurFade delay={0.15}>
        <div className="bg-surface-card rounded-xl p-3 sm:p-6 border border-surface-border shadow-card">
          {activeTab === "week" && <WeeklyHeatmap yearData={heatmapData} />}
          {activeTab === "month" && <MonthlyHeatmap yearData={heatmapData} />}
          {activeTab === "year" && <YearlyHeatmap yearData={heatmapData} />}
          {activeTab === "graph" && (
            <HeatmapChart
              yearData={heatmapData}
              mode={graphMode}
              year={year}
              month={month}
            />
          )}
        </div>
      </BlurFade>
    </div>
  );
}
