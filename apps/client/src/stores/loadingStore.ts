import { create } from "zustand";

type State = {
  isTyping: boolean;
  isStreaming: boolean;
  isConnected: boolean;
  conversationId?: string;
  openConversation: boolean;
  loadingConversations: boolean;
  webSocketError: string | null;
  currentConversationId?: string;
  loadingCurrentConversation: boolean;
};

type Action = {
  setIsTyping: (isTyping: boolean) => void;
  setOpenConversation: (openConversation: boolean) => void;
  setWebSocketError: (error: string | null) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setLoadingConversations: (
    loadingConversations: State["loadingConversations"]
  ) => void;
  setConversationId: (conversationId?: string) => void;
  setIsConnected: (isConnected: State["isConnected"]) => void;
  setCurrentConversationId: (conversationId?: string) => void;
  setLoadingCurrentConversation: (
    loadingCurrentConversation: State["loadingCurrentConversation"]
  ) => void;
};

const initialLoadingState: State = {
  isTyping: false,
  isConnected: false,
  isStreaming: false,
  webSocketError: null,
  openConversation: false,
  conversationId: undefined,
  loadingConversations: false,
  currentConversationId: undefined,
  loadingCurrentConversation: false,
};

const useLoadingStore = create<State & Action>()((set) => {
  const setIsStreaming = (isStreaming: State["isStreaming"]) => {
    set({ isStreaming });
  };
  const setIsTyping = (isTyping: State["isTyping"]) => {
    set({ isTyping });
  };
  const setWebSocketError = (
    webSocketError: State["webSocketError"]
  ) => {
    set({ webSocketError });
  };
  const setLoadingConversations = (
    loadingConversations: State["loadingConversations"]
  ) => {
    set({ loadingConversations });
  };
  const setOpenConversation = (openConversation: boolean) => {
    set({ openConversation });
  };
  const setConversationId = (conversationId?: string) => {
    set({ conversationId });
  };

  const setLoadingCurrentConversation = (
    loadingCurrentConversation: State["loadingCurrentConversation"]
  ) => {
    set({ loadingCurrentConversation });
  };

  const setIsConnected = (isConnected: State["isConnected"]) => {
    set({ isConnected });
  };

  const setCurrentConversationId = (conversationId?: string) => {
    set({ currentConversationId: conversationId });
  };

  return {
    ...initialLoadingState,
    setIsTyping,
    setIsStreaming,
    setIsConnected,
    setWebSocketError,
    setConversationId,
    setOpenConversation,
    setLoadingConversations,
    setCurrentConversationId,
    setLoadingCurrentConversation,
  };
});

export default useLoadingStore;
