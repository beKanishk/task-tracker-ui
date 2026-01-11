import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
     console.log("LOGIN PAYLOAD", {
    username,
    password,
  });

    try {
      const res = await api.post("/auth/token", {
        username,
        password,
      });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
        console.error("LOGIN ERROR", err.response?.data || err.message);
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

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-6 rounded bg-gray-700 text-white"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-500 hover:bg-green-600 p-2 rounded font-bold">
          Login
        </button>
      </form>
    </div>
  );
}
