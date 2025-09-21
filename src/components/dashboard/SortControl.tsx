// [AI]
import { DashboardFilters } from "@/hooks/useDashboardFilters";
import { ArrowDown } from "lucide-react";

interface SortControlProps {
  sortBy: DashboardFilters["sortBy"];
  sortOrder: DashboardFilters["sortOrder"];
  onSortChange: (
    sortBy: DashboardFilters["sortBy"],
    sortOrder: DashboardFilters["sortOrder"]
  ) => void;
  className?: string;
}

export default function SortControl({
  sortBy,
  sortOrder,
  onSortChange,
  className = "",
}: SortControlProps) {
  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "amount", label: "Amount" },
    { value: "relevance", label: "Relevance" },
  ] as const;

  const handleSortByChange = (newSortBy: DashboardFilters["sortBy"]) => {
    // If selecting the same sort field, toggle the order
    if (newSortBy === sortBy) {
      onSortChange(newSortBy, sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Default to desc for new sort field (most recent/highest first)
      onSortChange(newSortBy, "desc");
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500">Sort by:</span>
      <div className="flex items-center gap-1">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSortByChange(option.value)}
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1 ${
              sortBy === option.value
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-pressed={sortBy === option.value}
            aria-label={`Sort by ${option.label.toLowerCase()}${
              sortBy === option.value ? `, currently ${sortOrder}ending` : ""
            }`}
          >
            {option.label}
            {sortBy === option.value && (
              <ArrowDown
                className={`w-4 h-4 transition-transform ${
                  sortOrder === "asc" ? "rotate-0" : "rotate-180"
                }`}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
// [/AI]
