"use client";

import { useEffect, useMemo } from "react";
import { useIncome, useIncomeSummary } from "@/hooks/useIncome";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { formatCurrency, formatDate } from "@/lib/validation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import DataTable from "@/components/data/DataTable";
import FilterPanel from "@/components/dashboard/FilterPanel";
import Pagination from "@/components/dashboard/Pagination";
import { IncomeEntry } from "@/types/database";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  BarChart3,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const { entries, loading, error, fetchEntries } = useIncome();
  const {
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
  } = useDashboardFilters();

  useEffect(() => {
    fetchEntries(100); // Fetch more entries to ensure accurate 30-day calculations
  }, [fetchEntries]);

  // Apply filters and pagination to entries
  const {
    entries: filteredEntries,
    totalEntries: filteredTotal,
    filteredEntries: allFilteredEntries,
  } = useMemo(() => {
    return filterEntries(entries);
  }, [entries, filterEntries]);

  // Calculate summaries based on all filtered entries (not just current page)
  const { last7DaysTotal, last30DaysTotal, monthlyAverage, totalEntries } =
    useIncomeSummary(allFilteredEntries);

  const tableColumns = [
    {
      key: "date" as keyof IncomeEntry,
      header: "Date",
      render: (value: any) => formatDate(value),
    },
    {
      key: "amount" as keyof IncomeEntry,
      header: "Amount",
      render: (value: any) => formatCurrency(Number(value)),
    },
    {
      key: "notes" as keyof IncomeEntry,
      header: "Notes",
      render: (value: any) => (
        <span className="text-[var(--text-muted)]">{value || "—"}</span>
      ),
      className: "max-w-xs truncate",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <span className="ml-2 text-[var(--text-muted)]">
            Loading your income data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <ErrorMessage message={error} />
        <button
          onClick={() => fetchEntries()}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-2xl sm:rounded-3xl"></div>
        <div className="relative px-4 sm:px-8 py-6 sm:py-8 lg:py-12 text-center">
          <div className="flex flex-col sm:inline-flex sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-primary rounded-xl sm:rounded-2xl shadow-lg">
              <LayoutDashboard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200">
              Income Dashboard
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-0">
            Track your financial progress with beautiful insights and detailed
            analytics
          </p>
          {totalEntries > 0 && (
            <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/50 dark:bg-slate-800/50 rounded-full text-xs sm:text-sm text-gray-600 dark:text-gray-300 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{totalEntries}</span> total entries
            </div>
          )}
        </div>
      </div>

      {/* Modern Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 7 Days Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm card-hover">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 sm:px-3 py-1 rounded-full">
                7 DAYS
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {hasActiveFilters ? "Filtered " : ""}Recent Total
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(last7DaysTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* 30 Days Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm card-hover">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 sm:px-3 py-1 rounded-full">
                30 DAYS
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {hasActiveFilters ? "Filtered " : ""}Monthly Total
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {formatCurrency(last30DaysTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* Daily Average Card */}
        <div className="group relative sm:col-span-2 lg:col-span-1">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm card-hover">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 sm:px-3 py-1 rounded-full">
                30 DAYS
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                {hasActiveFilters ? "Filtered " : ""}Average per Entry
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatCurrency(monthlyAverage)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Panel */}
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-lg">
        <FilterPanel
          filters={filters}
          onFilterChange={updateFilter}
          onDateRangeChange={updateDateRange}
          onAmountRangeChange={updateAmountRange}
          onSortChange={updateSort}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Modern Entries Section */}
      <div className="space-y-4 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg sm:rounded-xl">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {hasActiveFilters ? "Filtered " : ""}Income Entries
            </h3>
          </div>
          {filteredTotal > 0 && (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {hasActiveFilters
                  ? `${filteredTotal} of ${entries.length} entries`
                  : `${filteredTotal} entries`}
              </span>
              <span className="sm:hidden">{filteredTotal}</span>
            </div>
          )}
        </div>

        {/* Data Table Container */}
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
          <DataTable
            data={filteredEntries}
            columns={tableColumns}
            emptyMessage={
              hasActiveFilters
                ? "No entries match your current filters. Try adjusting your search criteria."
                : "No income entries found. Start by adding your first entry!"
            }
          />
        </div>

        {/* Enhanced Pagination */}
        <div className="flex justify-center">
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-lg p-1">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updatePagination({ currentPage: page })}
              onItemsPerPageChange={(itemsPerPage) =>
                updatePagination({ itemsPerPage, currentPage: 1 })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
