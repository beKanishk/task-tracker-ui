import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import DemoAuthModal from "../components/DemoAuthModal";
import { BlurFade } from "../components/magicui/blur-fade";
import { MagicCard } from "../components/magicui/magic-card";
import { ShimmerButton } from "../components/magicui/shimmer-button";
import { BorderBeam } from "../components/magicui/border-beam";
import { AnimatedShinyText } from "../components/magicui/animated-shiny-text";

export default function SettingsPage() {
  const { demoMode } = useAuth();

  const [settings, setSettings] = useState({
    streakWarningEnabled: false,
    dailyReminderEnabled: false,
    reminderTime: "09:00",
    reminderTaskIds: [],
  });
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Email prompt state
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(null); // field name to toggle after email saved
  const [emailInput, setEmailInput] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (demoMode) { setLoading(false); return; }
    Promise.all([
      api.get("/api/notifications/settings"),
      api.get("/api/users/me"),
      api.get("/api/tasks"),
    ]).then(([settingsRes, userRes, tasksRes]) => {
      const s = settingsRes.data;
      setSettings({ ...s, reminderTaskIds: s.reminderTaskIds ?? [] });
      setUserEmail(userRes.data.email || null);
      setTasks(tasksRes.data.filter(t => t.status !== "COMPLETED"));
    }).catch(() => {
      setError("Failed to load settings.");
    }).finally(() => setLoading(false));
  }, [demoMode]);

  const handleToggle = (field) => {
    if (demoMode) { setShowDemoModal(true); return; }
    if (!userEmail) {
      setPendingToggle(field);
      setShowEmailPrompt(true);
      return;
    }
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
    setSaved(false);
  };

  const handleEmailSave = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailInput.trim() || !emailRegex.test(emailInput.trim())) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailSaving(true);
    setEmailError("");
    try {
      await api.put("/api/users/email", { email: emailInput.trim() });
      setUserEmail(emailInput.trim());
      setShowEmailPrompt(false);
      // Now apply the toggle the user originally wanted
      if (pendingToggle) {
        setSettings((prev) => ({ ...prev, [pendingToggle]: true }));
        setPendingToggle(null);
      }
      setSaved(false);
    } catch {
      setEmailError("Failed to save email. Please try again.");
    } finally {
      setEmailSaving(false);
    }
  };

  const handleTaskToggle = (taskId) => {
    if (demoMode) { setShowDemoModal(true); return; }
    setSettings((prev) => {
      const ids = prev.reminderTaskIds ?? [];
      const next = ids.includes(taskId) ? ids.filter(id => id !== taskId) : [...ids, taskId];
      return { ...prev, reminderTaskIds: next };
    });
    setSaved(false);
  };

  const handleTimeChange = (e) => {
    if (demoMode) { setShowDemoModal(true); return; }
    setSettings((prev) => ({ ...prev, reminderTime: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (demoMode) { setShowDemoModal(true); return; }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await api.put("/api/notifications/settings", settings);
      setSettings({ ...res.data, reminderTaskIds: res.data.reminderTaskIds ?? [] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const showTimePicker = settings.streakWarningEnabled || settings.dailyReminderEnabled;

  return (
    <div className="p-4 md:p-6 max-w-xl">
      <BlurFade delay={0.05}>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Settings</h2>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-6">
          Notification preferences
        </p>
      </BlurFade>

      {loading && <p className="text-gray-400 text-sm">Loading…</p>}

      {!loading && (
        <div className="relative bg-surface-card border border-surface-border rounded-2xl p-6 overflow-hidden">
          <BorderBeam size={280} duration={12} colorFrom="#22c55e" colorTo="#6366f1" />

          <div className="relative z-10 space-y-5">

            {/* Email prompt — shown when user tries to enable a toggle without an email */}
            {showEmailPrompt && (
              <BlurFade delay={0.08}>
                <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-4">
                  <p className="text-amber-300 text-sm font-semibold mb-1">Email required</p>
                  <p className="text-amber-200/70 text-xs mb-3">
                    Add an email address to enable notification emails.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      maxLength={100}
                      value={emailInput}
                      onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                      className="flex-1 px-3 py-2 bg-surface-input border border-surface-border rounded-lg text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <button
                      onClick={handleEmailSave}
                      disabled={emailSaving}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-lg transition-colors shrink-0"
                    >
                      {emailSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => { setShowEmailPrompt(false); setPendingToggle(null); setEmailError(""); }}
                      className="px-3 py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {emailError && <p className="text-red-400 text-xs mt-2">{emailError}</p>}
                </div>
              </BlurFade>
            )}

            {/* Email on file indicator */}
            {userEmail && (
              <BlurFade delay={0.08}>
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/8 border border-emerald-500/20 rounded-lg">
                  <span className="text-emerald-400 text-xs">✔</span>
                  <span className="text-gray-400 text-xs">Emails will be sent to <span className="text-gray-200">{userEmail}</span></span>
                </div>
              </BlurFade>
            )}

            {/* Error */}
            {error && (
              <BlurFade delay={0.08}>
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              </BlurFade>
            )}

            {/* Streak Warning Toggle */}
            <BlurFade delay={0.1}>
              <MagicCard
                className="bg-surface-elevated border border-surface-border rounded-xl p-4"
                gradientColor="#22c55e22"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white text-sm">Streak Warning Email</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Get emailed at your chosen time if you haven't logged today
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("streakWarningEnabled")}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                      settings.streakWarningEnabled ? "bg-emerald-500" : "bg-surface-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.streakWarningEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </MagicCard>
            </BlurFade>

            {/* Daily Reminder Toggle */}
            <BlurFade delay={0.15}>
              <MagicCard
                className="bg-surface-elevated border border-surface-border rounded-xl p-4"
                gradientColor="#6366f122"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white text-sm">Daily Reminder Email</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Receive a motivational check-in email at your chosen time every day
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle("dailyReminderEnabled")}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
                      settings.dailyReminderEnabled ? "bg-indigo-500" : "bg-surface-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        settings.dailyReminderEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </MagicCard>
            </BlurFade>

            {/* Task Selector for Daily Reminder */}
            {settings.dailyReminderEnabled && (
              <BlurFade delay={0.2}>
                <MagicCard
                  className="bg-surface-elevated border border-surface-border rounded-xl p-4"
                  gradientColor="#6366f118"
                >
                  {(() => {
                    const selectedIds = settings.reminderTaskIds ?? [];
                    const selectedTasks = tasks.filter(t => selectedIds.includes(t.id));
                    const unselectedTasks = tasks.filter(t => !selectedIds.includes(t.id));

                    const TaskRow = ({ task, selected }) => (
                      <button
                        key={task.id}
                        onClick={() => handleTaskToggle(task.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm text-left transition-all duration-150 ${
                          selected
                            ? "bg-indigo-500/15 border-indigo-500/50 text-white"
                            : "bg-surface-input border-surface-border text-gray-400 hover:text-white hover:border-surface-hover"
                        }`}
                      >
                        <span className="font-medium truncate pr-2">{task.title}</span>
                        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          selected ? "bg-indigo-500/30 text-indigo-300" : "bg-surface-border text-gray-600"
                        }`}>
                          {selected ? "✓ On" : "Add"}
                        </span>
                      </button>
                    );

                    return tasks.length === 0 ? (
                      <p className="text-xs text-gray-600">No active tasks found.</p>
                    ) : (
                      <div className="space-y-4">
                        {/* Selected tasks */}
                        {selectedTasks.length > 0 && (
                          <div>
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-2">
                              ✓ Reminders set ({selectedTasks.length})
                            </p>
                            <div className="space-y-2">
                              {selectedTasks.map(t => <TaskRow key={t.id} task={t} selected={true} />)}
                            </div>
                          </div>
                        )}

                        {/* Divider */}
                        {selectedTasks.length > 0 && unselectedTasks.length > 0 && (
                          <div className="border-t border-surface-border" />
                        )}

                        {/* Unselected tasks */}
                        {unselectedTasks.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">
                              {selectedTasks.length > 0 ? "Add more" : "Select tasks to remind"}
                            </p>
                            <div className="space-y-2">
                              {unselectedTasks.map(t => <TaskRow key={t.id} task={t} selected={false} />)}
                            </div>
                          </div>
                        )}

                        {selectedTasks.length === 0 && (
                          <p className="text-xs text-amber-500/80">
                            No tasks selected — reminder will show a generic message.
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </MagicCard>
              </BlurFade>
            )}

            {/* Time Picker */}
            {showTimePicker && (
              <BlurFade delay={0.25}>
                <MagicCard
                  className="bg-surface-elevated border border-surface-border rounded-xl p-4"
                  gradientColor="#22c55e18"
                >
                  <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
                    Reminder Time (IST)
                  </label>
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={handleTimeChange}
                    className="bg-surface-input border border-surface-border text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 transition-all duration-150 [color-scheme:dark]"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Emails are sent once per day at this exact time.
                  </p>
                </MagicCard>
              </BlurFade>
            )}

            {/* Save Button */}
            <BlurFade delay={0.3}>
              <div className="flex items-center gap-3">
                <ShimmerButton
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold"
                >
                  {saving ? "Saving…" : "Save Settings"}
                </ShimmerButton>
                {saved && (
                  <AnimatedShinyText className="text-sm text-emerald-400">
                    ✔ Saved
                  </AnimatedShinyText>
                )}
              </div>
            </BlurFade>

          </div>
        </div>
      )}

      {showDemoModal && <DemoAuthModal onClose={() => setShowDemoModal(false)} />}
    </div>
  );
}
