// [AI]
import { useState, useMemo } from "react";
import { IncomeEntry } from "@/types/database";

export interface DashboardFilters {
  searchQuery: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  amountRange: {
    min: string;
    max: string;
  };
  sortBy: "date" | "amount" | "relevance";
  sortOrder: "asc" | "desc";
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

const defaultFilters: DashboardFilters = {
  searchQuery: "",
  dateRange: {
    startDate: "",
    endDate: "",
  },
  amountRange: {
    min: "",
    max: "",
  },
  sortBy: "date",
  sortOrder: "desc",
};

const defaultPagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
};

export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination);

  const updateFilter = (key: keyof DashboardFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const updateDateRange = (startDate: string, endDate: string) => {
    updateFilter("dateRange", { startDate, endDate });
  };

  const updateAmountRange = (min: string, max: string) => {
    updateFilter("amountRange", { min, max });
  };

  const updateSort = (
    sortBy: DashboardFilters["sortBy"],
    sortOrder: DashboardFilters["sortOrder"]
  ) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const updatePagination = (updates: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...updates }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPagination({ ...defaultPagination, totalItems: pagination.totalItems });
  };

  const filterEntries = useMemo(() => {
    return (entries: IncomeEntry[]) => {
      let filteredEntries = [...entries];

      // Search filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        filteredEntries = filteredEntries.filter(
          (entry) => entry.notes?.toLowerCase().includes(query) || false
        );
      }

      // Date range filter
      if (filters.dateRange.startDate) {
        filteredEntries = filteredEntries.filter(
          (entry) => entry.date >= filters.dateRange.startDate
        );
      }
      if (filters.dateRange.endDate) {
        filteredEntries = filteredEntries.filter(
          (entry) => entry.date <= filters.dateRange.endDate
        );
      }

      // Amount range filter
      if (filters.amountRange.min) {
        const minAmount = parseFloat(filters.amountRange.min);
        if (!isNaN(minAmount)) {
          filteredEntries = filteredEntries.filter(
            (entry) => entry.amount >= minAmount
          );
        }
      }
      if (filters.amountRange.max) {
        const maxAmount = parseFloat(filters.amountRange.max);
        if (!isNaN(maxAmount)) {
          filteredEntries = filteredEntries.filter(
            (entry) => entry.amount <= maxAmount
          );
        }
      }

      // Sorting
      filteredEntries.sort((a, b) => {
        let comparison = 0;

        switch (filters.sortBy) {
          case "date":
            comparison =
              new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case "amount":
            comparison = a.amount - b.amount;
            break;
          case "relevance":
            // For relevance, prioritize entries with search matches in notes
            if (filters.searchQuery.trim()) {
              const aHasMatch =
                a.notes
                  ?.toLowerCase()
                  .includes(filters.searchQuery.toLowerCase()) || false;
              const bHasMatch =
                b.notes
                  ?.toLowerCase()
                  .includes(filters.searchQuery.toLowerCase()) || false;
              if (aHasMatch && !bHasMatch) return -1;
              if (!aHasMatch && bHasMatch) return 1;
            }
            // Fall back to date sorting for relevance
            comparison =
              new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
        }

        return filters.sortOrder === "asc" ? comparison : -comparison;
      });

      // Update total items for pagination
      setPagination((prev) => ({
        ...prev,
        totalItems: filteredEntries.length,
      }));

      // Pagination
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

      return {
        entries: paginatedEntries,
        totalEntries: filteredEntries.length,
        filteredEntries: filteredEntries,
      };
    };
  }, [filters, pagination.currentPage, pagination.itemsPerPage]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery.trim() !== "" ||
      filters.dateRange.startDate !== "" ||
      filters.dateRange.endDate !== "" ||
      filters.amountRange.min !== "" ||
      filters.amountRange.max !== "" ||
      filters.sortBy !== "date" ||
      filters.sortOrder !== "desc"
    );
  }, [filters]);

  return {
    filters,
    pagination,
    updateFilter,
    updateDateRange,
    updateAmountRange,
    updateSort,
    updatePagination,
    resetFilters,
    filterEntries,
    hasActiveFilters,
  };
}
// [/AI]
