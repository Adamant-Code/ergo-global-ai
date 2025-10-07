"use client";

import { Loader2 } from "lucide-react";

const ChatLoader = ({
  message = "Loading conversation...",
  subMessage = "Please wait a moment",
}: ChatLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50 loader-container">
      <div className="bg-[#1a1a1c] border border-gray-700 rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <div className="absolute inset-0 w-8 h-8 border-2 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-[-4px] w-10 h-10 border border-blue-400/10 rounded-full loader-ripple"></div>
          </div>

          <div className="text-center">
            <p className="text-gray-300 text-sm font-medium">
              {message}
            </p>
            <p className="text-gray-500 text-xs mt-1">{subMessage}</p>
          </div>

          <div className="flex space-x-1 loader-dots">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLoader;
