import {
  ServerFetchProps,
  DataTableFetchOptions,
  DataTableFetchResponse,
} from "../types";

const serverFetching =
  <TData>({
    sorting,
    pagination,
    setPageCount,
    setTotalCount,
    columnFilters,
    setInternalData,
    setInternalIsError,
    setInternalIsLoading,
    debouncedSearchValue,
    setInternalErrorMessage,
  }: ServerFetchProps) =>
  async (
    fetchData: (
      options: DataTableFetchOptions
    ) => Promise<DataTableFetchResponse<TData>>
  ) => {
    setInternalIsLoading(true);
    setInternalIsError(false);

    try {
      // Prepare filter object from columnFilters
      const filters: Record<string, unknown> = {};
      columnFilters.forEach((filter) => {
        filters[filter.id] = filter.value;
      });

      // Determine sort field and direction
      let sortBy: string | undefined = undefined;
      let sortDirection: "asc" | "desc" | undefined = undefined;

      if (sorting.length > 0) {
        sortBy = sorting[0].id;
        sortDirection = sorting[0].desc ? "desc" : "asc";
      }

      // Fetch data
      const response = await fetchData({
        sortBy,
        filters,
        sortDirection,
        pageSize: pagination.pageSize,
        page: pagination.pageIndex + 1,
        searchQuery: debouncedSearchValue,
      });

      // Update state with response
      setInternalData(response.data);
      setPageCount(response.pageCount);
      setTotalCount(response.totalCount);

      if (response.error) {
        setInternalIsError(true);
        setInternalErrorMessage(response.error);
      }
    } catch (error) {
      setInternalIsError(true);
      setInternalErrorMessage(
        "Failed to fetch data. Please try again."
      );
      console.error("Error fetching data:", error);
    } finally {
      setInternalIsLoading(false);
    }
  };

export default serverFetching;
