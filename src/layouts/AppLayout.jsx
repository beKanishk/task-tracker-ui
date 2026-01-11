import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      
      {/* SIDEBAR */}
      <aside className="w-56 bg-gray-800 p-4 space-y-4">
        <h1 className="text-xl font-bold text-green-400">
          Habit Tracker
        </h1>

        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
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
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            ✅ Tasks
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {/* Top bar */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/tasks/new")}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-semibold"
          >
            + Add Task
          </button>
        </div>

        {/* Page content */}
        <Outlet />
      </main>
    </div>
  );
}
