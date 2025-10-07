import React from "react";

export default function LoadingSpinner({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        className || ""
      }`}
    >
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent shadow-lg"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse"></div>
        </div>

        <div className="absolute -inset-1 rounded-full border border-blue-300 opacity-50"></div>
      </div>
    </div>
  );
}
