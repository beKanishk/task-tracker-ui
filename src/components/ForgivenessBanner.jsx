import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { BlurFade } from "./magicui/blur-fade";
import { ShimmerButton } from "./magicui/shimmer-button";

export default function ForgivenessBanner({
  missedDays,
  forgivenessLeft,
  onDecision,
  onDemoAction,
}) {
  const { demoMode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  async function accept() {
    if (demoMode) { onDemoAction(); return; }
    try {
      setLoading(true);
      setError(null);
      await api.post("/api/streak/forgiveness/accept");
      onDecision();
    } catch (err) {
      setError("Failed to apply forgiveness. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function decline() {
    if (demoMode) { onDemoAction(); return; }
    try {
      setLoading(true);
      setError(null);
      await api.post("/api/streak/forgiveness/decline");
      onDecision();
    } catch (err) {
      setError("Failed to reset streak. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BlurFade delay={0.05}>
    <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl p-4 space-y-3">
      {/* TEXT */}
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-amber-300">
            ⚠ You missed {missedDays} day{missedDays !== 1 && "s"}
          </p>

          <div className="relative">
            <span
              className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 border border-surface-border rounded-full px-1.5 py-0.5 transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              ?
            </span>
            {showTooltip && (
              <div className="absolute left-0 top-6 z-20 w-72 bg-surface-elevated border border-[#2a2a42] rounded-xl p-3 text-xs text-gray-300 shadow-modal">
                <p className="font-semibold text-gray-200 mb-1">What is Forgiveness?</p>
                <p className="mb-2">
                  Forgiveness lets you bridge a missed day without losing your streak.
                </p>
                <p className="font-semibold text-gray-200 mb-1">Use Forgiveness</p>
                <p className="mb-2">Your streak continues as if you didn't miss the day. Uses 1 forgiveness token.</p>
                <p className="font-semibold text-gray-200 mb-1">Reset Streak</p>
                <p>Decline forgiveness and start a new streak from today. Your longest streak is preserved.</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-300 mt-1">
          You can use forgiveness to keep your streak alive.
        </p>

        <p className="text-sm mt-1">
          Forgiveness left:{" "}
          <span className="font-semibold text-amber-400">
            {forgivenessLeft}
          </span>
        </p>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3">
        {loading || forgivenessLeft === 0 ? (
          <button
            disabled
            className="px-4 py-2 rounded-lg font-semibold text-sm bg-surface-elevated border border-surface-border text-gray-600 cursor-not-allowed"
          >
            Use Forgiveness
          </button>
        ) : (
          <ShimmerButton
            onClick={accept}
            background="linear-gradient(135deg,#f59e0b,#d97706)"
            className="px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Use Forgiveness
          </ShimmerButton>
        )}

        <button
          onClick={decline}
          disabled={loading}
          className="bg-surface-elevated border border-surface-border hover:bg-surface-hover px-4 py-2 rounded-lg text-sm transition-all"
        >
          Reset Streak
        </button>
      </div>
    </div>
    </BlurFade>
  );
}
