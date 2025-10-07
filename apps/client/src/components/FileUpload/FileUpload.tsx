"use client";

import Image from "next/image";
import {
  validateFiles,
  simulateUpload,
} from "./utils/fileValidation";
import useToast from "@/hooks/useToast";
import { FileUploadProps } from "./types";
import { useDropzone } from "react-dropzone";
import { getFilePreview } from "./utils/preview";
import { useCallback, useState, useEffect, memo } from "react";

export const FileUpload = memo(
  ({
    maxSizeMB = 5,
    onFilesSelected,
    multiple = false,
    disabled = false,
    handleFilesRemove,
    accept = ["image/*", ".pdf"],
  }: FileUploadProps) => {
    const { error, success } = useToast();
    const [uploadProgress, setUploadProgress] = useState<
      Map<
        string,
        {
          progress: number;
          status: "uploading" | "success" | "failed";
        }
      >
    >(new Map());
    const [previews, setPreviews] = useState<Map<string, string>>(
      new Map()
    );

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        const { validFiles, errors } = validateFiles(acceptedFiles, {
          accept,
          maxSizeMB,
        });

        if (errors.length > 0) {
          errors.forEach((err) => error(err));
          return;
        }

        // Generate previews
        for (const file of validFiles) {
          try {
            const preview = await getFilePreview(file);
            setPreviews((prev) => {
              const newMap = new Map(prev).set(file.name, preview);
              return newMap;
            });
          } catch (err) {
            if (err instanceof Error)
              error(
                `Failed to generate preview for ${file.name}: ${err.message}`
              );
            else error(`Failed to generate preview`);
          }
        }

        // Simulate upload for all files
        const uploadedFiles: File[] = [];
        for (const file of validFiles) {
          try {
            setUploadProgress((prev) =>
              new Map(prev).set(file.name, {
                progress: 0,
                status: "uploading",
              })
            );
            await simulateUpload((progress) =>
              setUploadProgress((prev) =>
                new Map(prev).set(file.name, {
                  progress,
                  status: "uploading",
                })
              )
            );
            uploadedFiles.push(file);
            setUploadProgress((prev) =>
              new Map(prev).set(file.name, {
                progress: 100,
                status: "success",
              })
            );
            success(`Upload successful for ${file.name}`);
          } catch (err) {
            if (err instanceof Error) error(err.message);
            else error(`Upload failed for ${file.name}`);
            setUploadProgress((prev) =>
              new Map(prev).set(file.name, {
                progress: 100,
                status: "failed",
              })
            );
          }
        }

        if (uploadedFiles.length > 0) {
          onFilesSelected(uploadedFiles);
        }
      },
      [accept, maxSizeMB, onFilesSelected, error, success]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone(
      {
        multiple,
        disabled,
        onDrop,
      }
    );

    // Handle file removal
    const handleRemove = (fileName: string) => {
      setPreviews((prev) => {
        const newMap = new Map(prev);
        const url = newMap.get(fileName);
        if (url?.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
        newMap.delete(fileName);
        return newMap;
      });
      handleFilesRemove(fileName);
      setUploadProgress((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fileName);
        return newMap;
      });
      success(`Removed ${fileName}`);
    };

    // Clean up preview URLs on unmount
    useEffect(() => {
      return () => {
        previews.forEach((url) => {
          if (url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      };
    }, [previews]);

    return (
      <div className="flex flex-col gap-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 rounded-lg text-center transition-colors ${
            disabled
              ? "bg-gray-100 opacity-50 cursor-not-allowed border-gray-300"
              : isDragActive
              ? "bg-blue-50 border-blue-500"
              : "border-gray-300 hover:bg-gray-50 cursor-pointer bg-white"
          }`}
        >
          <input
            {...getInputProps()}
            aria-label="File upload"
          />
          <p className="text-gray-600">
            {disabled
              ? "File upload disabled"
              : isDragActive
              ? "Drop files here!"
              : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Accepted: {accept.join(", ")} (Max {maxSizeMB}MB)
          </p>
        </div>
        {Array.from(previews.entries()).map(
          ([fileName, previewUrl]) => (
            <div
              key={fileName}
              className="flex items-center gap-4 bg-white rounded-md pr-4"
            >
              {previewUrl.startsWith("blob:") ? (
                <Image
                  width={100}
                  height={100}
                  src={previewUrl}
                  alt={`Preview of ${fileName}`}
                  className="w-16 h-16 object-cover rounded-md border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                  <span className="text-gray-500 text-sm">
                    {previewUrl}
                  </span>
                </div>
              )}
              <div className="flex flex-col flex-1">
                <p
                  className={`text-sm ${
                    uploadProgress.get(fileName)?.status === "failed"
                      ? "text-red-700"
                      : "text-gray-600"
                  }`}
                >
                  {fileName}
                </p>
                {uploadProgress.has(fileName) ? (
                  <p
                    className={`text-xs ${
                      uploadProgress.get(fileName)!.status ===
                      "failed"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {uploadProgress.get(fileName)!.status ===
                    "success"
                      ? "Uploaded"
                      : uploadProgress.get(fileName)!.status ===
                        "failed"
                      ? "Failed"
                      : "Uploading"}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Awaiting upload
                  </p>
                )}
              </div>
              {uploadProgress.has(fileName) && (
                <button
                  type="button"
                  onClick={() => handleRemove(fileName)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  aria-label={`Remove ${fileName}`}
                >
                  Remove
                </button>
              )}
            </div>
          )
        )}
        {Array.from(uploadProgress.entries()).map(
          ([fileName, { progress, status }]) => (
            <div
              key={fileName}
              className={`flex flex-col gap-1 ${
                progress === 100 ? "hidden" : ""
              }`}
            >
              <p className="text-sm text-gray-600">
                {fileName} - {progress}%{" "}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    status === "failed" ? "bg-red-600" : "bg-blue-600"
                  }`}
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Upload progress for ${fileName}`}
                />
              </div>
            </div>
          )
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
