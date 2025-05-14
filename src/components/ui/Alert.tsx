/** @format */
// src/components/ui/Alert.tsx
import { X } from "lucide-react";
import { useState } from "react";

interface AlertProps {
  variant: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  className?: string;
  dismissible?: boolean;
}

export default function Alert({
  variant = "info",
  title,
  message,
  className = "",
  dismissible = true,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 ${getVariantStyles()} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h3 className="font-semibold">{title}</h3>}
          <p className={title ? "mt-1" : ""}>{message}</p>
        </div>
        {dismissible && (
          <button
            type="button"
            className="ml-4 text-gray-400 hover:text-gray-900"
            onClick={() => setIsVisible(false)}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
