import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DemoAuthModal from "../components/DemoAuthModal";
import { ShimmerButton } from "../components/magicui/shimmer-button";
import { BlurFade } from "../components/magicui/blur-fade";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const { demoMode } = useAuth();

  if (demoMode) {
    return <DemoAuthModal onClose={() => navigate("/tasks")} />;
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("BOOLEAN");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (taskType === "QUANTITATIVE") {
      const n = Number(targetValue);
      if (!targetValue) e.targetValue = "Target value is required";
      else if (!Number.isFinite(n) || n < 1) e.targetValue = "Must be at least 1";
    }
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      taskType,
      targetValue: taskType === "QUANTITATIVE" ? Number(targetValue) : null,
      unit: taskType === "QUANTITATIVE" ? unit.trim() || null : null,
    };

    setSubmitting(true);
    try {
      await api.post("/api/tasks", payload);
      navigate("/tasks");
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Failed to create task. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-surface-input border border-surface-border rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all duration-150";
  const labelClass = "block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1";

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6">
      <BlurFade delay={0.05}>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Create New Task</h2>
      </BlurFade>

      <BlurFade delay={0.1}>
        <form
          onSubmit={submit}
          className="bg-surface-card p-6 rounded-2xl space-y-4 border border-surface-border shadow-card"
        >
          {errors.general && (
            <p className="text-red-400 text-sm">{errors.general}</p>
          )}

          {/* TITLE */}
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={`${inputClass} border ${errors.title ? "border-red-500" : "border-surface-border"}`}
              placeholder="e.g. Go to gym"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className={labelClass}>Description (optional)</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Why this task matters, notes, rules…"
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* TASK TYPE */}
          <div>
            <label className={labelClass}>Task Type</label>
            <select
              className={inputClass}
              value={taskType}
              onChange={(e) => { setTaskType(e.target.value); setErrors({}); }}
            >
              <option value="BOOLEAN">Boolean (Yes / No)</option>
              <option value="QUANTITATIVE">Quantitative</option>
            </select>
          </div>

          {/* QUANTITATIVE FIELDS */}
          {taskType === "QUANTITATIVE" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Target Value</label>
                <input
                  type="number"
                  min="1"
                  className={`${inputClass} border ${errors.targetValue ? "border-red-500" : "border-surface-border"}`}
                  placeholder="e.g. 30"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                />
                {errors.targetValue && (
                  <p className="text-red-400 text-xs mt-1">{errors.targetValue}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Unit</label>
                <input
                  className={inputClass}
                  placeholder="e.g. reps, km, minutes"
                  maxLength={30}
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>

            <ShimmerButton
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
            >
              {submitting ? "Creating…" : "Create Task"}
            </ShimmerButton>
          </div>
        </form>
      </BlurFade>
    </div>
  );
}
