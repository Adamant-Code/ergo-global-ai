import { SendHorizonal } from "lucide-react";
import { ConversationInputProps } from "./types";
import useLoadingStore from "@/stores/loadingStore";

const CoversationInput = ({
  message,
  handleSendMessage,
  handleChangeMessage,
  handleKeyDownSendMessage,
}: ConversationInputProps) => {
  const isConnected = useLoadingStore((state) => state.isConnected);
  const isStreaming = useLoadingStore((state) => state.isStreaming);
  const webSocketError = useLoadingStore(
    (state) => state.webSocketError
  );

  return (
    <div className="bg-transparent absolute bottom-0 left-0 right-0 w-full">
      <div className="px-2 lg:px-4 py-2 bg-transparent">
        {webSocketError && (
          <div className="mb-3 p-3 bg-red-900/20 border border-red-800 rounded">
            <p className="text-red-400 text-sm">{webSocketError}</p>
          </div>
        )}

        <div className="max-w-3xl mx-auto w-full relative">
          <input
            type="text"
            value={message}
            onChange={handleChangeMessage}
            onKeyDown={handleKeyDownSendMessage}
            className="w-full p-3 lg:p-4 pr-10 lg:pr-12 bg-[#252628] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-transparent transition-all duration-200 disabled:cursor-not-allowed text-sm lg:text-base"
            placeholder={
              isStreaming
                ? "AI is responding..."
                : isConnected
                ? "Type your message..."
                : "Connecting..."
            }
            disabled={!isConnected || isStreaming}
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-1 lg:right-2 top-1/2 transform -translate-y-1/2 p-1.5 lg:p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            disabled={!isConnected || !message.trim() || isStreaming}
          >
            <SendHorizonal className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoversationInput;
