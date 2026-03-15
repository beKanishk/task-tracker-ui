import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Meteors } from "../components/magicui/meteors";
import { DotPattern } from "../components/magicui/dot-pattern";
import { SparklesText } from "../components/magicui/sparkles-text";
import { ShimmerButton } from "../components/magicui/shimmer-button";
import { BorderBeam } from "../components/magicui/border-beam";
import { BlurFade } from "../components/magicui/blur-fade";
import { AnimatedShinyText } from "../components/magicui/animated-shiny-text";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired") === "true";

  const handleLogin = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/token", { username: username.trim(), password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-surface-input border border-surface-border text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all duration-150 [&:-webkit-autofill]:![box-shadow:0_0_0_1000px_#0f0f1a_inset] [&:-webkit-autofill]:![-webkit-text-fill-color:#f1f5f9]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base bg-gradient-auth-bg relative overflow-hidden px-4">
      <Meteors number={18} />

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-surface-card border border-surface-border rounded-2xl p-8 w-full max-w-sm shadow-modal overflow-hidden"
      >
        <DotPattern className="opacity-[0.04]" />
        <BorderBeam size={300} duration={12} colorFrom="#22c55e" colorTo="#6366f1" />

        <div className="relative z-10">

          <BlurFade delay={0.05}>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              <SparklesText sparklesCount={6}>Sign In</SparklesText>
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-6">
              Welcome back
            </p>
          </BlurFade>

          {expired && (
            <BlurFade delay={0.08}>
              <p className="text-yellow-400 mb-3 text-sm">
                Session expired. Please sign in again.
              </p>
            </BlurFade>
          )}
          {error && (
            <BlurFade delay={0.08}>
              <p className="text-red-400 mb-3 text-sm">{error}</p>
            </BlurFade>
          )}

          <BlurFade delay={0.1}>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Username</label>
              <input
                className={inputClass}
                placeholder="e.g. johndoe"
                maxLength={50}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </BlurFade>

          <BlurFade delay={0.15}>
            <div className="mb-6">
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Password</label>
              <input
                type="password"
                className={inputClass}
                placeholder="Your password"
                maxLength={100}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </BlurFade>

          <BlurFade delay={0.2}>
            <ShimmerButton
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg text-sm font-semibold"
            >
              {submitting ? "Signing in…" : "Login"}
            </ShimmerButton>
          </BlurFade>

          <BlurFade delay={0.25}>
            <div className="flex items-center gap-3 my-4">
              <hr className="flex-1 border-surface-border" />
              <AnimatedShinyText className="text-xs text-gray-600">or</AnimatedShinyText>
              <hr className="flex-1 border-surface-border" />
            </div>

            <button
              type="button"
              onClick={() => { enterDemo(); navigate("/dashboard"); }}
              className="w-full bg-surface-elevated border border-surface-border hover:bg-surface-hover py-2.5 rounded-lg font-semibold text-gray-300 hover:text-white text-sm transition-all duration-150"
            >
              Try Demo
            </button>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-gray-500 text-sm mt-5 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-400 hover:text-green-300 transition-colors">
                Create one
              </Link>
            </p>
          </BlurFade>
        </div>
      </form>
    </div>
  );
}
