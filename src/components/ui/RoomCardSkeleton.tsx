/** @format */

// src/components/ui/RoomCardSkeleton.tsx
import { Skeleton } from "./Skeleton";

export function RoomCardSkeleton() {
  return (
    <div className="min-w-[280px] bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}
