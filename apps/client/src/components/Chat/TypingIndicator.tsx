import { memo } from "react";
import useLoadingStore from "@/stores/loadingStore";

const TypingIndicator = memo(() => {
  const isTyping = useLoadingStore((state) => state.isTyping);
  return (
    <>
      {isTyping && (
        <div className="flex justify-start mb-4 lg:mb-6 w-full">
          <div className="bg-[#1f1f21] border border-gray-700 rounded-2xl rounded-bl-md px-2 lg:px-2 py-2 lg:py-2 shadow-lg">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
              <div
                className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

TypingIndicator.displayName = "TypingIndicator";

export default TypingIndicator;
