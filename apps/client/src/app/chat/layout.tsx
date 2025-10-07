import "@/styles/chatbot.css";

import Sidebar from "@/components/Chat/Sidebar";
import ChatLogicWrapper from "@/components/ChatLogicWrapper/ChatLogicWrapper";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatLogicWrapper>
      <div className="relative flex h-screen bg-[#161618] overflow-hidden">
        <Sidebar />
        <div className="flex-1 lg:flex-1 w-full lg:w-auto min-w-0 relative">
          {children}
        </div>
      </div>
    </ChatLogicWrapper>
  );
}
