// [AI]
import { useState } from "react";
import { DashboardFilters } from "@/hooks/useDashboardFilters";
import SearchFilter from "./SearchFilter";
import DateRangeFilter from "./DateRangeFilter";
import AmountRangeFilter from "./AmountRangeFilter";
import SortControl from "./SortControl";
import { ChevronDown } from "lucide-react";

interface FilterPanelProps {
  filters: DashboardFilters;
  onFilterChange: (key: keyof DashboardFilters, value: any) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onAmountRangeChange: (min: string, max: string) => void;
  onSortChange: (
    sortBy: DashboardFilters["sortBy"],
    sortOrder: DashboardFilters["sortOrder"]
  ) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  onDateRangeChange,
  onAmountRangeChange,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
  className = "",
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg ${className}`}
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            Filters & Search
          </h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Always visible: Search and Sort */}
      <div className="p-4 space-y-4">
        <SearchFilter
          value={filters.searchQuery}
          onChange={(value) => onFilterChange("searchQuery", value)}
        />

        <SortControl
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={onSortChange}
        />
      </div>

      {/* Expandable filters */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[var(--border)]">
          <div className="pt-4 space-y-6">
            <DateRangeFilter
              startDate={filters.dateRange.startDate}
              endDate={filters.dateRange.endDate}
              onStartDateChange={(date) =>
                onDateRangeChange(date, filters.dateRange.endDate)
              }
              onEndDateChange={(date) =>
                onDateRangeChange(filters.dateRange.startDate, date)
              }
            />

            <AmountRangeFilter
              min={filters.amountRange.min}
              max={filters.amountRange.max}
              onMinChange={(min) =>
                onAmountRangeChange(min, filters.amountRange.max)
              }
              onMaxChange={(max) =>
                onAmountRangeChange(filters.amountRange.min, max)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
// [/AI]
