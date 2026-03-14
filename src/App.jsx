import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import HeatmapPage from "./pages/HeatmapPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import AdminPage from "./pages/AdminPage";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <BrowserRouter>
        <Routes>

          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED APP */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/new" element={<CreateTaskPage />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* 404 FALLBACK */}
          <Route path="*" element={<ErrorPage />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}
