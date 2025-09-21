// [AI]
import { PaginationState } from "@/hooks/useDashboardFilters";

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  className?: string;
}

export default function Pagination({
  pagination,
  onPageChange,
  onItemsPerPageChange,
  className = "",
}: PaginationProps) {
  const { currentPage, itemsPerPage, totalItems } = pagination;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const itemsPerPageOptions = [10, 25, 50, 100];

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show pages 2, 3, 4 and ellipsis
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show ellipsis and last 4 pages
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis, current page with neighbors, ellipsis
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}
    >
      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-sm">
        <label
          htmlFor="items-per-page"
          className="font-medium text-gray-700 dark:text-gray-300"
        >
          Show:
        </label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="font-medium text-gray-500 dark:text-gray-400">
          per page
        </span>
      </div>

      {/* Results info and pagination controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Results info */}
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-1.5 bg-gray-100/50 dark:bg-slate-700/50 rounded-lg backdrop-blur-sm">
          Showing {startItem} to {endItem} of {totalItems} entries
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <nav className="flex items-center gap-1" aria-label="Pagination">
            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:border-blue-300 dark:hover:border-slate-500 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Previous page"
            >
              Previous
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <span key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border border-blue-400 shadow-lg hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25"
                        : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:border-blue-300 dark:hover:border-slate-500 hover:text-blue-700 dark:hover:text-blue-300"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                )}
              </span>
            ))}

            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:border-blue-300 dark:hover:border-slate-500 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Next page"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
// [/AI]
