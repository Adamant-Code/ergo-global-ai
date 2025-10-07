import { create } from "zustand";
import { ConversationListItem } from "@/components/Chat/api";

type State = {
  conversationTitle: ConversationListItem[];
};

type Action = {
  setConversationTitle: (
    updater: (prev: ConversationListItem[]) => ConversationListItem[]
  ) => void;
};

const initialConversationTitle: ConversationListItem[] = [];

const useConversationTitleStore = create<State & Action>()((set) => {
  const setConversationTitle = (
    updater: (prev: ConversationListItem[]) => ConversationListItem[]
  ) => {
    set((state) => ({
      conversationTitle: updater(state.conversationTitle),
    }));
  };

  return {
    setConversationTitle,
    conversationTitle: initialConversationTitle,
  };
});

export default useConversationTitleStore;
