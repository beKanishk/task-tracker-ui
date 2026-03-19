import { MagicCard } from "./magicui/magic-card";
import { AnimatedShinyText } from "./magicui/animated-shiny-text";
import { NumberTicker } from "./magicui/number-ticker";
import { Trophy, Calendar, TrendingUp, Star } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatBestDay(bestDay, bestDayCompleted) {
  if (!bestDay) return "No activity yet";
  // bestDay is "YYYY-MM-DD"
  const [, m, d] = bestDay.split("-");
  return `${MONTHS[parseInt(m, 10) - 1]} ${parseInt(d, 10)} — ${bestDayCompleted} task${bestDayCompleted !== 1 ? "s" : ""}`;
}

export default function MonthlyStatsCard({ stats }) {
  if (!stats) return null;

  const monthName = MONTHS[stats.month - 1];

  return (
    <MagicCard
      gradientColor="#6366f111"
      className="bg-surface-card border border-surface-border rounded-xl p-4 shadow-card h-full"
    >
      <AnimatedShinyText className="text-sm font-semibold text-gray-300 mb-4 block">
        {monthName} {stats.year}
      </AnimatedShinyText>

      <div className="space-y-3">
        <StatRow icon={Trophy} label="Tasks completed" color="text-green-400">
          <NumberTicker value={stats.totalTasksCompleted} />
        </StatRow>

        <StatRow icon={Calendar} label="Active days" color="text-blue-400">
          <span className="text-blue-400 font-semibold tabular-nums">
            {stats.activeDays}
            <span className="text-gray-500 font-normal">/{stats.totalDays}</span>
          </span>
        </StatRow>

        <StatRow icon={TrendingUp} label="Avg completion" color="text-indigo-400">
          <span className="text-indigo-400 font-semibold tabular-nums">
            <NumberTicker value={stats.avgCompletionPercent} />%
          </span>
        </StatRow>

        <StatRow icon={Star} label="Best day" color="text-yellow-400">
          <span className="text-yellow-400 font-semibold text-xs">
            {formatBestDay(stats.bestDay, stats.bestDayCompleted)}
          </span>
        </StatRow>
      </div>
    </MagicCard>
  );
}

function StatRow({ icon: Icon, label, color, children }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 shrink-0">
        <Icon size={13} className={`${color} opacity-70`} />
        <span className="text-[11px] text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-sm font-semibold tabular-nums ${color} text-right`}>
        {children}
      </div>
    </div>
  );
}
