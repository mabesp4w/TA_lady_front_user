/** @format */
// src/components/ui/EmptyState.tsx
import { ReactNode } from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-10 bg-white rounded-lg shadow-md">
      {icon && <div className="mx-auto text-gray-300">{icon}</div>}
      <h2 className="text-xl font-semibold mt-4">{title}</h2>
      <p className="text-gray-500 mt-2">{description}</p>
      {action && (
        <Button variant="primary" className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
