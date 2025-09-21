"use client";

import { useMemo } from "react";
import { IncomeEntry } from "@/types/database";
import { Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/validation";

// [AI]
interface CalendarHeatmapProps {
  entries: IncomeEntry[];
  height?: number;
}

interface DayData {
  date: string;
  amount: number;
  dayOfWeek: number;
  weekOfYear: number;
}

export default function CalendarHeatmap({
  entries,
  height = 200,
}: CalendarHeatmapProps) {
  const heatmapData = useMemo(() => {
    // Create a map of dates to total amounts
    const dateAmounts = new Map<string, number>();
    entries.forEach((entry) => {
      const date = entry.date;
      dateAmounts.set(
        date,
        (dateAmounts.get(date) || 0) + Number(entry.amount || 0)
      );
    });

    // Get date range for the last 365 days or available data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 365);

    const days: DayData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const amount = dateAmounts.get(dateStr) || 0;

      // Calculate week of year
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const weekOfYear = Math.ceil(
        ((currentDate.getTime() - startOfYear.getTime()) / 86400000 +
          startOfYear.getDay() +
          1) /
          7
      );

      days.push({
        date: dateStr,
        amount,
        dayOfWeek: currentDate.getDay(),
        weekOfYear,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate intensity levels based on amounts
    const amounts = days.map((d) => d.amount).filter((a) => a > 0);
    const maxAmount = Math.max(...amounts, 1);
    const quartiles = [
      0,
      Math.max(1, maxAmount * 0.25),
      Math.max(1, maxAmount * 0.5),
      Math.max(1, maxAmount * 0.75),
      maxAmount,
    ];

    const daysWithIntensity = days.map((day) => ({
      ...day,
      intensity:
        day.amount === 0
          ? 0
          : day.amount <= quartiles[1]
          ? 1
          : day.amount <= quartiles[2]
          ? 2
          : day.amount <= quartiles[3]
          ? 3
          : 4,
    }));

    return { days: daysWithIntensity, quartiles };
  }, [entries]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-gray-100 dark:bg-slate-700";
      case 1:
        return "bg-green-200 dark:bg-green-900";
      case 2:
        return "bg-green-300 dark:bg-green-800";
      case 3:
        return "bg-green-400 dark:bg-green-700";
      case 4:
        return "bg-green-500 dark:bg-green-600";
      default:
        return "bg-gray-100 dark:bg-slate-700";
    }
  };

  const getTooltipText = (day: DayData) => {
    const date = formatDate(day.date);
    if (day.amount === 0) {
      return `${date}: No income recorded`;
    }
    return `${date}: ${formatCurrency(day.amount)}`;
  };

  // Group days by week for display
  const weeks = useMemo(() => {
    const weekMap = new Map<number, DayData[]>();
    heatmapData.days.forEach((day) => {
      if (!weekMap.has(day.weekOfYear)) {
        weekMap.set(day.weekOfYear, []);
      }
      weekMap.get(day.weekOfYear)!.push(day);
    });

    return Array.from(weekMap.values()).map((week) => {
      // Pad weeks to have 7 days (fill missing days with empty data)
      const paddedWeek = new Array(7).fill(null);
      week.forEach((day) => {
        paddedWeek[day.dayOfWeek] = day;
      });
      return paddedWeek;
    });
  }, [heatmapData.days]);

  if (entries.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-slate-700/50 rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No data available for heatmap visualization
          </p>
        </div>
      </div>
    );
  }

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 min-w-max">
          {/* Weekday labels */}
          <div className="flex gap-1 ml-8">
            {weekdayLabels.map((label, index) => (
              <div
                key={index}
                className="w-3 h-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center"
                style={{ fontSize: "10px" }}
              >
                {index % 2 === 0 ? label[0] : ""}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {/* Month labels (simplified) */}
            <div className="flex flex-col gap-1 w-6">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="w-3 h-3"></div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.slice(-52).map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm border border-gray-200 dark:border-slate-600 ${
                      day ? getIntensityColor(day.intensity) : "bg-transparent"
                    }`}
                    title={day ? getTooltipText(day) : ""}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1 mx-2">
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div
              key={intensity}
              className={`w-3 h-3 rounded-sm border border-gray-200 dark:border-slate-600 ${getIntensityColor(
                intensity
              )}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-slate-600">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {entries.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Days
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {heatmapData.days.filter((d) => d.amount > 0).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Active Days
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(heatmapData.quartiles[4])}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Best Day
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {Math.round(
              (heatmapData.days.filter((d) => d.amount > 0).length /
                heatmapData.days.length) *
                100
            )}
            %
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Activity Rate
          </div>
        </div>
      </div>
    </div>
  );
}
// [/AI]
