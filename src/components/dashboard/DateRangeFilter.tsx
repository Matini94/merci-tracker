// [AI]
interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = "",
}: DateRangeFilterProps) {
  const clearDateRange = () => {
    onStartDateChange("");
    onEndDateChange("");
  };

  const setPresetRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    onStartDateChange(startDate.toISOString().slice(0, 10));
    onEndDateChange(endDate.toISOString().slice(0, 10));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date Range
        </label>
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={clearDateRange}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label htmlFor="start-date" className="sr-only">
            Start date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="block w-full px-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900 text-sm date-input"
            placeholder="Start date"
            style={{
              colorScheme: "light dark",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>
        <div>
          <label htmlFor="end-date" className="sr-only">
            End date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="block w-full px-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900 text-sm date-input"
            placeholder="End date"
            style={{
              colorScheme: "light dark",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setPresetRange(7)}
          className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          Last 7 days
        </button>
        <button
          type="button"
          onClick={() => setPresetRange(30)}
          className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          Last 30 days
        </button>
        <button
          type="button"
          onClick={() => setPresetRange(90)}
          className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          Last 3 months
        </button>
      </div>
    </div>
  );
}
// [/AI]
