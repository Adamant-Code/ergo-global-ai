"use client";

// Components
import { useError } from "./useError";

// Types
import { EventData } from "@/types/web-socket";

// External libraries
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useCallback } from "react";
import { getSession, signOut } from "next-auth/react";

// Utils
import { ConversationListItem } from "@/components/Chat/api";
import { AccessTokenResponse } from "@request-response/types";

// Zustand stores
import useLoadingStore from "@/stores/loadingStore";
import useMessageStore from "@/stores/conversationStore";
import useWebSocketRefStore from "@/stores/webSocketRefStore";
import useConversationTitleStore from "@/stores/conversationTitleStore";
import useStreamingConversationsStore from "@/stores/streamingConversationsStore";

// Constants
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;
const BATCH_UPDATE_INTERVAL_MILLISECONDS = 15;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useSocketIO = (conversationId?: string) => {
  const { setError } = useError();
  const reconnectAttemptsRef = useRef(0);
  const batchedContentRef = useRef<string>("");
  const isStreamingRef = useRef<boolean>(false);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTokenRef = useRef<string | null>(null);

  const setIsConnected = useLoadingStore(
    (state) => state.setIsConnected
  );
  const setIsStreaming = useLoadingStore(
    (state) => state.setIsStreaming
  );
  const setWebSocketError = useLoadingStore(
    (state) => state.setWebSocketError
  );
  const setWebSocket = useWebSocketRefStore(
    (state) => state.setWebSocket
  );
  const setConversationId = useLoadingStore(
    (state) => state.setConversationId
  );
  const currentConversationId = useLoadingStore(
    (state) => state.currentConversationId
  );
  const setCurrentConversationId = useLoadingStore(
    (state) => state.setCurrentConversationId
  );
  const socketRef = useRef<Socket | null>(null);
  const setConversationTitle = useConversationTitleStore(
    (state) => state.setConversationTitle
  );
  const streamingConversations = useStreamingConversationsStore(
    (state) => state.streamingConversations
  );
  const currentConversationIdRef = useRef(currentConversationId);
  const setStreamingConversations = useStreamingConversationsStore(
    (state) => state.setStreamingConversation
  );
  const setIsTyping = useLoadingStore((state) => state.setIsTyping);
  const setMessages = useMessageStore((state) => state.setMessages);

  // Token refresh function
  const refreshToken = useCallback(async (): Promise<
    string | null
  > => {
    try {
      const refreshRes = await fetch(
        `${API_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!refreshRes.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = (await refreshRes.json()) as AccessTokenResponse;
      currentTokenRef.current = data.accessToken;
      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await signOut({ redirect: true, callbackUrl: "/login" });
      return null;
    }
  }, []);

  // Get valid token (with auto-refresh if needed)
  const getValidToken = useCallback(async (): Promise<
    string | null
  > => {
    const session = await getSession();
    const isTokenValid =
      session?.accessToken &&
      session?.accessTokenExpires > Date.now();

    if (isTokenValid) {
      currentTokenRef.current = session.accessToken;
      return session.accessToken;
    }

    // Token is expired or missing, try to refresh
    return await refreshToken();
  }, [refreshToken]);

  // Update socket auth token
  const updateSocketAuth = useCallback(
    async (socket: Socket) => {
      const token = await getValidToken();
      if (token && socket.connected) {
        socket.auth = { token };
        // Emit auth event to update server-side authentication
        socket.emit("authenticate", { token });
      }
    },
    [getValidToken]
  );

  useEffect(() => {
    currentConversationIdRef.current = currentConversationId;
  }, [currentConversationId]);

  useEffect(() => {
    setCurrentConversationId(conversationId);
  }, [conversationId, setCurrentConversationId]);

  const isConversationStreaming = useCallback(
    (conversationId: string | undefined) => {
      if (!conversationId) return false;
      return streamingConversations.has(conversationId);
    },
    [streamingConversations]
  );

  useEffect(() => {
    setConversationId(currentConversationId);
    const isStreaming =
      isConversationStreaming(currentConversationId) ||
      !currentConversationId;
    setIsStreaming(isStreaming);
  }, [
    setIsStreaming,
    setConversationId,
    currentConversationId,
    isConversationStreaming,
  ]);

  const flushBatchedContent = useCallback(
    (conversationId: string) => {
      if (
        batchedContentRef.current &&
        currentConversationIdRef.current
      ) {
        const contentToFlush = batchedContentRef.current;
        setMessages((prevMessages) => {
          const currentMessages = prevMessages[conversationId] || [];
          const lastMessage =
            currentMessages[currentMessages.length - 1];
          if (lastMessage && !lastMessage.isUser) {
            const updatedMessages = [...currentMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              text: lastMessage.text + contentToFlush,
            };
            return {
              ...prevMessages,
              [conversationId]: updatedMessages,
            };
          }
          return {
            ...prevMessages,
            [conversationId]: [
              ...currentMessages,
              { text: contentToFlush, isUser: false },
            ],
          };
        });
        batchedContentRef.current = "";
      }
    },
    [setMessages]
  );

  const scheduleBatchedUpdate = useCallback(
    (conversationId: string) => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }

      batchTimeoutRef.current = setTimeout(() => {
        flushBatchedContent(conversationId);
        batchTimeoutRef.current = null;
      }, BATCH_UPDATE_INTERVAL_MILLISECONDS);
    },
    [flushBatchedContent]
  );

  const startStreaming = useCallback(
    (conversationId: string) => {
      isStreamingRef.current = true;
      batchedContentRef.current = "";
      setStreamingConversations((prev) =>
        new Set(prev).add(conversationId)
      );
    },
    [setStreamingConversations]
  );

  const stopStreaming = useCallback(
    (conversationId: string) => {
      isStreamingRef.current = false;

      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
        batchTimeoutRef.current = null;
      }
      flushBatchedContent(conversationId);
      batchedContentRef.current = "";

      setStreamingConversations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(conversationId);
        return newSet;
      });
    },
    [setStreamingConversations, flushBatchedContent]
  );

  const setupSocketListeners = useCallback((socket: Socket) => {
    socket.on("connect", async () => {
      setIsConnected(true);
      setWebSocketError(null);
      reconnectAttemptsRef.current = 0;
      await updateSocketAuth(socket);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      const msg = "Failed to connect to server.";
      setError(msg);
      setWebSocketError(msg);
      console.error("Socket connection error:", error);
    });

    // Handle authentication errors from server
    socket.on(
      "auth_error",
      async (data: { message: string; retry?: boolean }) => {
        console.log("Authentication error:", data.message);

        if (data.retry) {
          // Server suggests we can retry with a new token
          const newToken = await refreshToken();
          if (newToken) {
            socket.auth = { token: newToken };
            socket.emit("authenticate", { token: newToken });
          } else {
            // Refresh failed, redirect to login
            await signOut({ redirect: true, callbackUrl: "/login" });
          }
        } else {
          // Authentication failed permanently
          setWebSocketError(
            "Authentication failed. Please sign in again."
          );
          await signOut({ redirect: true, callbackUrl: "/login" });
        }
      }
    );

    // Successful authentication confirmation
    socket.on("authenticated", () => {
      console.log("Socket authenticated successfully");
    });

    // Ping/Pong handling
    socket.on("ping", () => {
      socket.emit("pong");
    });

    // Error handling
    socket.on("error", (data: EventData) => {
      setWebSocketError(data.error || "An unknown error occurred.");
      if (data.conversationId) {
        stopStreaming(data.conversationId);
      }
    });

    // LLM response chunks
    socket.on("llm_response_chunk", (data: EventData) => {
      const { chunk, error, conversationId } = data;

      if (error) {
        setError(error);
        setWebSocketError(error);
        stopStreaming(conversationId);
      } else if (chunk) {
        setIsTyping(false);
        batchedContentRef.current += chunk;
        scheduleBatchedUpdate(conversationId);
      }
    });

    // Conversation creation
    socket.on("conversation_created", (data: EventData) => {
      const { conversationId, placeholderId } = data;

      setCurrentConversationId(conversationId);
      window.history.pushState({}, "", `/chat/${conversationId}`);

      setConversationTitle((prevTitles) => [
        {
          placeholder: true,
          id: conversationId,
          title: "New conversation",
        },
        ...prevTitles,
      ]);

      setMessages((prevMessages) => {
        if (!placeholderId) return prevMessages;
        const conversation = [...prevMessages[placeholderId]];
        const updatedMessages = {
          ...prevMessages,
          [conversationId]: conversation,
        };
        delete updatedMessages[placeholderId];
        return updatedMessages;
      });

      startStreaming(conversationId);
    });

    // Title updates
    socket.on("llm_title_chunk", (data: EventData) => {
      const { chunk, conversationId } = data;

      setConversationTitle((prevTitles) => {
        const existingIndex = prevTitles.findIndex(
          (conv) => conv.id === conversationId
        );

        if (existingIndex !== -1) {
          const conversation = prevTitles[existingIndex];
          const updatedConversations = [...prevTitles];
          updatedConversations[existingIndex] = {
            ...updatedConversations[existingIndex],
            title: conversation.placeholder
              ? chunk || ""
              : (updatedConversations[existingIndex].title || "") +
                (chunk || ""),
            ...(conversation.placeholder && {
              placeholder: false,
            }),
          };
          return updatedConversations;
        } else {
          return [
            {
              title: chunk,
              id: conversationId,
            } as ConversationListItem,
            ...prevTitles,
          ];
        }
      });
    });

    // Stream end
    socket.on("stream_end", (data: EventData) => {
      stopStreaming(data.conversationId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let socket: Socket;

    const initializeSocket = async () => {
      const token = await getValidToken();
      socket = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        timeout: 20000,
        autoConnect: true,
        reconnection: true,
        auth: { token: token },
        reconnectionDelay: RECONNECT_INTERVAL,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      });

      socketRef.current = socket;
      setWebSocket(socket);
      setupSocketListeners(socket);
    };

    initializeSocket();

    return () => {
      if (batchTimeoutRef.current)
        clearTimeout(batchTimeoutRef.current);

      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (socketRef.current?.connected) {
        await updateSocketAuth(socketRef.current);
      }
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(interval);
  }, [updateSocketAuth]);

  return null;
};
