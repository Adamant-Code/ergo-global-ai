import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface RowActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RowActionMenu({
  onEdit,
  onDelete,
}: RowActionMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="p-1 text-sm border rounded">
        ⋮
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="p-2 border rounded bg-white shadow-lg z-50 flex flex-col gap-1">
        <DropdownMenu.Item
          className="flex items-center gap-2 p-2 text-sm hover:bg-gray-50 cursor-pointer bg-gray-100 rounded-sm"
          onSelect={onEdit}
        >
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onSelect={onDelete}
          className="text-red-500 flex items-center gap-2 p-2 text-sm hover:bg-gray-50 cursor-pointer bg-gray-100 rounded-sm"
        >
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
