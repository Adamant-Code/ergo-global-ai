"use client";

// Components
import MessageContainer from "./MessageContainer";
import CoversationInput from "./CoversationInput";

// Types
import { ConversationContainerProps } from "./types";

// External libraries
import { memo, useEffect, useRef, useState } from "react";

const ConversationContainer = memo<ConversationContainerProps>(
  ({
    slug,
    message,
    placeholderId,
    handleSendMessage,
    handleChangeMessage,
    handleKeyDownSendMessage,
  }) => {
    const [messageLoaded, setMessageLoaded] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!messageLoaded) return;
      if (ref.current) {
        ref.current.scrollTo({
          behavior: "smooth",
          top: ref.current.scrollHeight,
        });
      }
    }, [messageLoaded]);

    return (
      <div
        ref={ref}
        className="overflow-y-auto flex flex-col h-full bg-[#161618] text-white"
      >
        <div className="flex-1 px-2 lg:px-4 py-4 lg:py-6 space-y-4 lg:space-y-6">
          <MessageContainer
            conversationId={slug}
            placeholderId={placeholderId}
            setMessageLoaded={setMessageLoaded}
          />
          <CoversationInput
            message={message}
            handleSendMessage={handleSendMessage}
            handleChangeMessage={handleChangeMessage}
            handleKeyDownSendMessage={handleKeyDownSendMessage}
          />
        </div>
      </div>
    );
  }
);

ConversationContainer.displayName = "ConversationContainer";
export default ConversationContainer;
