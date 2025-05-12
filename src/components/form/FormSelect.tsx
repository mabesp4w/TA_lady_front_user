/** @format */
// src/components/form/FormSelect.tsx
import { SelectHTMLAttributes, forwardRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  icon?: React.ReactNode;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-gray-700 text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none ${
              icon ? "pl-10" : ""
            } ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {icon && (
            <span className="absolute left-3 top-3.5 text-gray-400">
              {icon}
            </span>
          )}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
