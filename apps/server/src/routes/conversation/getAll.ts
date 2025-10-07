import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Conversation } from "@/models/Conversation.js";

const getAllConversationsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const conversations = await Conversation.query()
      .where("userId", userId)
      .select("id", "title")
      .orderBy("updatedAt", "desc");

    res.json(conversations);
  }
);

export default getAllConversationsHandler;
