import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Chat from "@/components/Chat/Chat";

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  );
}
