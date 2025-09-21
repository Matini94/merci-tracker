// [AI]
import { useState, useCallback, useRef } from "react";
import { Check, AlertCircle } from "lucide-react";

interface EnhancedFormInputProps {
  label: string;
  type?: "text" | "email" | "password" | "number" | "date" | "tel" | "url";
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  hint?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url";
  step?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export default function EnhancedFormInput({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  success = false,
  hint,
  inputMode,
  step,
  min,
  max,
  maxLength,
  autoComplete,
  className = "",
  inputClassName = "",
  icon,
  rightIcon,
  loading = false,
}: EnhancedFormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const inputId = `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  const getInputClasses = () => {
    const baseClasses =
      "block w-full px-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200";
    const iconPadding = icon ? "pl-10" : "";
    const rightIconPadding = rightIcon || success ? "pr-10" : "";

    let stateClasses = "";
    if (error) {
      stateClasses =
        "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20";
    } else if (success) {
      stateClasses =
        "border-green-300 dark:border-green-700 focus:border-green-500 focus:ring-green-500/20";
    } else if (isFocused) {
      stateClasses =
        "border-blue-300 dark:border-blue-700 focus:border-blue-500 focus:ring-blue-500/20";
    } else {
      stateClasses =
        "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400 dark:hover:border-gray-500";
    }

    const disabledClasses = disabled
      ? "bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
      : "bg-white dark:bg-gray-900";

    // Special handling for date inputs to ensure calendar visibility
    const dateClasses = type === "date" ? "date-input" : "";

    return `${baseClasses} ${iconPadding} ${rightIconPadding} ${stateClasses} ${disabledClasses} ${dateClasses} ${inputClassName}`;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-[var(--text-muted)]"
      >
        {label}
        {required && <span className="text-[var(--error)] ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div
              className={
                error
                  ? "text-red-500 dark:text-red-400"
                  : success
                  ? "text-green-500 dark:text-green-400"
                  : "text-gray-400 dark:text-gray-500"
              }
            >
              {icon}
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || loading}
          required={required}
          inputMode={inputMode}
          step={step}
          min={min}
          max={max}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={getInputClasses()}
          aria-invalid={!!error}
          aria-describedby={
            [errorId, hintId].filter(Boolean).join(" ") || undefined
          }
          style={
            type === "date"
              ? {
                  colorScheme: "light dark",
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }
              : undefined
          }
        />

        {(rightIcon || loading || success) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            ) : success ? (
              <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
            ) : rightIcon ? (
              <div
                className={
                  error
                    ? "text-red-500 dark:text-red-400"
                    : "text-gray-400 dark:text-gray-500"
                }
              >
                {rightIcon}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400 flex items-center mt-2"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      {hint && !error && (
        <p
          id={hintId}
          className="text-sm text-gray-500 dark:text-gray-400 mt-1"
        >
          {hint}
        </p>
      )}
    </div>
  );
}
// [/AI]
