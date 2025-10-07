import {
  Header,
  flexRender,
  HeaderGroup,
} from "@tanstack/react-table";
import { TableHeaderProps } from "./types";
import * as Popover from "@radix-ui/react-popover";

export default function TableHeader<TData>({
  table,
  enableSorting,
  enableFiltering,
  headerClassName,
  enableRowSelection,
}: TableHeaderProps<TData>) {
  return (
    <thead
      className={`sticky top-0 z-10 bg-white shadow-sm ${headerClassName}`}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className="border-b"
        >
          {/* Row Selection Header */}
          {enableRowSelection && (
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
                ref={(el) => {
                  if (el) {
                    el.indeterminate =
                      table.getIsSomePageRowsSelected();
                  }
                }}
                className="rounded"
              />
            </th>
          )}

          {/* Column Headers */}
          {headerGroup.headers.map((header, index) => (
            <th
              key={header.id}
              className="px-4 py-3 text-left font-medium text-gray-700"
            >
              {header.isPlaceholder ? null : (
                <>
                  {/* Column Header with Sort */}
                  <div className="flex items-center gap-2">
                    <div
                      {...(enableSorting && header.column.getCanSort()
                        ? {
                            className:
                              "flex items-center gap-1 cursor-pointer select-none whitespace-nowrap",
                            onClick:
                              header.column.getToggleSortingHandler(),
                          } 
                        : {
                            className: "flex items-center gap-1 whitespace-nowrap",
                          })}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <SortIndicator
                        index={index}
                        header={header}
                        headerGroup={headerGroup}
                        enableSorting={enableFiltering}
                      />
                    </div>

                    <ColumnFilter
                      header={header}
                      enableFiltering={enableFiltering}
                    />
                  </div>
                </>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

function ColumnFilter<TData>({
  header,
  enableFiltering,
}: {
  enableFiltering: boolean;
  header: Header<TData, unknown>;
}) {
  return (
    <>
      {enableFiltering && header.column.getCanFilter() && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="p-4 bg-white rounded shadow-lg border z-50 min-w-[200px]"
              sideOffset={5}
            >
              <div className="space-y-2">
                <h3 className="font-medium text-sm">
                  Filter by {header.column.id}
                </h3>
                <input
                  type="text"
                  value={
                    (header.column.getFilterValue() ?? "") as string
                  }
                  onChange={(e) =>
                    header.column.setFilterValue(e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                  placeholder={`Filter ${header.column.id}...`}
                />
                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => header.column.setFilterValue("")}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                  <Popover.Close className="text-xs text-blue-500 hover:text-blue-700">
                    Apply
                  </Popover.Close>
                </div>
              </div>
              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </>
  );
}

function SortIndicator<TData>({
  index,
  header,
  headerGroup,
  enableSorting,
}: {
  index: number;
  enableSorting: boolean;
  header: Header<TData, unknown>;
  headerGroup: HeaderGroup<TData>;
}) {
  const isSerialNumber = header.column?.id === "serialNumber";
  const isActionHeader = headerGroup.headers.length - 1 === index;

  if (!enableSorting || isActionHeader || isSerialNumber) return null;

  return (
    <button
      aria-label={`Sort by ${header.column.id}`}
      className="focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded p-1"
    >
      {header.column.getIsSorted() === "asc" ? (
        <svg
          className={`h-4 w-4 ${
            typeof header.column.getIsSorted() === "boolean"
              ? "opacity-50"
              : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M5 15l7-7 7 7"
          />
        </svg>
      ) : (
        <svg
          className={`h-4 w-4 ${
            !header.column.getIsSorted() ? "opacity-50" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </button>
  );
}
