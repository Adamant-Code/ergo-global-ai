import { NewChatProps } from "./types";
import { SendHorizonal } from "lucide-react";

const NewChat = ({
  message,
  handleSendMessage,
  handleChangeMessage,
  handleKeyDownSendMessage,
}: NewChatProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#161618] text-white">
      <div className="max-w-2xl w-full mx-auto px-4 lg:px-6 py-8 lg:py-12 text-center">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-4xl font-light mb-3 lg:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How can I help you today?
          </h1>
          <p className="text-gray-400 text-base lg:text-lg">
            Start a conversation or ask me anything
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={handleChangeMessage}
              onKeyDown={handleKeyDownSendMessage}
              className="w-full p-3 lg:p-4 pr-10 lg:pr-12 bg-[#252628] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
              placeholder="Ask me anything..."
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-1 lg:right-2 top-1/2 transform -translate-y-1/2 p-1.5 lg:p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              disabled={!message.trim()}
            >
              <SendHorizonal className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
