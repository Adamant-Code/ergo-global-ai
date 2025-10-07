/**
 * Generates a preview URL or fallback icon for a file.
 * @param file - The file to generate a preview for
 * @returns A blob URL for images or a fallback icon string for other files
 */
export const getFilePreview = async (file: File): Promise<string> => {
  if (file.type.startsWith("image/")) {
    try {
      const url = URL.createObjectURL(file);
      return url;
    } catch (err) {
      console.error(
        `Failed to create blob URL for ${file.name}:`,
        err
      );
      throw new Error("Failed to generate image preview");
    }
  }
  // Fallback for non-image files (e.g., PDF)
  const fallback = file.type === "application/pdf" ? "PDF" : "File";
  return fallback;
};
