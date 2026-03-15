import { useState } from "react";
import api from "../api/axios";
import { BlurFade } from "./magicui/blur-fade";
import { MagicCard } from "./magicui/magic-card";
import { ShimmerButton } from "./magicui/shimmer-button";
import { BorderBeam } from "./magicui/border-beam";
import { AnimatedShinyText } from "./magicui/animated-shiny-text";

export default function EditTaskModal({ task, onClose, onSuccess }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [targetValue, setTargetValue] = useState(task.targetValue || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass = "w-full px-3 py-2.5 bg-surface-input border border-surface-border rounded-lg text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all duration-150";
  const labelClass = "block text-xs text-gray-500 uppercase tracking-wide font-medium mb-1";

  async function handleSave() {
    if (!title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError("");
    try {
      await api.put("/api/tasks", {
        taskId: task.id,
        title: title.trim(),
        description: description.trim() || null,
        targetValue: task.taskType === "QUANTITATIVE" ? Number(targetValue) : null,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-surface-elevated border border-[#2a2a42] rounded-2xl p-6 w-full max-w-sm shadow-modal overflow-hidden">
        <BorderBeam size={200} duration={8} colorFrom="#6366f1" colorTo="#22c55e" />

        {/* HEADER */}
        <BlurFade delay={0.04}>
          <div className="relative z-10 flex justify-between items-start mb-3">
            <div>
              <AnimatedShinyText className="text-xl font-bold tracking-tight text-white">
                ✏ Edit Task
              </AnimatedShinyText>
              <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider font-medium">
                {task.taskType}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-300 text-xl leading-none transition-colors p-1"
            >
              &times;
            </button>
          </div>
          <div className="border-t border-surface-border mb-4" />
        </BlurFade>

        <div className="relative z-10 space-y-4">

          {/* TITLE */}
          <BlurFade delay={0.08}>
            <MagicCard
              gradientColor="#6366f118"
              className="bg-surface-card border border-surface-border rounded-xl p-3"
            >
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                maxLength={100}
                placeholder="Task title"
                value={title}
                onChange={e => { setTitle(e.target.value); setError(""); }}
              />
            </MagicCard>
          </BlurFade>

          {/* DESCRIPTION */}
          <BlurFade delay={0.12}>
            <MagicCard
              gradientColor="#6366f118"
              className="bg-surface-card border border-surface-border rounded-xl p-3"
            >
              <label className={labelClass}>Description (optional)</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                maxLength={500}
                placeholder="Notes, rules, motivation…"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </MagicCard>
          </BlurFade>

          {/* TARGET VALUE */}
          {task.taskType === "QUANTITATIVE" && (
            <BlurFade delay={0.16}>
              <MagicCard
                gradientColor="#6366f118"
                className="bg-surface-card border border-surface-border rounded-xl p-3"
              >
                <label className={labelClass}>
                  Target Value {task.unit ? `(${task.unit})` : ""}
                </label>
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  placeholder="e.g. 30"
                  value={targetValue}
                  onChange={e => setTargetValue(e.target.value)}
                />
              </MagicCard>
            </BlurFade>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* ACTIONS */}
          <BlurFade delay={0.2}>
            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <ShimmerButton
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-1.5 rounded-lg text-sm font-semibold"
              >
                {saving ? "Saving…" : "Save Changes"}
              </ShimmerButton>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
