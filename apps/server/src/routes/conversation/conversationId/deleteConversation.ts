import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Conversation } from "@/models/Conversation.js";

const deleteConversationHandler = asyncHandler(
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
            .where("userId", userId);

        if (!conversation) {
            res.status(404).json({ message: "Conversation not found" });
            return;
        }

        await Conversation.query()
            .deleteById(conversationId)
            .where("userId", userId);

        res.status(204).send();
    }
);

export default deleteConversationHandler;