import { BlurFade } from "./magicui/blur-fade";

export default function FatigueWarning({ fatigue }) {
  if (fatigue.level !== "HIGH") return null;

  return (
    <BlurFade delay={0.05}>
      <div className="bg-red-500/8 border border-red-500/30 backdrop-blur-sm rounded-xl p-4 text-sm text-red-300/90">
        ⚠ You may be experiencing habit fatigue.
        Consider lighter goals or a rest day.
      </div>
    </BlurFade>
  );
}
