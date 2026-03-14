import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import FeedbackModal from "../components/FeedbackModal";

export default function AppLayout() {
  const navigate = useNavigate();
  const { logout, demoMode, exitDemo, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  function handleLogout() {
    if (demoMode) {
      exitDemo();
    } else {
      logout();
    }
    navigate("/dashboard");
  }

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex overflow-hidden">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50
          h-full w-56 bg-gray-800 p-4
          flex flex-col justify-between
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOP */}
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-green-400">
            Habit Tracker
          </h1>

          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              📊 Dashboard
            </NavLink>

            <NavLink
              to="/tasks"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              ✅ Tasks
            </NavLink>

            <NavLink
              to="/heatmap"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`
              }
            >
              🔥 Heatmap
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                🛡️ Admin
              </NavLink>
            )}
          </nav>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="space-y-2">
          {!demoMode && (
            <button
              onClick={() => setFeedbackOpen(true)}
              className="w-full text-left px-3 py-2 rounded text-gray-400 hover:bg-gray-700 hover:text-white text-sm"
            >
              💬 Send Feedback
            </button>
          )}

          {!demoMode && (
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded font-semibold bg-red-600 hover:bg-red-500"
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-4">

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden bg-gray-800 px-3 py-2 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* DEMO BANNER */}
        {demoMode && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm px-4 py-3 rounded-lg mb-6 flex flex-wrap items-center justify-between gap-3">
            <span>You're exploring a demo. Sign up to track your own habits.</span>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => navigate("/register")}
                className="bg-yellow-500 text-black px-3 py-1 rounded font-semibold text-xs hover:bg-yellow-400"
              >
                Sign up free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
              >
                Sign in
              </button>
            </div>
          </div>
        )}

        <Outlet />
      </main>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
    </div>
  );
}
