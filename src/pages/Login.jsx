import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired") === "true";

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");

    try {
      const res = await api.post("/auth/token", { username, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>

        {expired && (
          <p className="text-yellow-400 mb-3 text-sm">
            Session expired. Please sign in again.
          </p>
        )}
        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-6 rounded bg-gray-700 text-white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-500 hover:bg-green-600 p-2 rounded font-bold">
          Login
        </button>

        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-gray-600" />
          <span className="text-gray-500 text-xs">or</span>
          <hr className="flex-1 border-gray-600" />
        </div>

        <button
          type="button"
          onClick={() => { enterDemo(); navigate("/dashboard"); }}
          className="w-full bg-gray-700 hover:bg-gray-600 p-2 rounded font-bold text-gray-200"
        >
          Try Demo
        </button>

        <p className="text-gray-400 text-sm mt-5 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
