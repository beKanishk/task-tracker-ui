import { cn } from "../../lib/utils";

export function ShineBorder({
  children,
  className,
  color = ["#22c55e", "#34d399", "#6ee7b7"],
  borderWidth = 1,
  duration = 14,
  borderRadius = 12,
}) {
  const colorStr = Array.isArray(color) ? color.join(",") : color;

  return (
    <div
      style={{
        "--border-radius": `${borderRadius}px`,
        "--border-width": `${borderWidth}px`,
        "--shine-duration": `${duration}s`,
        "--shine-color": colorStr,
      }}
      className={cn(
        "relative grid place-items-stretch",
        "before:absolute before:inset-0 before:rounded-[var(--border-radius)] before:p-[var(--border-width)]",
        "before:[background:conic-gradient(from_var(--shine-angle,0deg),transparent_25%,var(--shine-color),transparent_50%)]",
        "before:[animation:shine_var(--shine-duration)_linear_infinite]",
        "before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude]",
        className
      )}
    >
      {children}
    </div>
  );
}
