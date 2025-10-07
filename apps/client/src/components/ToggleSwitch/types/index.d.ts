export interface ToggleSwitchProps {
  id: string;
  label?: string;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  onCheckedChange?: (checked: boolean) => void;
}
