import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Conversation } from "@/models/Conversation.js";

const getConversationWithMessagesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { conversationId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    if (!conversationId) {
      res.status(400).json({ message: "conversationId is required" });
      return;
    }

    const conversation = await Conversation.query()
      .findById(conversationId)
      .where("userId", userId)
      .withGraphFetched("messages")
      .select("id", "createdAt");

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    res.json({
      id: conversation.id,
      createdAt: conversation.createdAt,
      messages: conversation.messages || [],
    });
  }
);

export default getConversationWithMessagesHandler;
