"use client";

// Custom hooks
import { useError } from "@/hooks/useError";

// Third party imports
import React, { useState, useCallback } from "react";

// Components
import NewChat from "./NewChat";
import ConversationContainer from "./ConversationContainer";

// Components imports
import useLoadingStore from "@/stores/loadingStore";
import useMessageStore from "@/stores/conversationStore";
import useWebSocketRefStore from "@/stores/webSocketRefStore";
import useStreamingConversationsStore from "@/stores/streamingConversationsStore";

const Chat = ({ slug }: { slug?: string }) => {
  const { setError } = useError();
  const conversationId = useLoadingStore(
    (state) => state.conversationId
  );
  const openConversation = useLoadingStore(
    (state) => state.openConversation
  );
  const setWebSocketError = useLoadingStore(
    (state) => state.setWebSocketError
  );
  const [message, setMessage] = useState("");
  const setOpenConversation = useLoadingStore(
    (state) => state.setOpenConversation
  );
  const currentConversationId = useLoadingStore(
    (state) => state.currentConversationId
  );
  const [placeholderId, setPlaceholderId] = useState("");
  const setIsTyping = useLoadingStore((state) => state.setIsTyping);
  const setStreamingConversations = useStreamingConversationsStore(
    (state) => state.setStreamingConversation
  );
  const setMessages = useMessageStore((state) => state.setMessages);
  const isConnected = useLoadingStore((state) => state.isConnected);
  const webSocket = useWebSocketRefStore((state) => state.webSocket);

  const sendMessage = useCallback(
    (message: string) => {
      if (webSocket?.connected) {
        setIsTyping(true);
        const placeholder_id = `placeholder_id_${crypto.randomUUID()}`;
        setPlaceholderId(placeholder_id);
        const conversationId =
          currentConversationId || placeholder_id;
        setStreamingConversations((prev) =>
          new Set(prev).add(conversationId)
        );
        webSocket.emit("llm_prompt", {
          userPrompt: message,
          ...(currentConversationId
            ? {
                conversationId: currentConversationId,
              }
            : { placeholderId: placeholder_id }),
        });
        setMessages((prevMessages) => ({
          ...prevMessages,
          [conversationId]: [
            ...(prevMessages[conversationId] || []),
            { text: message, isUser: true },
          ],
        }));
        setOpenConversation(true);
      } else {
        setIsTyping(false);
        const msg = "WebSocket is not connected.";
        setError(msg);
        setWebSocketError(msg);
      }
    },
    [
      setError,
      webSocket,
      setMessages,
      setIsTyping,
      setWebSocketError,
      setOpenConversation,
      currentConversationId,
      setStreamingConversations,
    ]
  );

  const handleSendMessage = useCallback(() => {
    if (message.trim() && isConnected) {
      sendMessage(message);
      setMessage("");
    }
  }, [sendMessage, message, isConnected]);

  const handleChangeMessage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  const handleKeyDownSendMessage = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  if (!openConversation && !slug )
    return (
      <>
        <NewChat
          message={message}
          handleSendMessage={handleSendMessage}
          handleChangeMessage={handleChangeMessage}
          handleKeyDownSendMessage={handleKeyDownSendMessage}
        />
      </>
    );

  return (
    <>
      <ConversationContainer
        message={message}
        slug={slug || conversationId}
        placeholderId={placeholderId}
        handleSendMessage={handleSendMessage}
        handleChangeMessage={handleChangeMessage}
        handleKeyDownSendMessage={handleKeyDownSendMessage}
      />
    </>
  );
};

export default Chat;
