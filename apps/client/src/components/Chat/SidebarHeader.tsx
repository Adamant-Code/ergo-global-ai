// External Libraries
import Link from "next/link";
import { Plus, X } from "lucide-react";

// Zustand stores
import useLoadingStore from "@/stores/loadingStore";

const SidebarHeader = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const setCurrentConversationId = useLoadingStore(
    (state) => state.setCurrentConversationId
  );
  const setOpenConversation = useLoadingStore(
    (state) => state.setOpenConversation
  );

  return (
    <div className="p-6 border-b border-gray-800">
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <h2 className="text-lg font-semibold text-white pl-11 ">
          Menu
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <Link
        href="/chat"
        onClick={() => {
          setOpenConversation(false);
          setCurrentConversationId(undefined);
        }}
        className="w-full bg-[#252628] hover:bg-[#2a2a2c] text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
      >
        <Plus className="w-3 h-3" />
        <span>New Chat</span>
      </Link>
    </div>
  );
};

export default SidebarHeader;
