import { useEffect, useState } from "react";
import api from "../api/axios";

const FILTERS = ["ALL", "GENERAL", "BUG", "FEATURE"];

const TYPE_STYLES = {
  BUG: "bg-red-500/20 text-red-400 border-red-500/30",
  FEATURE: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  GENERAL: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    api.get("/api/feedback")
      .then((r) => setFeedbacks(r.data))
      .catch(() => setError("Failed to load feedback."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    typeFilter === "ALL" ? feedbacks : feedbacks.filter((f) => f.type === typeFilter);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🛡️ User Feedback</h1>
        <span className="text-sm text-gray-500">{feedbacks.length} total</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
              typeFilter === f
                ? "bg-green-600 border-green-600 text-white"
                : "bg-transparent border-gray-600 text-gray-400 hover:border-gray-400"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-gray-400 animate-pulse">Loading feedback…</p>
      )}

      {error && (
        <p className="text-red-400 bg-red-500/10 border border-red-500/20 rounded px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No feedback found.</p>
      )}

      <div className="space-y-3">
        {filtered.map((fb) => (
          <div
            key={fb.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  TYPE_STYLES[fb.type] ?? TYPE_STYLES.GENERAL
                }`}
              >
                {fb.type}
              </span>
              <span className="text-xs text-gray-500">{formatDate(fb.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-100 whitespace-pre-wrap break-words mb-2">
              {fb.message}
            </p>
            <p className="text-xs text-gray-600">User: {fb.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
