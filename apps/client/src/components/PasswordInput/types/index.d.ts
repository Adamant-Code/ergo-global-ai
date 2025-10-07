export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  handlePasswordChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  label?: string;
  error?: string;
  passwordValue?: string;
  confirmPassword?: boolean;
}
