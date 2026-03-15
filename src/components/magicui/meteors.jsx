import { cn } from "../../lib/utils";

export function Meteors({ number = 20, className }) {
  const meteors = Array.from({ length: number }, (_, i) => i);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map((i) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 3 + Math.random() * 4;
        const size = 1 + Math.random() * 2;

        return (
          <span
            key={i}
            className="absolute rotate-[215deg] animate-meteor-effect rounded-full bg-slate-500"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${60 + Math.random() * 80}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              background: `linear-gradient(to bottom, #22c55e, transparent)`,
              boxShadow: `0 0 ${size * 3}px 0 #22c55e44`,
            }}
          />
        );
      })}
    </div>
  );
}
