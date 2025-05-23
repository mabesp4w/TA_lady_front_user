/** @format */

// src/components/ui/Skeleton.tsx
import { cn } from "@/utils/classNames";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
}
