/** @format */
// src/components/ui/LoadingSpinner.tsx

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  color = "border-primary",
  text = "Loading...",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 ${color} ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  );
}
