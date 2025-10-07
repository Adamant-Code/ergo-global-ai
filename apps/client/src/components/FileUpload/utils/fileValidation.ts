import { ValidationOptions, ValidationResult } from "../types";

/**
 * Validates files based on type and size constraints.
 * @param files - The files to validate
 * @param options - Validation options (accept, maxSizeMB)
 * @returns Valid files and any errors
 */
export const validateFiles = (
  files: File[],
  options: ValidationOptions
): ValidationResult => {
  const { accept, maxSizeMB } = options;
  const validFiles: File[] = [];
  const errors: string[] = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  files.forEach((file) => {
    // Validate file type
    const fileExtension = `.${file.name
      .split(".")
      .pop()
      ?.toLowerCase()}`;
    const fileType = file.type;
    const isValidType = accept.some((type) => {
      if (type.startsWith("."))
        return fileExtension === type.toLowerCase();
      if (type.includes("/*"))
        return fileType.startsWith(type.split("/*")[0]);
      return fileType === type;
    });

    // Validate file size
    const isValidSize = file.size <= maxSizeBytes;

    if (!isValidType) {
      errors.push(
        `File ${
          file.name
        } has an invalid type. Allowed: ${accept.join(", ")}.`
      );
    } else if (!isValidSize) {
      errors.push(`File ${file.name} exceeds ${maxSizeMB}MB.`);
    } else {
      validFiles.push(file);
    }
  });

  return { validFiles, errors };
};

/**
 * Simulates file upload with progress updates and random success/failure.
 * @param file - The file to upload
 * @param onProgress - Callback for progress updates
 * @returns Promise that resolves on success or rejects on failure
 */
export const simulateUpload = (
  onProgress: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    let failed = false;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Randomly fail 20% of the time for testing
        if (Math.random() < 0.2) failed = true;
        else resolve();
      }
    }, 300);

    setTimeout(() => {
      if (failed) {
        clearInterval(interval);
        reject(new Error("Upload failed"));
      }
    }, 3000);
  });
};
