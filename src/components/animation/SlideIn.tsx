/** @format */
// src/components/animation/SlideIn.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SlideInProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
}

export default function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
}: SlideInProps) {
  const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  };

  const initialPosition = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...initialPosition }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
