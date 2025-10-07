import Select, {
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select";
import React, { useState, useEffect, memo } from "react";

// Internal Deps
import { customStyles } from "./helpers";
import { Option, SearchableDropdownProps } from "./types";
import useComponentMounted from "@/hooks/useComponentMounted";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const SearchableDropdown = memo(
  ({
    error,
    label,
    onChange,
    options = [],
    renderOption,
    isSingleSelect,
    disabled = false,
    isLoading = false,
    placeholder = "Search...",
  }: SearchableDropdownProps) => {
    const { isMounted } = useComponentMounted();
    const [selected, setSelected] = useState<
      Option | Option[] | null
    >(null);

    const handleChange = (
      newValue: SingleValue<Option> | MultiValue<Option>
    ) => {
      if (isSingleSelect) {
        const value = (newValue as SingleValue<Option>)?.value || "";
        setSelected(newValue as Option);
        onChange(value);
      } else {
        const values = (newValue as MultiValue<Option>).map(
          (opt) => opt.value
        );
        setSelected(newValue as Option[]);
        onChange(values);
      }
    };

    useEffect(() => {
      setSelected(isSingleSelect ? null : []);
    }, [options, isSingleSelect]);

    return (
      <div className="relative w-full max-w-md">
        <style>
          {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
        </style>
        {label && (
          <div className="text-sm font-medium text-gray-700 mb-1 inline-block">
            {label}
          </div>
        )}
        {isMounted && (
          <Select
            isSearchable
            value={selected}
            isLoading={isLoading}
            onChange={handleChange}
            id="searchable-dropdown"
            placeholder={placeholder}
            isMulti={!isSingleSelect}
            options={error ? [] : options}
            isDisabled={disabled || isLoading}
            formatOptionLabel={
              renderOption ? (opt) => renderOption(opt) : undefined
            }
            styles={
              customStyles({
                error,
                disabled,
                isLoading,
              }) as unknown as StylesConfig<Option, boolean>
            }
            components={{
              LoadingIndicator: () => (
                <LoadingSpinner className="w-4 h-4 mr-2 text-indigo-500" />
              ),
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "dropdown-error" : undefined}
          />
        )}
        {error && (
          <div
            id="dropdown-error"
            className="mt-1 text-red-500 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

SearchableDropdown.displayName = "SearchableDropdown";

export default SearchableDropdown;
