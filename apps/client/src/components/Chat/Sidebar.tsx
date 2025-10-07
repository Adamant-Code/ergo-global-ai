"use client";

// External Libraries
import { useEffect, useState } from "react";

// Components
import { apiService } from "./api";
import MobileMenu from "./MobileMenu";
import SidebarHeader from "./SidebarHeader";
import { useError } from "@/hooks/useError";
import useLoadingStore from "@/stores/loadingStore";
import SidebarConversationHistory from "./SidebarHistory";
import useConversationTitleStore from "@/stores/conversationTitleStore";
import SidebarDeleteConversationModal from "./SidebarDeleteConversationModal";

const Sidebar = () => {
  const { setError } = useError();
  const [isOpen, setIsOpen] = useState(false);
  const setLoadingConversations = useLoadingStore(
    (state) => state.setLoadingConversations
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setConversationTitle = useConversationTitleStore(
    (state) => state.setConversationTitle
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadConversationTitles = async () => {
      try {
        setLoadingConversations(true);
        const conversationsList = await apiService.getConversations();
        setConversationTitle(() => conversationsList);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingConversations(false);
      }
    };
    loadConversationTitles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MobileMenu setIsOpen={setIsOpen} />
      {isOpen && <MobileOverlay setIsOpen={setIsOpen} />}

      <div
        className={`
        fixed lg:relative lg:translate-x-0 z-40 lg:z-auto
        w-64 lg:w-64 md:w-44
        bg-[#1a1a1c] border-r border-gray-800 flex flex-col h-full
        transition-transform duration-300 ease-in-out
        ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <SidebarHeader setIsOpen={setIsOpen} />
        <SidebarConversationHistory
          setDeleteId={setDeleteId}
          setIsModalOpen={setIsModalOpen}
        />
        <SidebarFooter />
      </div>

      <SidebarDeleteConversationModal
        deleteId={deleteId}
        isModalOpen={isModalOpen}
        setDeleteId={setDeleteId}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

const MobileOverlay = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40`}
      onClick={() => setIsOpen(false)}
    />
  );
};

const SidebarFooter = () => (
  <div className="p-4 pb-7 border-gray-800">
    <div className="text-xs text-gray-500 text-center">
      <p>Template</p>
    </div>
  </div>
);

export default Sidebar;
