"use client";

import { useState } from "react";
import { formatDate } from "@/lib/validation";
import { Calendar } from "lucide-react";
import Card from "@/components/ui/Card";

// [AI]
interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onRangeChange: (range: { start: string; end: string }) => void;
}

const PRESET_RANGES = [
  {
    label: "Last 7 days",
    getValue: () => ({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    }),
  },
  {
    label: "Last 90 days",
    getValue: () => ({
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    }),
  },
  {
    label: "Last year",
    getValue: () => ({
      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    }),
  },
  {
    label: "This month",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);

      // Use local timezone to avoid UTC conversion issues
      const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      return {
        start: formatLocalDate(start),
        end: formatLocalDate(now),
      };
    },
  },
  {
    label: "This year",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return {
        start: start.toISOString().split("T")[0],
        end: now.toISOString().split("T")[0],
      };
    },
  },
];

export default function DateRangeSelector({
  startDate,
  endDate,
  onRangeChange,
}: DateRangeSelectorProps) {
  const [customRange, setCustomRange] = useState({
    start: startDate,
    end: endDate,
  });
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetClick = (preset: (typeof PRESET_RANGES)[0]) => {
    const range = preset.getValue();
    onRangeChange(range);
    setCustomRange(range);
    setShowCustom(false);
  };

  const handleCustomRangeChange = (field: "start" | "end", value: string) => {
    const newRange = { ...customRange, [field]: value };
    setCustomRange(newRange);

    // Validate date range
    if (newRange.start <= newRange.end) {
      onRangeChange(newRange);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Date Range
            </h3>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            {formatDisplayDate(startDate)} → {formatDisplayDate(endDate)}
          </div>
        </div>

        {/* Preset Range Buttons */}
        <div className="flex flex-wrap gap-2">
          {PRESET_RANGES.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              showCustom
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            Custom Range
          </button>
        </div>

        {/* Custom Date Range Inputs */}
        {showCustom && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-600">
            <div className="space-y-2">
              <label
                htmlFor="start-date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={customRange.start}
                onChange={(e) =>
                  handleCustomRangeChange("start", e.target.value)
                }
                max={customRange.end}
                className="w-full px-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900 date-input"
                style={{
                  colorScheme: "light dark",
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="end-date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={customRange.end}
                onChange={(e) => handleCustomRangeChange("end", e.target.value)}
                min={customRange.start}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900 date-input"
                style={{
                  colorScheme: "light dark",
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
// [/AI]
