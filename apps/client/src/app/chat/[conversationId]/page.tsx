import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Chat from "@/components/Chat/Chat";

interface ConversationPageProps {
  params: {
    conversationId: string;
  };
}

export default function ConversationPage({
  params,
}: ConversationPageProps) {
  return (
    <ProtectedRoute>
      <Chat slug={params.conversationId} />
    </ProtectedRoute>
  );
}
