/** @format */
// src/components/form/FormInput.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-gray-700 text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
              icon ? "pl-10" : ""
            } ${className}`}
            {...props}
          />
          {icon && (
            <span className="absolute left-3 top-3.5 text-gray-400">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
