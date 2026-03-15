import { BlurFade } from "./magicui/blur-fade";

export default function CompletionBanner({ allCompleted }) {
  if (!allCompleted) return null;

  return (
    <BlurFade delay={0.1}>
      <div className="mt-6 bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-4 text-center">
        🎉 <span className="font-semibold text-emerald-300">All tasks completed today!</span>
        <div className="text-sm text-emerald-400/80 mt-1">
          You earned today's streak — well done.
        </div>
      </div>
    </BlurFade>
  );
}
