import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = true,
  blur = "6px",
}) {
  const ref = useRef(null);

  const defaultVariants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(className)}
      onAnimationComplete={() => {
        if (ref.current) {
          ref.current.style.removeProperty("filter");
          ref.current.style.removeProperty("will-change");
        }
      }}
    >
      {children}
    </motion.div>
  );
}
