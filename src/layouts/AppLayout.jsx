import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function AppLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
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
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden bg-gray-800 px-3 py-2 rounded"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          {/* <button
            onClick={() => navigate("/tasks/new")}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-semibold"
          >
            + Add Task
          </button> */}
        </div>

        <Outlet />
      </main>
    </div>
  );
}
