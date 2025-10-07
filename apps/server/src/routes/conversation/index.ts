import express from "express";

// Auth routes
import getAllConversationsHandler from "./getAll.js";
import { verifyJWT } from "@/middleware/verifyJWT.js";
import getConversationWithMessagesHandler from "./conversationId/getConversation.js";
import deleteConversationHandler from "./conversationId/deleteConversation.js";

const router = express.Router();

router.get("/", verifyJWT, getAllConversationsHandler);
router.get(
  "/:conversationId",
  verifyJWT,
  getConversationWithMessagesHandler
);
router.delete(
  "/:conversationId",
  verifyJWT,

  deleteConversationHandler
);

export default router;
