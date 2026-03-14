import { useEffect, useState } from "react";
import api from "../api/axios";
import WeeklyHeatmap from "../components/heatmap/WeeklyHeatmap";
import MonthlyHeatmap from "../components/heatmap/MonthlyHeatMap";
import YearlyHeatmap from "../components/heatmap/YearlyHeatmap";
import HeatmapChart from "../components/heatmap/HeatmapChart";

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

export default function HeatmapPage() {
  const now = new Date();

  const [activeTab, setActiveTab] = useState("week");
  const [graphMode, setGraphMode] = useState("week");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeatmap();
  }, [year]);

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
    return <div className="p-6 text-gray-400">Loading heatmap…</div>;
  }

  return (
    <div className="p-6 text-white space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">🔥 Activity Heatmap</h1>
        <p className="text-gray-400">Visualize your consistency over time</p>
      </div>

      {/* TABS */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              if (t === "graph") setGraphMode("week");
            }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm
              ${activeTab === t
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
            `}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* GRAPH FILTERS */}
      {activeTab === "graph" && (
        <div className="flex gap-4 items-center">
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="bg-gray-800 px-3 py-2 rounded"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {graphMode !== "year" && (
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="bg-gray-800 px-3 py-2 rounded"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          )}

          <div className="flex gap-2 ml-auto">
            {["week", "month", "year"].map(m => (
              <button
                key={m}
                onClick={() => setGraphMode(m)}
                className={`px-3 py-1 rounded text-sm font-semibold
                  ${graphMode === m
                    ? "bg-green-600"
                    : "bg-gray-700 text-gray-300"}
                `}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
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
    </div>
  );
}
