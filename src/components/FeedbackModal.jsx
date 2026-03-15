import { useState } from "react";
import api from "../api/axios";
import { ShimmerButton } from "./magicui/shimmer-button";

const TYPES = [
  { value: "GENERAL", label: "General" },
  { value: "BUG", label: "Bug Report" },
  { value: "FEATURE", label: "Feature Request" },
];

export default function FeedbackModal({ onClose }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GENERAL");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) { setError("Please enter a message."); return; }

    setSubmitting(true);
    setError("");
    try {
      await api.post("/api/feedback", { message, type }, { suppressAuthRedirect: true });
      setSubmitted(true);
    } catch {
      setError("Failed to send feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated border border-[#2a2a42] rounded-2xl p-6 w-full max-w-md shadow-modal">

        {submitted ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🙏</div>
            <h2 className="text-xl font-bold tracking-tight mb-2">Thanks for your feedback!</h2>
            <p className="text-gray-400 text-sm mb-6">It helps us improve the app.</p>
            <ShimmerButton
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-semibold text-sm"
            >
              Close
            </ShimmerButton>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold tracking-tight">Send Feedback</h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-300 text-lg leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TYPE */}
              <div className="flex gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      type === t.value
                        ? "bg-green-500/20 border-green-500/50 text-green-400"
                        : "bg-transparent border-surface-border text-gray-500 hover:border-[#2a2a42] hover:text-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* MESSAGE */}
              <div>
                <textarea
                  rows={5}
                  className="w-full px-3 py-2.5 bg-surface-input border border-surface-border rounded-lg resize-none text-sm placeholder-gray-600 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  placeholder="Tell us what you think, report a bug, or suggest a feature…"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setError(""); }}
                  maxLength={2000}
                />
                <div className="flex justify-between mt-1">
                  {error
                    ? <p className="text-red-400 text-xs">{error}</p>
                    : <span />
                  }
                  <p className="text-gray-600 text-xs ml-auto">{message.length}/2000</p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Cancel
                </button>
                <ShimmerButton
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  {submitting ? "Sending…" : "Send Feedback"}
                </ShimmerButton>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
