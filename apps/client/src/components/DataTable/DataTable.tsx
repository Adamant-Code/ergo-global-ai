"use client";

// Types
import {
  DataTableProps,
  DataTableFetchOptions,
  DataTableFetchResponse,
} from "./types";
import serverFetching from "./helpers";

// Components
import TableLoader from "./TableLoader";
import TableControls from "./TableControls";
import TableContainer from "./TableContainer";
import TableErrorState from "./TableErrorState";
import TableEmptyState from "./TableEmptyState";
import TablePagination from "./TablePagination";

// External Deps
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
} from "react";
import {
  SortingState,
  useReactTable,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

export const DataTable = memo(function DataTable<
  TData extends { id: string },
  TValue
>({
  // Action callbacks
  onRowClick,
  onBulkDelete,
  onSelectionChange,

  // Data handling
  columns,
  fetchData,
  data = [],
  initialSortBy = [],
  defaultPageSize = 10,

  // Custom renderers
  emptyStateComponent,
  errorStateComponent,
  loadingStateComponent,

  // Layout/UI
  className = "",
  bodyHeight = 400,
  rowClassName = "",
  cellClassName = "",
  tableClassName = "",
  hideControls = false,
  headerClassName = "",
  paginationClassName = "",

  // Feature flags
  enableSearch = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowSelection = true,
  enableVirtualization = true,
  enableColumnVisibility = true,
  enableServerSideProcessing = false,

  // State indicators
  isError: externalIsError = false,
  isLoading: externalIsLoading = false,
  errorMessage:
    externalErrorMessage = "An error occurred while fetching data.",
}: DataTableProps<TData, TValue>) {
  // State management
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [internalData, setInternalData] = useState<TData[]>(data);
  const [sorting, setSorting] = useState<SortingState>(initialSortBy);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    {}
  );

  // For server-side processing
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [internalErrorMessage, setInternalErrorMessage] =
    useState("");
  const [internalIsError, setInternalIsError] = useState(false);
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Combine internal and external state for loading and errors
  const isError = externalIsError || internalIsError;
  const isLoading = externalIsLoading || internalIsLoading;
  const errorMessage = externalErrorMessage || internalErrorMessage;

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search to avoid excessive API calls
  const [debouncedSearchValue, setDebouncedSearchValue] =
    useState(globalFilter);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(globalFilter);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [globalFilter]);

  const fetchDataFromServer = useCallback(
    async (
      fetchData: (
        options: DataTableFetchOptions
      ) => Promise<DataTableFetchResponse<TData>>
    ) =>
      await serverFetching({
        sorting,
        pagination,
        setPageCount,
        columnFilters,
        setTotalCount,
        setInternalData,
        setInternalIsError,
        debouncedSearchValue,
        setInternalIsLoading,
        setInternalErrorMessage,
      })(fetchData),
    [sorting, pagination, columnFilters, debouncedSearchValue]
  );

  // Fetch data from API if using server-side processing
  useEffect(() => {
    if (!enableServerSideProcessing || !fetchData) return;
    fetchDataFromServer(fetchData);
  }, [
    sorting,
    fetchData,
    pagination,
    columnFilters,
    fetchDataFromServer,
    debouncedSearchValue,
    enableServerSideProcessing,
  ]);

  // Set up the table instance
  const table = useReactTable({
    columns,
    enableSorting,
    state: {
      sorting,
      pagination,
      globalFilter,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    data: internalData,
    enableRowSelection,
    onSortingChange: setSorting,
    enableGlobalFilter: enableSearch,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    enableColumnFilters: enableFiltering,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    manualSorting: enableServerSideProcessing,
    getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: enableServerSideProcessing,
    manualPagination: enableServerSideProcessing,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: (updater) => {
      const newRowSelection =
        typeof updater === "function"
          ? updater(rowSelection)
          : updater;

      setRowSelection(newRowSelection);

      // Call external handler with selected rows
      if (onSelectionChange) {
        const selectedRows = table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original);
        onSelectionChange(selectedRows);
      }
    },
    pageCount: enableServerSideProcessing ? pageCount : undefined,

    // For when we use server-side pagination
    rowCount: enableServerSideProcessing ? totalCount : undefined,
  });

  // Set up row virtualization if enabled
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    overscan: 10,
    count: rows.length,
    estimateSize: () => 48, // Adjust based on your row height
    getItemKey: (index) => rows[index]?.id ?? index,
    getScrollElement: () => tableContainerRef.current,
    enabled: enableVirtualization && rows.length > 50,
  });

  // Virtualization calculations
  const totalHeight = rowVirtualizer.getTotalSize();
  const virtualRows = rowVirtualizer.getVirtualItems();
  const paddingTop =
    virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalHeight - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  // Get selected rows for bulk actions
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  // Determine column span for empty/loading state
  const headerCount = table.getHeaderGroups()[0]?.headers.length || 0;
  const colSpan = headerCount + (enableRowSelection ? 1 : 0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search input when pressing Ctrl+/ key
      if (
        e.ctrlKey &&
        enableSearch &&
        e.key === "/" &&
        searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () =>
      document.removeEventListener("keydown", handleKeyDown);
  }, [enableSearch]);

  // Custom rendering for loading state
  const renderLoadingState = useCallback(() => {
    if (loadingStateComponent) return loadingStateComponent;
    return <TableLoader />;
  }, [loadingStateComponent]);

  // Custom rendering for error state
  const renderErrorState = useCallback(() => {
    if (errorStateComponent) return errorStateComponent;
    return (
      <TableErrorState
        errorMessage={errorMessage}
        resetPage={table.resetPageIndex}
      />
    );
  }, [errorStateComponent, errorMessage, table.resetPageIndex]);

  // Custom rendering for empty state
  const renderEmptyState = useCallback(() => {
    if (emptyStateComponent) return emptyStateComponent;
    return <TableEmptyState globalFilter={globalFilter} />;
  }, [emptyStateComponent, globalFilter]);

  return (
    <div className={`w-full rounded-md border ${className}`}>
      <TableControls
        table={table}
        ref={searchInputRef}
        onBulkDelete={onBulkDelete}
        selectedRows={selectedRows}
        enableSearch={enableSearch}
        globalFilter={globalFilter}
        hideControls={hideControls}
        setGlobalFilter={setGlobalFilter}
        enableRowSelection={enableRowSelection}
        enableColumnVisibility={enableColumnVisibility}
      />

      <TableContainer
        rows={rows}
        table={table}
        colSpan={colSpan}
        isError={isError}
        isLoading={isLoading}
        onRowClick={onRowClick}
        paddingTop={paddingTop}
        ref={tableContainerRef}
        bodyHeight={bodyHeight}
        virtualRows={virtualRows}
        rowClassName={rowClassName}
        paddingBottom={paddingBottom}
        cellClassName={cellClassName}
        columnFilters={columnFilters}
        enableSorting={enableSorting}
        tableClassName={tableClassName}
        enableFiltering={enableFiltering}
        headerClassName={headerClassName}
        renderEmptyState={renderEmptyState}
        renderErrorState={renderErrorState}
        enableRowSelection={enableRowSelection}
        renderLoadingState={renderLoadingState}
        enableVirtualization={enableVirtualization}
      />

      {enablePagination &&
        rows.length > 0 &&
        !isLoading &&
        !isError && (
          <TablePagination
            table={table}
            totalCount={totalCount}
            pagination={pagination}
            paginationClassName={paginationClassName}
            enableServerSideProcessing={enableServerSideProcessing}
          />
        )}
    </div>
  );
}) as <TData extends { id: string }, TValue>(
  props: DataTableProps<TData, TValue>
) => JSX.Element;

// @ts-expect-error - TypeScript doesn't recognize displayName, but it's valid at runtime
DataTable.displayName = "DataTable";
