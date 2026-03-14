# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the **React frontend** for the habit & task tracking application. The companion backend lives in `../Task-Tracker/` (Spring Boot, Java 17, MongoDB) and must be running at `http://localhost:8080`.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

The backend must be running at `http://localhost:8080` (hardcoded in `src/api/axios.js`).

## Architecture

### Key Files

- **`src/api/axios.js`** — Axios instance with JWT interceptors. Attaches `Authorization: Bearer <token>` from `localStorage` to all non-`/auth` requests. On 401/403, clears the token and hard-redirects to `/login`.
- **`src/context/AuthContext.jsx`** — Auth state provider. Exposes `{ token, login, logout }`. Token is persisted in `localStorage`.
- **`src/layouts/AppLayout.jsx`** — Shared shell with collapsible sidebar (mobile-responsive). Wraps all protected pages via `<Outlet />`.
- **`src/components/ProtectedRoute.jsx`** — Guards routes; redirects to `/login` if unauthenticated.

### Routes

| Path | Component | Access |
|------|-----------|--------|
| `/login` | `Login` | Public |
| `/register` | `Register` | Public |
| `/dashboard` | `Dashboard` | Protected |
| `/tasks` | `Tasks` | Protected |
| `/tasks/new` | `CreateTaskPage` | Protected |
| `/heatmap` | `HeatmapPage` | Protected |

`/` redirects to `/dashboard`. `*` renders `ErrorPage`.

### Dashboard Data Flow

`Dashboard.jsx` fetches all data in parallel via `Promise.all` on mount:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/summary/today` | Completed/in-progress counts, avg progress % |
| `GET /api/tasks/state/today` | `inProgressToday[]` + `completedToday[]` task lists |
| `GET /api/heatmap/month?year=&month=` | Monthly activity array; sliced to last 7 days for `MiniHeatmap` |
| `GET /api/streak` | Streak state (see shape below) |
| `GET /api/users/me` | `{ name, ... }` |
| `GET /api/fatigue` | Fatigue state (see shape below) |
| `POST /api/fatigue/recompute` | Triggers manual fatigue recomputation; returns updated fatigue |
| `POST /api/progress/log` | Logs task progress `{ taskId, completed, valueCompleted }` |

### Domain Shapes

**Streak** (`GET /api/streak`):
```json
{
  "currentStreak": 5,
  "longestStreak": 12,
  "lastActiveDate": "2026-03-07",
  "forgivenessAllowed": 1,
  "forgivenessUsed": 0,
  "forgivenessPending": false
}
```
Forgiveness banner shows when `missedDays > 0` and `forgivenessUsed + missedDays <= forgivenessAllowed`. The forgiveness decision is handled by `ForgivenessBanner` (calls its own endpoint) and triggers a full dashboard refresh.

**Fatigue** (`GET /api/fatigue`):
```json
{
  "level": "NONE | LOW | MEDIUM | HIGH",
  "fatigueScore": 3,
  "lowEffortDays": 2,
  "avoidedTasks": ["Task A"]
}
```
`FatigueCard` displays level + score; `FatigueWhyModal` shows `lowEffortDays` and `avoidedTasks`. `FatigueWarning` renders a banner for HIGH/MEDIUM levels.

### Component Groups

- **`components/heatmap/`** — `MonthlyHeatMap`, `WeeklyHeatmap`, `YearlyHeatmap`, `HeatmapChart`
- **Streak** — `StreakCard`, `StreakDetailsModal`, `ForgivenessBanner`
- **Fatigue** — `FatigueCard`, `FatigueWarning`, `FatigueWhyModal`
- **Tasks** — `TaskCard`, `TodayTaskList`, `QuickLogModal`, `EditTaskModal`

### Utilities

- **`src/utils/heatmapUtils.js`** — Heatmap data transformation helpers
- **`src/utils/taskUtils.js`** — `canLog(task)` guards task logging: BOOLEAN tasks block re-log once `completedToday === true`; QUANTITATIVE tasks block at `progressPercent === 100`

### Styling

Tailwind CSS with a dark theme (`bg-gray-900 text-gray-100` as the root). Icons from `lucide-react`. Charts via `recharts`.

---

## Backend (`../Task-Tracker/`)

The Spring Boot backend that this frontend consumes. Key details relevant when making frontend changes:

### Backend Security

Public endpoints (no JWT needed): `/auth/register`, `/auth/token`, `/auth/validate`, `/auth/role`. All other endpoints require `Authorization: Bearer <token>`. CORS is configured for `http://localhost:5173` only.

### Full REST API Reference

| Controller | Base Path | Key Operations |
|-----------|-----------|---------------|
| `TaskController` | `/api/tasks` | CRUD; user scoped via JWT |
| `TaskStateController` | `/api/tasks/state` | GET today/day state, PUT `/{taskId}/status` |
| `TaskProgressController` | `/api/progress` | POST `/boolean/mark`, POST `/log`, POST `/toggle-today`, POST `/complete-all-today`, GET `/day`, GET `/task/{taskId}/history` |
| `StreakController` | `/api/streak` | GET streak, POST `/forgiveness/accept`, POST `/forgiveness/decline` |
| `FatigueController` | `/api/fatigue` | Fatigue state for the logged-in user |
| `HeatMapController` | `/api/heatmap` | Heatmap data |
| `DailySummaryController` | `/api/summary` | Daily summaries |
| `UserController` | `/api/users` | User profile |

### Task Types & Status

- **Types**: `BOOLEAN` (done/not done) or `QUANTITATIVE` (numeric progress toward `targetValue` with a `unit`)
- **Status**: `active`, `paused`, `completed` — transitions handled by `TaskStateService`

### Streak System

State transitions managed by `StreakService` + `UserStreak` domain methods:
- **start()** — first ever activity
- **increment()** — consecutive day
- **markForgivenessPending(missedDays)** — within gap limit; waits for user decision
- **consumeForgiveness(today)** — user accepts forgiveness
- **reset(today, forgivenessAllowed)** — user declines or gap exceeded

Configurable via `application.properties`:
- `streak.max-gap-days=2` — max consecutive missed days before gap is unforgivable
- `streak.forgiveness-allowed=1` — total forgiveness days per streak lifetime
- `streak.allow-forgiveness=true` — global toggle

### Fatigue Scoring (7-day rolling window)

| Signal | Max Score | Logic |
|--------|-----------|-------|
| Completion trend | 40 | Negative slope (last day − first day completions) × 10 |
| Low effort days | 20 | Days with only 1 task logged, or any quantitative task < 25% progress |
| Task avoidance | 15 | Active tasks with zero progress logs in the window (capped at 3) |

Level thresholds: `NONE` (<20), `LOW` (<40), `MEDIUM` (<70), `HIGH` (≥70).

### Scheduled Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| `DailySummaryCronJob` | `0 59 23 * * *` (23:59 daily) | Snapshots daily summary for all users |
| `FatigueCronJob` | `0 0 2 * * *` (2 AM daily) | Evaluates and persists `UserFatigue` for all users |

### MongoDB Collections

| Model | Collection |
|-------|-----------|
| `User` | `users` |
| `Task` | `tasks` |
| `UserStreak` | `user_streaks` |
| `UserFatigue` | `user_fatigue` |
| `TaskProgress` | (convention-named) |
| `DailySummary` | (convention-named) |
| `Heatmap` | (convention-named) |
