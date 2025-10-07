import {
  OptionState,
  ControlState,
  CustomStyles,
  DropdownSearchStyleProps,
} from "../types";

export const customStyles: ({
  error,
  disabled,
  isLoading,
}: DropdownSearchStyleProps) => CustomStyles = ({
  error,
  disabled,
  isLoading,
}: DropdownSearchStyleProps) => ({
  control: (base: React.CSSProperties, state: ControlState) => ({
    ...base,
    borderWidth: "2px",
    borderColor: error
      ? "#ef4444"
      : state.isFocused
      ? "#a5b4fc"
      : "#d1d5db",
    backgroundColor: disabled || isLoading ? "#f3f4f6" : "#ffffff",
    borderRadius: "0.375rem",
    boxShadow: state.isFocused
      ? "0 0 0 1px rgba(99, 102, 241, 0.3)"
      : "none",
    "&:hover": {
      borderColor: error ? "#ef4444" : "#a5b4fc",
    },
    outline: "none",
    transition: "all 200ms ease-in-out",
    opacity: disabled || isLoading ? 0.7 : 1,
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
  }),
  menu: (base: React.CSSProperties) => ({
    ...base,
    borderRadius: "0.375rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    marginTop: "0.25rem",
    animation: "fadeIn 150ms ease-in-out",
  }),
  option: (base: React.CSSProperties, state: OptionState) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#6366f1"
      : state.isFocused
      ? "#e0e7ff"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1f2937",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    transition: "background-color 150ms ease-in-out",
    "&:hover": {
      backgroundColor: state.isSelected ? "#a5b4fc" : "#e0e7ff",
    },
  }),
  multiValue: (base: React.CSSProperties) => ({
    ...base,
    backgroundColor: "#e0e7ff",
    borderRadius: "0.25rem",
  }),
  multiValueLabel: (base: React.CSSProperties) => ({
    ...base,
    color: "#1f2937",
  }),
  multiValueRemove: (base: React.CSSProperties) => ({
    ...base,
    color: "#e13131",
    "&:hover": {
      backgroundColor: "#dc262638",
      color: "#a5b4fc",
    },
  }),
  placeholder: (base: React.CSSProperties) => ({
    ...base,
    color: "#9ca3af",
  }),
});
