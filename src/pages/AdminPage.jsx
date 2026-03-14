import { useEffect, useState } from "react";
import api from "../api/axios";

const TABS = ["Overview", "Users", "Feedback"];

const FEEDBACK_FILTERS = ["ALL", "GENERAL", "BUG", "FEATURE"];

const FEEDBACK_TYPE_STYLES = {
  BUG: "bg-red-500/20 text-red-400 border-red-500/30",
  FEATURE: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  GENERAL: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const FATIGUE_COLORS = {
  NONE: "text-green-400",
  LOW: "text-yellow-400",
  MEDIUM: "text-orange-400",
  HIGH: "text-red-400",
  "N/A": "text-gray-500",
};

function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString(undefined, { dateStyle: "medium" });
}

function formatDateTime(val) {
  if (!val) return "—";
  return new Date(val).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/admin/stats")
      .then((r) => setStats(r.data))
      .catch(() => setError("Failed to load stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400 animate-pulse">Loading stats…</p>;
  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  const feedback = stats.feedbackByType ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Users</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="New Today" value={stats.newUsersToday} />
          <StatCard label="Logged In Today" value={stats.loggedInToday} />
          <StatCard label="Active Today" value={stats.activeToday} sub="logged task progress" />
          <StatCard label="Active This Week" value={stats.activeThisWeek} sub="last 7 days" />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Tasks</h2>
        <div className="grid grid-cols-2 gap-3 max-w-xs">
          <StatCard label="Total Tasks" value={stats.totalTasks} />
          <StatCard label="Created Today" value={stats.tasksCreatedToday} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Feedback</h2>
        <div className="grid grid-cols-3 gap-3 max-w-sm">
          <StatCard label="General" value={feedback.GENERAL ?? 0} />
          <StatCard label="Bug Reports" value={feedback.BUG ?? 0} />
          <StatCard label="Feature Requests" value={feedback.FEATURE ?? 0} />
        </div>
      </div>
    </div>
  );
}

/* ─── USERS TAB ─── */
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/api/admin/users")
      .then((r) => setUsers(r.data))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-gray-400 animate-pulse">Loading users…</p>;
  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  return (
    <div>
      <input
        className="w-full max-w-sm p-2 mb-4 rounded bg-gray-700 text-sm placeholder-gray-500 border border-transparent focus:border-green-600 outline-none"
        placeholder="Search by name, username, or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700 text-xs uppercase">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Username</th>
                <th className="pb-2 pr-4">Email</th>
                <th className="pb-2 pr-4">Roles</th>
                <th className="pb-2 pr-4">Joined</th>
                <th className="pb-2 pr-4">Last Login</th>
                <th className="pb-2 pr-4">Tasks</th>
                <th className="pb-2 pr-4">Streak</th>
                <th className="pb-2 pr-4">Fatigue</th>
                <th className="pb-2">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.userId} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 pr-4 font-medium">{u.name || "—"}</td>
                  <td className="py-2 pr-4 text-gray-300">{u.username}</td>
                  <td className="py-2 pr-4 text-gray-400">{u.email || "—"}</td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-1 flex-wrap">
                      {(u.roles ?? []).map((r) => (
                        <span
                          key={r}
                          className={`text-xs px-1.5 py-0.5 rounded border ${
                            r === "ADMIN"
                              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-600"
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 pr-4 text-gray-400">{formatDate(u.createdAt)}</td>
                  <td className="py-2 pr-4 text-gray-400">{formatDateTime(u.lastLogin)}</td>
                  <td className="py-2 pr-4 text-center">{u.taskCount}</td>
                  <td className="py-2 pr-4 text-center">{u.currentStreak} 🔥</td>
                  <td className={`py-2 pr-4 font-semibold ${FATIGUE_COLORS[u.fatigueLevel] ?? "text-gray-400"}`}>
                    {u.fatigueLevel}
                  </td>
                  <td className="py-2 text-gray-400">{formatDate(u.lastActiveDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── FEEDBACK TAB ─── */
function FeedbackTab() {
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
    <div>
      <div className="flex gap-2 mb-5">
        {FEEDBACK_FILTERS.map((f) => (
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
        <span className="ml-auto text-xs text-gray-500 self-center">{feedbacks.length} total</span>
      </div>

      {loading && <p className="text-gray-400 animate-pulse">Loading feedback…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500 text-sm">No feedback found.</p>
      )}

      <div className="space-y-3">
        {filtered.map((fb) => (
          <div key={fb.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  FEEDBACK_TYPE_STYLES[fb.type] ?? FEEDBACK_TYPE_STYLES.GENERAL
                }`}
              >
                {fb.type}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(fb.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <p className="text-sm text-gray-100 whitespace-pre-wrap break-words mb-2">{fb.message}</p>
            <p className="text-xs text-gray-600">User: {fb.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛡️ Admin Panel</h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 border-b border-gray-700">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-green-500 text-green-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && <OverviewTab />}
      {activeTab === "Users" && <UsersTab />}
      {activeTab === "Feedback" && <FeedbackTab />}
    </div>
  );
}
