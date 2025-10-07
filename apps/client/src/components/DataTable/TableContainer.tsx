import TableBody from "./TableBody";
import { forwardRef, Ref } from "react";
import TableHeader from "./TableHeader";
import { TableDataContainerProps } from "./types";

function TableContainerRef<TData>(
  {
    rows,
    table,
    isError,
    colSpan,
    isLoading,
    bodyHeight,
    onRowClick,
    paddingTop,
    virtualRows,
    rowClassName,
    enableSorting,
    columnFilters,
    paddingBottom,
    cellClassName,
    tableClassName,
    enableFiltering,
    headerClassName,
    renderEmptyState,
    renderErrorState,
    enableRowSelection,
    renderLoadingState,
    enableVirtualization,
  }: TableDataContainerProps<TData>,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      style={{
        overflow: "auto",
        height: bodyHeight,
      }}
      className="w-full relative"
    >
      {isLoading ? (
        renderLoadingState()
      ) : isError ? (
        renderErrorState()
      ) : rows.length === 0 && columnFilters.length === 0 ? (
        renderEmptyState()
      ) : (
        <table
          className={`w-full table-fixed border-collapse ${tableClassName}`}
        >
          <TableHeader
            table={table}
            enableSorting={enableSorting}
            enableFiltering={enableFiltering}
            headerClassName={headerClassName}
            enableRowSelection={enableRowSelection}
          />

          <TableBody
            rows={rows}
            colSpan={colSpan}
            onRowClick={onRowClick}
            paddingTop={paddingTop}
            virtualRows={virtualRows}
            rowClassName={rowClassName}
            paddingBottom={paddingBottom}
            cellClassName={cellClassName}
            enableRowSelection={enableRowSelection}
            enableVirtualization={enableVirtualization}
          />
        </table>
      )}
    </div>
  );
}

const TableContainer = forwardRef(TableContainerRef) as <TData>(
  props: TableDataContainerProps<TData> & {
    ref?: Ref<HTMLDivElement>;
  }
) => ReturnType<typeof TableContainerRef>;

// @ts-expect-error - TypeScript doesn't recognize displayName, but it's valid at runtime
TableContainer.displayName = "TableContainer";

export default TableContainer;
