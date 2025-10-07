// External Libraries
import { Fragment, memo } from "react";
import { History } from "lucide-react";
import SidebarConversationItem from "./SidebarConversationItem";

// Zustand stores
import useLoadingStore from "@/stores/loadingStore";
import useConversationTitleStore from "@/stores/conversationTitleStore";

const SidebarConversationHistory = memo(
  ({
    setDeleteId,
    setIsModalOpen
  }: {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  }) => {
    const loadingConversations = useLoadingStore(
      (state) => state.loadingConversations
    );
    const conversationTitle = useConversationTitleStore(
      (state) => state.conversationTitle
    );

    return (
      <div className="flex-1 overflow-y-auto max-w-full">
        <div className="py-4 px-2 w-full">
          <div className="flex items-center space-x-2 mb-4 px-2">
            <History className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-medium text-gray-400 tracking-wide">
              History
            </h2>
          </div>

          {loadingConversations ? (
            <div className="px-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="mb-2 animate-pulse"
                >
                  <div className="h-4 bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : conversationTitle.length === 0 ? (
            <div className="px-2 text-center text-gray-500 text-xs">
              No conversations yet
            </div>
          ) : (
            <ul className="w-full">
              {conversationTitle.map((convo) => (
                <Fragment key={convo.id}>
                  <SidebarConversationItem
                    key={convo.id}
                    convo={convo}
                    setDeleteId={setDeleteId}
                    setIsModalOpen={setIsModalOpen}
                  />
                </Fragment>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

SidebarConversationHistory.displayName = "SidebarConversationHistory";
export default SidebarConversationHistory;
