import { create } from "zustand";

type State = {
  streamingConversations: Set<string>;
};

type Action = {
  setStreamingConversation: (
    updater: (prev: Set<string>) => Set<string>
  ) => void;
};

const initialStreamingConversations = new Set<string>();

const useStreamingConversationsStore = create<State & Action>()(
  (set) => {
    const setStreamingConversation = (
      updater: (prev: Set<string>) => Set<string>
    ) => {
      set((state) => ({
        streamingConversations: updater(state.streamingConversations),
      }));
    };

    return {
      setStreamingConversation,
      streamingConversations: initialStreamingConversations,
    };
  }
);

export default useStreamingConversationsStore;
