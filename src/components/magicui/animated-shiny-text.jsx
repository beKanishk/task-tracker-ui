import { cn } from "../../lib/utils";

export function AnimatedShinyText({ children, className, shimmerWidth = 100 }) {
  return (
    <span
      style={{ "--shimmer-width": `${shimmerWidth}px` }}
      className={cn(
        "mx-auto max-w-md text-neutral-200/70",
        "animate-shimmer-slide bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%]",
        "[transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        "bg-gradient-to-r from-transparent via-white/80 via-50% to-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
