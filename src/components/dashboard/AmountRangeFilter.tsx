// [AI]
interface AmountRangeFilterProps {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  className?: string;
}

export default function AmountRangeFilter({
  min,
  max,
  onMinChange,
  onMaxChange,
  className = "",
}: AmountRangeFilterProps) {
  const clearAmountRange = () => {
    onMinChange("");
    onMaxChange("");
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid decimal numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onMinChange(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid decimal numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onMaxChange(value);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Amount Range (RM)
        </label>
        {(min || max) && (
          <button
            type="button"
            onClick={clearAmountRange}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label htmlFor="min-amount" className="sr-only">
            Minimum amount
          </label>
          <input
            id="min-amount"
            type="text"
            inputMode="decimal"
            value={min}
            onChange={handleMinChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Min amount"
          />
        </div>
        <div>
          <label htmlFor="max-amount" className="sr-only">
            Maximum amount
          </label>
          <input
            id="max-amount"
            type="text"
            inputMode="decimal"
            value={max}
            onChange={handleMaxChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Max amount"
          />
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Enter amounts in Malaysian Ringgit (RM)
      </div>
    </div>
  );
}
// [/AI]
