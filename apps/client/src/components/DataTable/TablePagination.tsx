import { TablePaginationProps } from "./types";

export default function TablePagination<TData>({
  table,
  totalCount,
  pagination,
  paginationClassName,
  enableServerSideProcessing,
}: TablePaginationProps<TData>) {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t ${paginationClassName} min-w-64 overflow-x-auto
      `}
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span>
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            enableServerSideProcessing
              ? totalCount
              : table.getFilteredRowModel().rows.length
          )}{" "}
          of{" "}
          {enableServerSideProcessing
            ? totalCount
            : table.getFilteredRowModel().rows.length}{" "}
          entries
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="p-1 rounded border disabled:opacity-50 hover:bg-gray-50"
          aria-label="First page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-1 rounded border disabled:opacity-50 hover:bg-gray-50"
          aria-label="Previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page numbers */}
        <div className="flex items-center">
          {Array.from(
            { length: Math.min(5, table.getPageCount()) },
            (_w, i) => {
              // Show pages around current page
              const startPage = Math.max(
                0,
                Math.min(
                  pagination.pageIndex - 2,
                  table.getPageCount() - 5
                )
              );
              const pageIndex = startPage + i;

              // Only render if within range
              if (pageIndex < table.getPageCount()) {
                return (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      pagination.pageIndex === pageIndex
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                );
              }
              return null;
            }
          )}
        </div>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-1 rounded border disabled:opacity-50 hover:bg-gray-50"
          aria-label="Next page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="p-1 rounded border disabled:opacity-50 hover:bg-gray-50"
          aria-label="Last page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>

        <select
          value={pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="border p-1 rounded text-sm bg-white"
        >
          {[10, 25, 50, 100, 250, 500].map((pageSize) => (
            <option
              key={pageSize}
              value={pageSize}
            >
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
