import { useState } from "react";
import api from "../api/axios";

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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-xl">

        {submitted ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🙏</div>
            <h2 className="text-xl font-bold mb-2">Thanks for your feedback!</h2>
            <p className="text-gray-400 text-sm mb-6">It helps us improve the app.</p>
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Send Feedback</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TYPE */}
              <div className="flex gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex-1 py-1.5 rounded text-xs font-semibold border transition-colors ${
                      type === t.value
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-transparent border-gray-600 text-gray-400 hover:border-gray-400"
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
                  className="w-full p-3 bg-gray-700 rounded resize-none text-sm placeholder-gray-500 border border-transparent focus:border-green-600 outline-none"
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
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded font-semibold text-sm disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Send Feedback"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
