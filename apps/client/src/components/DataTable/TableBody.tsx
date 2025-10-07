import { TableBodyProps } from "./types";
import { flexRender } from "@tanstack/react-table";

export default function TableBody<TData>({
  rows,
  colSpan,
  onRowClick,
  paddingTop,
  virtualRows,
  rowClassName,
  paddingBottom,
  cellClassName,
  enableRowSelection,
  enableVirtualization,
}: TableBodyProps<TData>) {
  return (
    <tbody>
      {enableVirtualization && rows.length > 50 ? (
        <>
          {/* Top Spacer */}
          {paddingTop > 0 && (
            <tr>
              <td
                colSpan={colSpan}
                style={{ height: `${paddingTop}px` }}
              />
            </tr>
          )}

          {/* Virtualized Rows */}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : ""}
                className={`border-b hover:bg-gray-50 ${
                  row.getIsSelected() ? "bg-blue-50" : ""
                } ${rowClassName}`}
                onClick={() => onRowClick?.(row.original)}
              >
                {/* Row Selection Cell */}
                {enableRowSelection && (
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={row.getIsSelected()}
                      onClick={(e) => e.stopPropagation()}
                      onChange={row.getToggleSelectedHandler()}
                    />
                  </td>
                )}

                {/* Data Cells */}
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 align-middle truncate ${cellClassName}`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Bottom Spacer */}
          {paddingBottom > 0 && (
            <tr>
              <td
                style={{ height: `${paddingBottom}px` }}
                colSpan={colSpan}
              />
            </tr>
          )}
        </>
      ) : (
        /* Non-virtualized Rows */
        rows.map((row) => (
          <tr
            key={row.id}
            data-state={row.getIsSelected() ? "selected" : ""}
            className={`border-b hover:bg-gray-50 ${
              row.getIsSelected() ? "bg-blue-50" : ""
            } ${rowClassName}`}
            onClick={() => onRowClick?.(row.original)}
          >
            {/* Row Selection Cell */}
            {enableRowSelection && (
              <td className="px-4 py-3 align-middle">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={row.getIsSelected()}
                  onClick={(e) => e.stopPropagation()}
                  onChange={row.getToggleSelectedHandler()}
                />
              </td>
            )}

            {/* Data Cells */}
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={`px-4 py-3 align-middle truncate ${cellClassName}`}
              >
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}
