import { Conversation } from "@/models/Conversation.js";

export const formatMessageFields = (conversation: Conversation) =>
  conversation?.messages?.map((msg) => ({
    content: msg.content,
    role: msg.role as "user" | "assistant",
  })) || [];
