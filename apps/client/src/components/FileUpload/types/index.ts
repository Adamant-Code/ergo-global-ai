export interface FileUploadProps {
  accept?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  disabled?: boolean;
  onFilesSelected: (files: File[]) => void;
  handleFilesRemove: (fileName:string) => void
}

export interface ValidationOptions {
  accept: string[];
  maxSizeMB: number;
}

export interface ValidationResult {
  validFiles: File[];
  errors: string[];
}
