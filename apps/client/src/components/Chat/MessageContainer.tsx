// Utils
import { apiService } from "./api";

// Custom hooks
import { useError } from "@/hooks/useError";

// Components
import TypingIndicator from "./TypingIndicator";
import MessageFormatter from "./MessageFormatter";

// Zustand stores
import useLoadingStore from "@/stores/loadingStore";
import useMessageStore from "@/stores/conversationStore";

// External libraries
import {
  memo,
  Dispatch,
  useEffect,
  useCallback,
  SetStateAction,
} from "react";
import useStreamingConversationsStore from "@/stores/streamingConversationsStore";

const MessageContainer = memo<{
  placeholderId: string;
  conversationId?: string;
  setMessageLoaded: Dispatch<SetStateAction<string>>;
}>(({ placeholderId, conversationId, setMessageLoaded }) => {
  const { setError } = useError();
  const setLoadingCurrentConversation = useLoadingStore(
    (state) => state.setLoadingCurrentConversation
  );
  const streamingConversations = useStreamingConversationsStore(
    (state) => state.streamingConversations
  );
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  useEffect(() => {
    const conversation = messages[conversationId || placeholderId];
    if (conversation)
      setMessageLoaded(conversation.map((msg) => msg.text).join(" "));
  }, [conversationId, messages, placeholderId, setMessageLoaded]);

  const isConversationStreaming = useCallback(
    (conversationId: string | undefined) => {
      if (!conversationId) return false;
      return streamingConversations.has(conversationId);
    },
    [streamingConversations]
  );

  useEffect(() => {
    const isStreaming = isConversationStreaming(conversationId);
    if (conversationId && !isStreaming) {
      const loadConversationMessages = async (id: string) => {
        try {
          setLoadingCurrentConversation(true);
          const conversation = await apiService.getConversation(id);
          const formattedMessages = conversation.messages.map(
            (msg) => ({
              text: msg.content,
              isUser: msg.role === "user",
            })
          );
          setMessages((prevMessages) => {
            const updatedMessages = {
              ...prevMessages,
              [id]: formattedMessages,
            };
            return updatedMessages;
          });
        } catch (error) {
          setError(error);
        } finally {
          setLoadingCurrentConversation(false);
        }
      };
      loadConversationMessages(conversationId);
    }
  }, [
    setError,
    setMessages,
    conversationId,
    isConversationStreaming,
    setLoadingCurrentConversation,
  ]);

  const isEmpty = Object.keys(messages).length === 0;
  const conversationMessages =
    messages[conversationId || placeholderId];

  return (
    <div className="max-w-3xl mx-auto pb-14">
      {!isEmpty &&
        ((conversationId && messages[conversationId]) ||
          messages[placeholderId]) &&
        conversationMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.isUser ? "justify-end" : "justify-start"
            } mb-4 lg:mb-6`}
          >
            {msg.text.trim() && (
              <div
                className={`w-full ${
                  msg.isUser
                    ? "bg-[#252628] text-white rounded-2xl rounded-br-none max-w-[80%] lg:max-w-[70%] shadow-lg"
                    : "bg-transparent text-gray-100 rounded-2xl rounded-bl-none border-gray-700"
                } px-3 lg:px-4 py-2 lg:py-3`}
              >
                {msg.isUser ? (
                  <p className="leading-relaxed text-sm lg:text-base">
                    {msg.text}
                  </p>
                ) : (
                  <>
                    <MessageFormatter text={msg.text} />
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      <TypingIndicator />
    </div>
  );
});

MessageContainer.displayName = "MessageContainer";

export default MessageContainer;
