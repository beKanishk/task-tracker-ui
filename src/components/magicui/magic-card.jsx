import { useRef, useCallback } from "react";
import { cn } from "../../lib/utils";

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#22c55e22",
  gradientOpacity = 0.8,
}) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !overlayRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    overlayRef.current.style.background = `radial-gradient(${gradientSize}px circle at ${x}px ${y}px, ${gradientColor}, transparent 100%)`;
    overlayRef.current.style.opacity = gradientOpacity;
  }, [gradientSize, gradientColor, gradientOpacity]);

  const handleMouseLeave = useCallback(() => {
    if (!overlayRef.current) return;
    overlayRef.current.style.opacity = 0;
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {children}
    </div>
  );
}
