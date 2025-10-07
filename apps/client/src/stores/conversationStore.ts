import { create } from "zustand";
import { Conversations } from "@/types/web-socket";

type State = {
  messages: Conversations;
};

type Action = {
  clearMessages: () => void;
  setMessages: (
    updater: (prev: Conversations) => Conversations
  ) => void;
};

const initialMessages: Conversations = {};

const useMessageStore = create<State & Action>()((set) => {
  const setMessages = (
    updater: (prev: Conversations) => Conversations
  ) => {
    set((state) => ({
      messages: updater(state.messages),
    }));
  };

  const clearMessages = () => set({ messages: initialMessages });

  return {
    setMessages,
    clearMessages,
    messages: initialMessages,
  };
});

export default useMessageStore;
