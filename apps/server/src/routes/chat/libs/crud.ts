import debug from "debug";
import { Conversation } from "@/models/Conversation.js";
import { Message } from "@/models/Message.js";

const socketDebug = debug("server:routes:chat:libs:crud");

export const getOrCreateConversation = async (
  userId: string,
  conversationId?: string
) => {
  try {
    if (conversationId) {
      const converation = await Conversation.query()
        .findById(conversationId)
        .withGraphFetched("messages");

      if (converation)
        return { conversation: converation, isNew: false };
    }

    const now = new Date().toISOString();
    const conversation = await Conversation.query().insert({
      userId,
      createdAt: now,
      updatedAt: now,
      title: "New Conversation",
    });
    return { conversation: conversation, isNew: true };
  } catch (error) {
    socketDebug("Error in getOrCreateConversation:", error);
    throw error;
  }
};

export const createMessage = async (
  role: "user" | "assistant",
  content: string,
  conversationId: string
) => {
  try {
    const now = new Date().toISOString();
    const message = await Message.query().insert({
      role,
      content,
      createdAt: now,
      updatedAt: now,
      conversationId,
    });
    return message;
  } catch (error) {
    socketDebug("Error in createMessage:", error);
    throw new Error("Failed to create message");
  }
};

export const updateConversationTitle = async (
  title: string,
  conversationId: string
) => {
  try {
    const updatedConversation = await Conversation.query()
      .findById(conversationId)
      .patch({ title })
      .returning("*");

    if (!updatedConversation) {
      throw new Error("Conversation not found");
    }

    return updatedConversation;
  } catch (error) {
    socketDebug("Error in updateConversationTitle:", error);
    throw new Error("Failed to update conversation title");
  }
};
