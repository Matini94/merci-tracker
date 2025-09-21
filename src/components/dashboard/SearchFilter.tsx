// [AI]
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchFilter({
  value,
  onChange,
  placeholder = "Search in notes...",
  className = "",
}: SearchFilterProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const clearSearch = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search
            className="h-5 w-5 text-[var(--text-muted)]"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-[var(--border)] rounded-md leading-5 bg-[var(--surface-elevated)] text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-colors"
          placeholder={placeholder}
          aria-label="Search entries"
        />
        {localValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
// [/AI]
