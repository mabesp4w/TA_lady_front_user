/** @format */
// src/components/form/FormDateInput.tsx
import { InputHTMLAttributes, forwardRef } from "react";
import { Calendar } from "lucide-react";

interface FormDateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FormDateInput = forwardRef<HTMLInputElement, FormDateInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
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
            type="date"
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`}
            {...props}
          />
          <Calendar
            className="absolute right-3 top-3.5 text-gray-400"
            size={18}
          />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

FormDateInput.displayName = "FormDateInput";

export default FormDateInput;
