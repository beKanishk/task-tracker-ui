import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import HeatmapPage from "./pages/HeatmapPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTaskPage from "./pages/CreateTaskPage";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
    <BrowserRouter>
      
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<CreateTaskPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
    </div>
  );
}
