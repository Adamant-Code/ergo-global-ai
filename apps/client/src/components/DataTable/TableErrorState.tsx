import React from "react";
import {
  DataTableFetchOptions,
  DataTableFetchResponse,
} from "./types";

const TableErrorState = ({
  resetPage,
  fetchData,
  errorMessage,
}: {
  errorMessage: string;
  resetPage: (defaultState?: boolean) => void;
  fetchData?: (
    options: DataTableFetchOptions
  ) => Promise<DataTableFetchResponse<unknown>>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-red-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-medium">Error Loading Data</h3>
      <p className="text-sm mt-2">{errorMessage}</p>
      {fetchData && (
        <button
          onClick={() => resetPage()}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default TableErrorState;
