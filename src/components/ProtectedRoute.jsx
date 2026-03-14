import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, demoMode } = useAuth();
  return (token || demoMode) ? children : <Navigate to="/login" replace />;
}
