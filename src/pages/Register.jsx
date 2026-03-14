import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { enterDemo } = useAuth();
  const [form, setForm] = useState({ name: "", userName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.userName.trim()) e.userName = "Username is required";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Invalid email address";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }

    setSubmitting(true);
    setErrors({});
    try {
      await api.post("/auth/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || "Registration failed. Try a different username." });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        className={`w-full p-2 rounded bg-gray-700 text-white border ${
          errors[key] ? "border-red-500" : "border-transparent"
        }`}
        placeholder={placeholder}
        value={form[key]}
        onChange={set(key)}
      />
      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

        {success && (
          <p className="text-green-400 mb-4 text-sm">
            Account created! Redirecting to login…
          </p>
        )}
        {errors.general && (
          <p className="text-red-400 mb-4 text-sm">{errors.general}</p>
        )}

        {field("Full Name", "name", "text", "e.g. John Doe")}
        {field("Username", "userName", "text", "e.g. johndoe")}
        {field("Email (optional)", "email", "email", "e.g. john@example.com")}
        {field("Password", "password", "password", "Min 6 characters")}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 hover:bg-green-600 p-2 rounded font-bold disabled:opacity-50 mt-2"
        >
          {submitting ? "Creating…" : "Create Account"}
        </button>

        <p className="text-gray-400 text-sm mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-gray-500 text-xs mt-3 text-center">
          Just browsing?{" "}
          <button
            type="button"
            onClick={() => { enterDemo(); navigate("/dashboard"); }}
            className="text-gray-400 hover:text-white underline"
          >
            Try the demo
          </button>
        </p>
      </form>
    </div>
  );
}