export interface Option {
  value: string;
  label: string;
}

/**
 * Props for the SearchableDropdown component.
 * @interface SearchableDropdownProps
 */
export interface SearchableDropdownProps {
  /** Label for the dropdown */
  label?: string;
  /** Array of options with value and label */
  options: Option[];
  /** Selection mode: single or multi */
  isSingleSelect?: boolean;
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Disables the component */
  disabled?: boolean;
  /** Shows loading state */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
  /** Callback for selection changes */
  onChange: (selected: string | string[]) => void;
  /** Custom rendering function for options */
  renderOption?: (option: Option) => React.ReactNode;
}

export interface ControlState {
  isFocused: boolean;
}

export interface OptionState {
  isSelected: boolean;
  isFocused: boolean;
}

export interface StyleFunction<State = object> {
  (base: React.CSSProperties, state: State): React.CSSProperties;
}

export interface CustomStyles {
  option: StyleFunction<OptionState>;
  control: StyleFunction<ControlState>;
  menu: (base: React.CSSProperties) => React.CSSProperties;
  multiValue: (base: React.CSSProperties) => React.CSSProperties;
  placeholder: (base: React.CSSProperties) => React.CSSProperties;
  multiValueLabel: (base: React.CSSProperties) => React.CSSProperties;
  multiValueRemove: (
    base: React.CSSProperties
  ) => React.CSSProperties;
}

export interface DropdownSearchStyleProps {
  disabled: boolean;
  isLoading: boolean;
  error: string | undefined;
}
