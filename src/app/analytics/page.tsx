"use client";

import { useEffect, useState, useMemo } from "react";
import { useIncome } from "@/hooks/useIncome";
import { formatCurrency, formatDate } from "@/lib/validation";
import { IncomeEntry } from "@/types/database";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Card from "@/components/ui/Card";
import IncomeChart from "@/components/analytics/IncomeChart";
import TrendChart from "@/components/analytics/TrendChart";
import CalendarHeatmap from "@/components/analytics/CalendarHeatmap";
import ExportData from "@/components/analytics/ExportData";
import DateRangeSelector from "@/components/analytics/DateRangeSelector";
import {
  BarChart3,
  DollarSign,
  Calculator,
  TrendingUp,
  FileText,
} from "lucide-react";

// [AI]
interface AnalyticsData {
  totalIncome: number;
  averageDaily: number;
  highestDay: number;
  entriesCount: number;
  monthlyTotals: { month: string; total: number }[];
  dailyTrends: { date: string; amount: number }[];
  weekdayAverages: { day: string; average: number }[];
}

export default function AnalyticsPage() {
  const { entries, loading, error, fetchEntries } = useIncome();
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 1 year ago
    end: new Date().toISOString().split("T")[0], // today
  });

  useEffect(() => {
    fetchEntries(1000); // Fetch more entries for analytics
  }, [fetchEntries]);

  // Filter entries by selected date range
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date).toISOString().split("T")[0];
      return (
        entryDate >= selectedDateRange.start &&
        entryDate <= selectedDateRange.end
      );
    });
  }, [entries, selectedDateRange]);

  // Calculate analytics data
  const analyticsData: AnalyticsData = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        totalIncome: 0,
        averageDaily: 0,
        highestDay: 0,
        entriesCount: 0,
        monthlyTotals: [],
        dailyTrends: [],
        weekdayAverages: [],
      };
    }

    const totalIncome = filteredEntries.reduce(
      (sum, entry) => sum + Number(entry.amount || 0),
      0
    );

    const uniqueDays = new Set(filteredEntries.map((entry) => entry.date)).size;
    const averageDaily = uniqueDays > 0 ? totalIncome / uniqueDays : 0;

    const highestDay = Math.max(
      ...filteredEntries.map((entry) => Number(entry.amount || 0))
    );

    // Monthly totals
    const monthlyData = new Map<string, number>();
    filteredEntries.forEach((entry) => {
      const month = new Date(entry.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
      monthlyData.set(
        month,
        (monthlyData.get(month) || 0) + Number(entry.amount || 0)
      );
    });

    const monthlyTotals = Array.from(monthlyData.entries())
      .map(([month, total]) => ({ month, total }))
      .sort(
        (a, b) =>
          new Date(a.month + " 1, 2000").getTime() -
          new Date(b.month + " 1, 2000").getTime()
      );

    // Daily trends (last 30 days or available data)
    const dailyData = new Map<string, number>();
    filteredEntries.forEach((entry) => {
      const date = entry.date;
      dailyData.set(
        date,
        (dailyData.get(date) || 0) + Number(entry.amount || 0)
      );
    });

    const dailyTrends = Array.from(dailyData.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days

    // Weekday averages
    const weekdayData = new Map<string, { total: number; count: number }>();
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    filteredEntries.forEach((entry) => {
      const weekday = weekdays[new Date(entry.date).getDay()];
      const current = weekdayData.get(weekday) || { total: 0, count: 0 };
      weekdayData.set(weekday, {
        total: current.total + Number(entry.amount || 0),
        count: current.count + 1,
      });
    });

    const weekdayAverages = weekdays.map((day) => ({
      day,
      average: weekdayData.has(day)
        ? weekdayData.get(day)!.total / weekdayData.get(day)!.count
        : 0,
    }));

    return {
      totalIncome,
      averageDaily,
      highestDay,
      entriesCount: filteredEntries.length,
      monthlyTotals,
      dailyTrends,
      weekdayAverages,
    };
  }, [filteredEntries]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Income Analytics</h2>
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <span className="ml-2 text-gray-600">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Income Analytics</h2>
        <ErrorMessage message={error} />
        <button
          onClick={() => fetchEntries(1000)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-2xl sm:rounded-3xl"></div>
        <div className="relative px-4 sm:px-8 py-6 sm:py-8 lg:py-12 text-center">
          <div className="flex flex-col sm:inline-flex sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent dark:from-white dark:via-purple-200 dark:to-blue-200">
              Income Analytics
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-0">
            Comprehensive insights and detailed analysis of your income patterns
          </p>
        </div>
      </div>

      {/* Date Range Selector */}
      <DateRangeSelector
        startDate={selectedDateRange.start}
        endDate={selectedDateRange.end}
        onRangeChange={setSelectedDateRange}
      />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Income
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(analyticsData.totalIncome)}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl">
                <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                Daily Average
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(analyticsData.averageDaily)}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                Highest Day
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(analyticsData.highestDay)}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative sm:col-span-2 lg:col-span-1">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg sm:rounded-xl">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Entries
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 dark:text-orange-400">
                {analyticsData.entriesCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Monthly Income Chart */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Monthly Income Trends
          </h3>
          <IncomeChart data={analyticsData.monthlyTotals} />
        </Card>

        {/* Daily Trends Chart */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Daily Income Trends (Last 30 Days)
          </h3>
          <TrendChart data={analyticsData.dailyTrends} />
        </Card>

        {/* Weekday Averages Chart */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Average Income by Weekday
          </h3>
          <IncomeChart
            data={analyticsData.weekdayAverages.map((item) => ({
              month: item.day,
              total: item.average,
            }))}
            type="bar"
          />
        </Card>

        {/* Export Data Section */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
            Data Export
          </h3>
          <ExportData
            entries={filteredEntries}
            analyticsData={analyticsData}
            dateRange={selectedDateRange}
          />
        </Card>
      </div>

      {/* Calendar Heatmap */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
          Income Calendar Heatmap
        </h3>
        <CalendarHeatmap entries={filteredEntries} />
      </Card>
    </div>
  );
}
// [/AI]
