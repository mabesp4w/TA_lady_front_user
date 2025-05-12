/** @format */
// src/components/layout/PageHeader.tsx
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {actions && <div>{actions}</div>}
    </div>
  );
}
