import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const random = (min, max) => Math.random() * (max - min) + min;

const generateSparkle = () => ({
  id: Math.random().toString(36).slice(2, 9),
  createdAt: Date.now(),
  color: "#22c55e",
  size: random(10, 20),
  style: {
    top: `${random(-20, 80)}%`,
    left: `${random(0, 100)}%`,
  },
});

function Sparkle({ size, color, style }) {
  return (
    <motion.span
      className="absolute block pointer-events-none"
      style={style}
      initial={{ scale: 0, rotate: 0, opacity: 1 }}
      animate={{ scale: 1, rotate: 45, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <svg width={size} height={size} viewBox="0 0 160 160" fill="none">
        <path
          d="M80 7C80 7 84.2846 41.2925 101.496 58.504C118.707 75.7154 153 80 153 80C153 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 153 80 153C80 153 75.7154 118.707 58.504 101.496C41.2925 84.2846 7 80 7 80C7 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 7 80 7Z"
          fill={color}
        />
      </svg>
    </motion.span>
  );
}

export function SparklesText({ children, className, sparklesCount = 10 }) {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const addSparkle = () => {
      const sparkle = generateSparkle();
      setSparkles((prev) => [...prev.slice(-sparklesCount + 1), sparkle]);
    };

    // Initial burst
    for (let i = 0; i < 4; i++) {
      setTimeout(addSparkle, i * 150);
    }

    // Ongoing sparkles
    const interval = setInterval(addSparkle, 800);
    return () => clearInterval(interval);
  }, [sparklesCount]);

  return (
    <span className={cn("relative inline-block", className)}>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <Sparkle key={sparkle.id} {...sparkle} />
        ))}
      </AnimatePresence>
      <strong className="relative z-10 font-bold">{children}</strong>
    </span>
  );
}
