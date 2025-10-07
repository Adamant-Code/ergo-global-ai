import { forwardRef, Ref } from "react";
import { TableControlsProps } from "./types";
import { Table } from "@tanstack/react-table";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const TableControls = forwardRef(TableControlsRef) as <TData>(
  props: TableControlsProps<TData> & {
    ref?: React.Ref<HTMLInputElement>;
  }
) => ReturnType<typeof TableControlsRef>;

function TableControlsRef<TData>(
  {
    table,
    enableSearch,
    globalFilter,
    selectedRows,
    onBulkDelete,
    hideControls,
    setGlobalFilter,
    enableRowSelection,
    enableColumnVisibility,
  }: TableControlsProps<TData>,
  ref: Ref<HTMLInputElement>
) {
  return (
    <>
      {!hideControls && (
        <div className="p-4 border-b space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <SearchInputRef
              ref={ref}
              enableSearch={enableSearch}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            <div className="flex items-center gap-2 ml-auto">
              {/* Bulk Actions */}
              {enableRowSelection && selectedRows.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {selectedRows.length} selected
                  </span>
                  {onBulkDelete && (
                    <button
                      onClick={() => onBulkDelete(selectedRows)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-200 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      Delete Selected
                    </button>
                  )}
                </div>
              )}

              <ColumnVisibility
                table={table}
                enableColumnVisibility={enableColumnVisibility}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchInput(
  {
    enableSearch,
    globalFilter,
    setGlobalFilter,
  }: {
    globalFilter: string;
    enableSearch: boolean;
    setGlobalFilter: (value: React.SetStateAction<string>) => void;
  },
  ref: Ref<HTMLInputElement>
) {
  return (
    <>
      {enableSearch && (
        <div className="relative w-full sm:max-w-xs">
          <input
            ref={ref}
            type="text"
            value={globalFilter ?? ""}
            placeholder="Search..."
            aria-label="Search all columns"
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400">
            <kbd className="px-1 bg-gray-100 rounded">Ctrl+/</kbd>
          </div>
        </div>
      )}
    </>
  );
}

function ColumnVisibility<TData>({
  table,
  enableColumnVisibility,
}: {
  table: Table<TData>;
  enableColumnVisibility: boolean;
}) {
  return (
    <>
      {enableColumnVisibility && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="px-3 py-1 text-sm border rounded inline-flex items-center gap-1">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Columns
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="p-2 border rounded bg-white shadow-lg min-w-[180px] z-50 flex flex-col gap-1">
              {table.getAllLeafColumns().map((column) => {
                if (column.id === "select") return null;
                return (
                  <DropdownMenu.CheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    className={`flex items-center gap-2 p-2 text-sm ${
                      !column.getIsVisible() ? "opacity-50" : ""
                    } hover:bg-gray-50 cursor-pointer bg-gray-100 rounded-sm`}
                  >
                    <div className="flex-1">{column.id}</div>
                  </DropdownMenu.CheckboxItem>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </>
  );
}

const SearchInputRef = forwardRef(SearchInput);
SearchInputRef.displayName = "SearchInputRef";

// @ts-expect-error - TypeScript doesn't recognize displayName, but it's valid at runtime
TableControls.displayName = "TableControls";

export default TableControls;
