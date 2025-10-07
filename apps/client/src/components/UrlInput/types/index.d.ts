export interface UrlInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  urlValue?: string;
  errorClassName?: string;
  requireProtocol?: boolean;
  handleUrlChange: (urlValue: string) => void;
}
