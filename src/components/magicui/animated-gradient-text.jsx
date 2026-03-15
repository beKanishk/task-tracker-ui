import { cn } from "../../lib/utils";

export function AnimatedGradientText({ className, children }) {
  return (
    <span
      className={cn(
        "inline animate-gradient bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-[length:var(--bg-size,300%)] bg-clip-text text-transparent",
        className
      )}
      style={{ "--bg-size": "300%" }}
    >
      {children}
    </span>
  );
}
