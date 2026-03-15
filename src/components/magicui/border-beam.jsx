import { cn } from "../../lib/utils";

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#22c55e",
  colorTo = "#16a34a",
  delay = 0,
}) {
  return (
    <div
      style={{
        "--size": size,
        "--duration": duration,
        "--anchor": anchor,
        "--border-width": borderWidth,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": `-${delay}s`,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "[background:linear-gradient(white,white)_padding-box,conic-gradient(from_calc(var(--anchor)*1deg),var(--color-from)_0deg,var(--color-to)_calc(var(--size)*1deg),transparent_calc(var(--size)*1deg))_border-box]",
        "[animation:border-beam_calc(var(--duration)*1s)_linear_infinite]",
        "[animation-delay:var(--delay)]",
        "dark:[background:linear-gradient(#13131f,#13131f)_padding-box,conic-gradient(from_calc(var(--anchor)*1deg),var(--color-from)_0deg,var(--color-to)_calc(var(--size)*1deg),transparent_calc(var(--size)*1deg))_border-box]",
        className
      )}
    />
  );
}
