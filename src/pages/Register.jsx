import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Meteors } from "../components/magicui/meteors";
import { DotPattern } from "../components/magicui/dot-pattern";
import { SparklesText } from "../components/magicui/sparkles-text";
import { ShimmerButton } from "../components/magicui/shimmer-button";
import { BorderBeam } from "../components/magicui/border-beam";
import { BlurFade } from "../components/magicui/blur-fade";
import { AnimatedShinyText } from "../components/magicui/animated-shiny-text";

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
      await api.post("/auth/register", {
        name: form.name.trim(),
        userName: form.userName.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || "Registration failed. Try a different username." });
    } finally {
      setSubmitting(false);
    }
  };

  const MAX_LENGTHS = { name: 50, userName: 50, email: 100, password: 100 };

  const field = (label, key, type = "text", placeholder = "", delay = 0.1) => (
    <BlurFade delay={delay}>
      <div className="mb-4">
        <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{label}</label>
        <input
          type={type}
          maxLength={MAX_LENGTHS[key]}
          className={`w-full px-3 py-2.5 rounded-lg bg-surface-input border text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-150 [&:-webkit-autofill]:![box-shadow:0_0_0_1000px_#0f0f1a_inset] [&:-webkit-autofill]:![-webkit-text-fill-color:#f1f5f9] ${
            errors[key] ? "border-red-500" : "border-surface-border focus:border-green-500/60"
          }`}
          placeholder={placeholder}
          value={form[key]}
          onChange={set(key)}
        />
        {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
      </div>
    </BlurFade>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base bg-gradient-auth-bg relative overflow-hidden px-4 py-8">
      <Meteors number={18} />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-surface-card border border-surface-border rounded-2xl p-8 w-full max-w-sm shadow-modal overflow-hidden"
      >
        <DotPattern className="opacity-[0.04]" />
        <BorderBeam size={300} duration={12} colorFrom="#6366f1" colorTo="#22c55e" />

        <div className="relative z-10">

          <BlurFade delay={0.05}>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              <SparklesText sparklesCount={6}>Create Account</SparklesText>
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-6">
              Start tracking your habits
            </p>
          </BlurFade>

          {success && (
            <BlurFade delay={0.08}>
              <p className="text-green-400 mb-4 text-sm">
                ✔ Account created! Redirecting to login…
              </p>
            </BlurFade>
          )}
          {errors.general && (
            <BlurFade delay={0.08}>
              <p className="text-red-400 mb-4 text-sm">{errors.general}</p>
            </BlurFade>
          )}

          {field("Full Name",        "name",     "text",     "e.g. John Doe",        0.1)}
          {field("Username",         "userName", "text",     "e.g. johndoe",         0.14)}
          {field("Email (optional)", "email",    "email",    "e.g. john@example.com",0.18)}
          {field("Password",         "password", "password", "Min 6 characters",     0.22)}

          <BlurFade delay={0.26}>
            <ShimmerButton
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg text-sm font-semibold mt-2"
            >
              {submitting ? "Creating…" : "Create Account"}
            </ShimmerButton>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-gray-500 text-sm mt-5 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 hover:text-green-300 transition-colors">
                Sign in
              </Link>
            </p>

            <p className="text-gray-600 text-xs mt-3 text-center">
              Just browsing?{" "}
              <button
                type="button"
                onClick={() => { enterDemo(); navigate("/dashboard"); }}
                className="text-gray-400 hover:text-gray-200 underline transition-colors"
              >
                <AnimatedShinyText className="text-xs">Try the demo</AnimatedShinyText>
              </button>
            </p>
          </BlurFade>
        </div>
      </form>
    </div>
  );
}
