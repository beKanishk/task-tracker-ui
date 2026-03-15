import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import FeedbackModal from "../components/FeedbackModal";
import { LayoutDashboard, CheckSquare, Activity, ShieldCheck, MessageSquare, LogOut, Menu, Bell } from "lucide-react";
import { AnimatedGradientText } from "../components/magicui/animated-gradient-text";

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

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border-l-2 pl-[10px] ${
      isActive
        ? "bg-gradient-to-r from-green-500/15 to-transparent text-green-400 border-green-500"
        : "text-gray-400 hover:bg-surface-hover hover:text-gray-100 border-transparent"
    }`;

  return (
    <div className="h-screen bg-surface-base text-gray-100 flex overflow-hidden">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50
          h-full w-56
          bg-gradient-sidebar border-r border-surface-border
          p-4 flex flex-col justify-between
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* TOP */}
        <div className="space-y-5">
          <div className="px-1 pt-1">
            <h1 className="text-lg font-bold tracking-tight">
              <AnimatedGradientText>Habit Tracker</AnimatedGradientText>
            </h1>
          </div>

          <nav className="space-y-1">
            <NavLink to="/dashboard" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
              <LayoutDashboard size={16} className="shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/tasks" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
              <CheckSquare size={16} className="shrink-0" />
              <span>Tasks</span>
            </NavLink>

            <NavLink to="/heatmap" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
              <Activity size={16} className="shrink-0" />
              <span>Heatmap</span>
            </NavLink>

            <NavLink to="/settings" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
              <Bell size={16} className="shrink-0" />
              <span>Settings</span>
            </NavLink>

            {isAdmin && !demoMode && (
              <NavLink to="/admin" onClick={() => setSidebarOpen(false)} className={navLinkClass}>
                <ShieldCheck size={16} className="shrink-0" />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="space-y-2">
          {!demoMode && (
            <button
              onClick={() => setFeedbackOpen(true)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-surface-hover hover:text-gray-300 transition-all"
            >
              <MessageSquare size={14} />
              Send Feedback
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-150"
          >
            <LogOut size={14} />
            {demoMode ? "Exit Demo" : "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden mb-4">
          <button
            className="bg-surface-card border border-surface-border px-3 py-2 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* DEMO BANNER */}
        {demoMode && (
          <div className="bg-amber-500/8 border border-amber-500/25 text-amber-300/90 text-sm px-4 py-3 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-3">
            <span>You're exploring a demo. Sign up to track your own habits.</span>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => navigate("/register")}
                className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1 rounded-lg font-semibold text-xs transition-all"
              >
                Sign up free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-surface-elevated border border-surface-border text-white px-3 py-1 rounded-lg text-xs hover:bg-surface-hover transition-all"
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
