/** @format */
// src/components/ui/Badge.tsx
import { ReactNode } from "react";

type BadgeVariant = "green" | "red" | "yellow" | "blue" | "gray";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant,
  children,
  className = "",
}: BadgeProps) {
  const baseClasses = "text-xs px-2 py-1 rounded-full inline-flex items-center";

  const variantClasses = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
