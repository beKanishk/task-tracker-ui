import { cn } from "../../lib/utils";

export function ShimmerButton({
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "8px",
  background = "linear-gradient(135deg, #22c55e, #16a34a)",
  className,
  children,
  ...props
}) {
  return (
    <button
      style={{
        "--shimmer-color": shimmerColor,
        "--shimmer-size": shimmerSize,
        "--shimmer-duration": shimmerDuration,
        "--border-radius": borderRadius,
        "--background": background,
        "--cut": "0.1em",
        borderRadius,
      }}
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white font-semibold",
        "transform-gpu transition-transform duration-300 active:scale-[0.98]",
        "[background:var(--background)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* shimmer layer */}
      <div
        className={cn(
          "absolute inset-0 overflow-hidden",
          "[border-radius:var(--border-radius)]"
        )}
      >
        <div className="absolute inset-0 [background:conic-gradient(from_calc(270deg-(var(--shimmer-size)*0.5)),transparent_0,var(--shimmer-color)_var(--shimmer-size),transparent_var(--shimmer-size))] animate-[spin_var(--shimmer-duration)_linear_infinite]" />
      </div>
      {/* content mask */}
      <div
        className={cn(
          "absolute inset-[var(--cut)] z-10",
          "[background:var(--background)]",
          "[border-radius:calc(var(--border-radius)-var(--cut))]"
        )}
      />
      <span className="relative z-20">{children}</span>
    </button>
  );
}
