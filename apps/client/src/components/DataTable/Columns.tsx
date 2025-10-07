import { RowActionMenu } from "./RowActionMenu";
import { ColumnDef } from "@tanstack/react-table";

export function getColumns<TData extends { id: string }>(
  onEdit?: (row: TData) => void,
  onDelete?: (id: string) => void
): ColumnDef<TData>[] {
  return [
    {
      header: 'S/N',
      id: 'serialNumber',
      enableSorting: false,
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Role",
      enableSorting: true,
      accessorKey: "role",
      cell: (info) => info.getValue(),
    },
    {
      header: "Name",
      enableSorting: true,
      accessorKey: "name",
      cell: (info) => info.getValue(),
    },
    {
      header: "Email",
      enableSorting: true,
      accessorKey: "email",
      cell: (info) => info.getValue(),
    },
    {
      header: "Created At",
      enableSorting: true,
      accessorKey: "createdAt",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <RowActionMenu
          onEdit={() => onEdit?.(row.original)}
          onDelete={() => onDelete?.(row.original.id)}
        />
      ),
    },
  ];
}
