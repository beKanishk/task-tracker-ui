// Static mock data for demo mode — no API calls required

export const DEMO_USER = { name: "Demo User" };

export const DEMO_SUMMARY = {
  tasksCompleted: 2,
  tasksInProgress: 3,
  totalProgressPercent: 58,
};

export const DEMO_STREAK = {
  currentStreak: 7,
  longestStreak: 21,
  lastActiveDate: "2026-03-13",
  forgivenessAllowed: 1,
  forgivenessUsed: 0,
  forgivenessPending: false,
};

export const DEMO_FATIGUE = {
  level: "LOW",
  fatigueScore: 28,
  lowEffortDays: 1,
  avoidedTasks: [],
};

export const DEMO_TASKS = [
  {
    id: "demo-1",
    title: "Morning Run",
    description: "5km run before breakfast",
    taskType: "QUANTITATIVE",
    targetValue: 5,
    unit: "km",
    status: "ACTIVE",
    progressPercent: 60,
    completedToday: false,
    valueCompletedToday: 3,
  },
  {
    id: "demo-2",
    title: "Read a book",
    description: "30 minutes of reading",
    taskType: "BOOLEAN",
    status: "ACTIVE",
    completedToday: true,
    progressPercent: 100,
  },
  {
    id: "demo-3",
    title: "Drink water",
    description: "Stay hydrated throughout the day",
    taskType: "QUANTITATIVE",
    targetValue: 8,
    unit: "glasses",
    status: "ACTIVE",
    progressPercent: 37.5,
    completedToday: false,
    valueCompletedToday: 3,
  },
  {
    id: "demo-4",
    title: "Meditate",
    description: null,
    taskType: "BOOLEAN",
    status: "PAUSED",
    completedToday: false,
    progressPercent: 0,
  },
  {
    id: "demo-5",
    title: "Evening Walk",
    description: "30 minute walk after dinner",
    taskType: "QUANTITATIVE",
    targetValue: 30,
    unit: "minutes",
    status: "ACTIVE",
    progressPercent: 100,
    completedToday: true,
    valueCompletedToday: 30,
  },
];

export const DEMO_TASK_HISTORY = {
  "demo-1": [
    { date: "2026-03-14", completedToday: false, valueCompleted: 3 },
    { date: "2026-03-13", completedToday: true,  valueCompleted: 5 },
    { date: "2026-03-12", completedToday: true,  valueCompleted: 5 },
    { date: "2026-03-11", completedToday: false, valueCompleted: 2 },
    { date: "2026-03-10", completedToday: true,  valueCompleted: 5 },
    { date: "2026-03-09", completedToday: true,  valueCompleted: 5 },
    { date: "2026-03-08", completedToday: false, valueCompleted: 4 },
  ],
  "demo-2": [
    { date: "2026-03-15", completedToday: true,  valueCompleted: null },
    { date: "2026-03-14", completedToday: true,  valueCompleted: null },
    { date: "2026-03-13", completedToday: true,  valueCompleted: null },
    { date: "2026-03-12", completedToday: false, valueCompleted: null },
    { date: "2026-03-11", completedToday: true,  valueCompleted: null },
    { date: "2026-03-10", completedToday: true,  valueCompleted: null },
    { date: "2026-03-09", completedToday: false, valueCompleted: null },
  ],
  "demo-3": [
    { date: "2026-03-15", completedToday: false, valueCompleted: 3 },
    { date: "2026-03-14", completedToday: true,  valueCompleted: 8 },
    { date: "2026-03-13", completedToday: false, valueCompleted: 5 },
    { date: "2026-03-12", completedToday: true,  valueCompleted: 8 },
    { date: "2026-03-11", completedToday: false, valueCompleted: 6 },
    { date: "2026-03-10", completedToday: true,  valueCompleted: 8 },
  ],
  "demo-4": [
    { date: "2026-03-10", completedToday: true,  valueCompleted: null },
    { date: "2026-03-09", completedToday: true,  valueCompleted: null },
    { date: "2026-03-08", completedToday: false, valueCompleted: null },
  ],
  "demo-5": [
    { date: "2026-03-15", completedToday: true,  valueCompleted: 30 },
    { date: "2026-03-14", completedToday: true,  valueCompleted: 30 },
    { date: "2026-03-13", completedToday: false, valueCompleted: 20 },
    { date: "2026-03-12", completedToday: true,  valueCompleted: 30 },
    { date: "2026-03-11", completedToday: true,  valueCompleted: 30 },
    { date: "2026-03-10", completedToday: false, valueCompleted: 15 },
    { date: "2026-03-09", completedToday: true,  valueCompleted: 30 },
  ],
};

export const DEMO_TODAY_TASKS = {
  inProgressToday: DEMO_TASKS.filter((t) => t.status === "ACTIVE" && !t.completedToday),
  completedToday: DEMO_TASKS.filter((t) => t.completedToday),
};

// Deterministic heatmap activity for the last 7 days
export const DEMO_HEATMAP_7 = [3, 5, 2, 4, 6, 3, 5];

// Full-year heatmap data — deterministic pattern so it looks realistic
function demoActivity(year, month) {
  const days = new Date(year, month, 0).getDate();
  const cutoff = new Date("2026-03-14");
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(year, month - 1, i + 1);
    if (date > cutoff) return 0;
    // pseudo-random but deterministic per date
    const seed = (year * 400 + month * 31 + i + 1) % 17;
    if (seed < 5) return 0;
    if (seed < 9) return 1;
    if (seed < 13) return 3;
    return 5;
  });
}

export const DEMO_YEAR_DATA = Array.from({ length: 12 }, (_, i) => ({
  year: 2026,
  month: i + 1,
  activity: demoActivity(2026, i + 1),
}));
