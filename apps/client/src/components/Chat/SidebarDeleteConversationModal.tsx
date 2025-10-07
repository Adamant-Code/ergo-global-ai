// Components
import ComfirmationModal from "../Modal/ConfirmationModal";

// External Libraries
import { apiService } from "./api";
import { useRouter } from "next/navigation";

// Custom Hooks
import { useError } from "@/hooks/useError";

// Zustand stores
import useLoadingStore from "@/stores/loadingStore";
import useConversationTitleStore from "@/stores/conversationTitleStore";

const SidebarDeleteConversationModal = ({
  deleteId,
  setDeleteId,
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  deleteId: string | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const router = useRouter();
  const { setError } = useError();
  const conversationId = useLoadingStore(
    (state) => state.conversationId
  );
  const setOpenConversation = useLoadingStore(
    (state) => state.setOpenConversation
  );
  const setCurrentConversationId = useLoadingStore(
    (state) => state.setCurrentConversationId
  );
  const setConversationTitle = useConversationTitleStore(
    (state) => state.setConversationTitle
  );

  const handleDeleteConversation = async (convoId: string | null) => {
    if (!convoId) return;
    try {
      await apiService.deleteConversation(convoId);
      setConversationTitle((prevTitle) =>
        prevTitle.filter((convoTitle) => convoTitle.id !== convoId)
      );

      if (conversationId === convoId) {
        router.push("/chat");
        setOpenConversation(false);
        setCurrentConversationId(undefined);
      }

      setDeleteId(null);
      setIsModalOpen(false);
    } catch (error) {
      setError(error);
    }
  };

  const handleCancel = () => {
    setDeleteId(null);
    setIsModalOpen(false);
  };

  return (
    <ComfirmationModal
      cancelLabel="Cancel"
      confirmLabel="Delete"
      onCancel={handleCancel}
      isModalOpen={isModalOpen}
      title="Delete Conversation"
      descriptionClassName="text-gray-300 text-sm mb-4"
      onConfirm={() => handleDeleteConversation(deleteId)}
      buttonContainerClassName="flex justify-end space-x-3"
      titleClassName="text-lg font-semibold text-white mb-2"
      className="bg-[#1a1a1c] border border-gray-700 rounded-lg p-6 max-w-sm mx-4"
      description="Are you sure you want to delete this conversation? This action cannot be undone."
      confirmButtonClassName="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
    />
  );
};

SidebarDeleteConversationModal.displayName =
  "SidebarDeleteConversationModal";

export default SidebarDeleteConversationModal;
