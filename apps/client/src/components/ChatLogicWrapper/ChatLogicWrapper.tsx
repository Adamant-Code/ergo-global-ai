"use client";

// External packages
import { ReactNode } from "react";
import { useParams } from "next/navigation";

// Custom hooks
import { useSocketIO } from "@/hooks/useSocketIO";

const ChatLogicWrapper = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const conversationId = Array.isArray(params.conversationId)
    ? params.conversationId[0]
    : params.conversationId;
  useSocketIO(conversationId);

  return <>{children}</>;
};

export default ChatLogicWrapper;
