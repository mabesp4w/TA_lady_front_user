/** @format */
// src/components/ui/Button.tsx
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses = "font-medium rounded-lg transition-colors";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-primary text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5",
  };

  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${isDisabled ? "opacity-70 cursor-not-allowed" : ""} 
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
          Memproses...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </span>
      )}
    </button>
  );
}
