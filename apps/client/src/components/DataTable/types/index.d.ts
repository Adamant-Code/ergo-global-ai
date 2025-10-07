import {
  Row,
  Table,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: "admin" | "user";
};

// Server-based filtering and pagination
export interface DataTableFetchOptions {
  page: number;
  sortBy?: string;
  pageSize: number;
  searchQuery?: string;
  sortDirection?: "asc" | "desc";
  filters?: Record<string, unknown>;
}

// Response format from server
export interface DataTableFetchResponse<TData> {
  data: TData[];
  error?: string;
  pageCount: number;
  totalCount: number;
}

// Main component props
export interface DataTableProps<
  TData extends { id: string },
  TValue
> {
  // State indicators
  isError?: boolean;
  isLoading?: boolean;
  errorMessage?: string;

  // Feature flags
  enableSearch?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableVirtualization?: boolean;
  enableColumnVisibility?: boolean;
  enableServerSideProcessing?: boolean;

  // Layout/UI settings
  className?: string;
  bodyHeight?: number;
  rowClassName?: string;
  cellClassName?: string;
  hideControls?: boolean;
  tableClassName?: string;
  headerClassName?: string;
  paginationClassName?: string;
  columnToggleComponent?: React.ReactNode;

  // Custom renderers & handlers
  emptyStateComponent?: React.ReactNode;
  errorStateComponent?: React.ReactNode;
  loadingStateComponent?: React.ReactNode;

  // Action callbacks
  onEdit?: (row: TData) => void;
  onDelete?: (id: string) => void;
  onRowClick?: (row: TData) => void;
  onBulkDelete?: (rows: TData[]) => void;
  onSelectionChange?: (rows: TData[]) => void;

  // Data handling options
  data?: TData[];
  defaultPageSize?: number;
  columns: ColumnDef<TData, TValue>[];
  initialFilters?: Record<string, unknown>;
  fetchData?: (
    options: DataTableFetchOptions
  ) => Promise<DataTableFetchResponse<TData>>;
  initialSortBy?: { id: string; desc: boolean }[];
}

type RenderStateType =
  | true
  | number
  | bigint
  | string
  | React.JSX.Element
  | Iterable<React.ReactNode>
  | Promise<React.AwaitedReactNode>;

export interface TableDataContainerProps<TData> {
  colSpan: number;
  isError: boolean;
  bodyHeight: number;
  rows: Row<TData>[];
  paddingTop: number;
  isLoading: boolean;
  table: Table<TData>;
  rowClassName: string;
  paddingBottom: number;
  cellClassName: string;
  enableSorting: boolean;
  tableClassName: string;
  headerClassName: string;
  enableFiltering: boolean;
  virtualRows: VirtualItem[];
  enableRowSelection: boolean;
  enableVirtualization: boolean;
  columnFilters: ColumnFiltersState;
  renderErrorState: () => RenderStateType;
  renderEmptyState: () => RenderStateType;
  renderLoadingState: () => RenderStateType;
  onRowClick: ((row: TData) => void) | undefined;
}

export type TableHeaderProps<TData> = Pick<
  TableDataContainerProps<TData>,
  | "table"
  | "enableSorting"
  | "enableFiltering"
  | "headerClassName"
  | "enableRowSelection"
>;

export type TableBodyProps<TData> = Pick<
  TableDataContainerProps<TData>,
  | "rows"
  | "colSpan"
  | "onRowClick"
  | "paddingTop"
  | "virtualRows"
  | "rowClassName"
  | "paddingBottom"
  | "cellClassName"
  | "enableRowSelection"
  | "enableVirtualization"
>;

export interface TableControlsProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  hideControls: boolean;
  selectedRows: TData[];
  enableSearch: boolean;
  enableRowSelection: boolean;
  enableColumnVisibility: boolean;
  onBulkDelete: ((rows: TData[]) => void) | undefined;
  setGlobalFilter: (value: React.SetStateAction<string>) => void;
}

export interface TablePaginationProps<TData> {
  totalCount: number;
  pagination: {
    pageSize: number;
    pageIndex: number;
  };
  table: Table<TData>;
  paginationClassName: string;
  enableServerSideProcessing: boolean;
}

export interface ServerFetchProps {
  pagination: {
    pageSize: number;
    pageIndex: number;
  };
  columnFilters: ColumnFiltersState;
  setInternalErrorMessage: (
    value: React.SetStateAction<string>
  ) => void;
  debouncedSearchValue: string;
  sorting: SortingState;
  setInternalIsLoading: (
    value: React.SetStateAction<boolean>
  ) => void;
  setPageCount: (value: React.SetStateAction<number>) => void;
  setTotalCount: (value: React.SetStateAction<number>) => void;
  setInternalData: (value: React.SetStateAction<TData[]>) => void;
  setInternalIsError: (value: React.SetStateAction<boolean>) => void;
}
