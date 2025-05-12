/** @format */
// src/components/layout/PageContainer.tsx
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return <div className={`space-y-6 mb-16 ${className}`}>{children}</div>;
}
