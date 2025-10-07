// External Libraries
import Link from "next/link";
import { memo, useCallback, useMemo } from "react";
import { MessageSquare, Trash2 } from "lucide-react";

// Zustand stores
import useLoadingStore from "@/stores/loadingStore";
import useStreamingConversationsStore from "@/stores/streamingConversationsStore";

const SidebarConversationItem = memo(
  ({
    convo,
    setDeleteId,
    setIsModalOpen,
  }: {
    convo: {
      id: string;
      title: string;
    };
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDeleteId: (value: React.SetStateAction<string | null>) => void;
  }) => {
    const conversationId = useLoadingStore(
      (state) => state.conversationId
    );
    const streamingConversations = useStreamingConversationsStore(
      (state) => state.streamingConversations
    );
    const setOpenConversation = useLoadingStore(
      (state) => state.setOpenConversation
    );

    const isActive = useMemo(
      () => conversationId === convo.id,
      [conversationId, convo.id]
    );

    const isConversationStreaming = useMemo(
      () => streamingConversations.has(convo.id),
      [streamingConversations, convo.id]
    );

    const handleLinkClick = useCallback(() => {
      setOpenConversation(true);
    }, [setOpenConversation]);

    const handleDeleteClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        if (isConversationStreaming) return;
        setIsModalOpen(true);
        setDeleteId(convo.id);
      },
      [convo.id, setIsModalOpen, setDeleteId, isConversationStreaming]
    );

    const linkClasses = useMemo(
      () =>
        `flex-1 py-1 w-full px-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gray-700 text-white"
            : "hover:bg-[#252628] text-gray-300 hover:text-white"
        }`,
      [isActive]
    );

    const iconClasses = useMemo(
      () =>
        `w-3 h-3 flex-shrink-0 ${
          isActive ? "text-white" : "text-gray-500"
        }`,
      [isActive]
    );

    return (
      <li
        key={convo.id}
        className="w-full relative group"
      >
        <div className="flex items-center w-full">
          <Link
            href={`/chat/${convo.id}`}
            className={linkClasses}
            onClick={handleLinkClick}
          >
            <div className="flex items-center justify-between w-full relative">
              <div className="flex items-center space-x-2 w-full flex-1">
                <MessageSquare className={iconClasses} />
                <span className="text-xs w-full font-normal truncate">
                  {convo.title}
                </span>
              </div>
            </div>
          </Link>
        </div>
        <button
          onClick={handleDeleteClick}
          className="absolute right-0 top-[2px] ml-1 p-1 text-red-300 hover:text-red-500 z-10 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
          title="Delete conversation"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </li>
    );
  }
);

SidebarConversationItem.displayName = "SidebarConversationItem";

export default SidebarConversationItem;
