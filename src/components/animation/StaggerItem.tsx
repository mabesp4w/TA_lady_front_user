/** @format */
// src/components/animation/StaggerItem.tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export default function StaggerItem({
  children,
  className = "",
}: StaggerItemProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  );
}
