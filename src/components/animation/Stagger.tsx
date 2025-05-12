/** @format */
// src/components/animation/Stagger.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export default function Stagger({
  children,
  staggerDelay = 0.1,
  className = "",
}: StaggerProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}
