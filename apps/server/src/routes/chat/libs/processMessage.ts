import debug from "debug";
import {
  streamTitleResponse,
  streamPromptResponse,
} from "./streamResponse.js";
import { formatMessageFields } from "./messages.js";
import { UserSession } from "../services/userSession.js";
import { getTitlePrompt } from "../prompt/systemPrompt.js";
import { createMessage, updateConversationTitle } from "./crud.js";
import SessionTaskManager from "../services/sessionTaskManager.js";

const socketDebug = debug(
  "server/src:routes:chat:libs:processMessage"
);

const processMessage = async ({
  data,
  session,
  taskManager,
  abortSignal,
}: {
  data: {
    model?: string;
    userPrompt: string;
    placeholderId?: string;
    conversationId?: string;
  };
  session: UserSession;
  abortSignal: AbortSignal;
  taskManager: SessionTaskManager;
}): Promise<void> => {
  const {
    model,
    userPrompt,
    placeholderId,
    conversationId: convoId,
  } = data;

  try {
    if (abortSignal.aborted)
      throw new Error("Task was cancelled before processing");
    if (!userPrompt) throw new Error("Missing userPrompt");

    const { isNew, conversation } =
      await session.getOrCreateConversation(convoId);
    const conversationId = conversation.id;

    if (abortSignal.aborted)
      throw new Error("Task was cancelled during conversation setup");
    if (isNew && placeholderId) {
      await session.emit("conversation_created", {
        placeholderId,
        conversationId,
      });
    }

    createMessage("user", userPrompt, conversationId);

    const chunks: string[] = [];
    const messages = formatMessageFields(conversation);
    await streamPromptResponse({
      model,
      chunks,
      session,
      abortSignal,
      conversationId,
      message: userPrompt,
      prev_messages: messages,
      event: "llm_response_chunk",
    });

    if (abortSignal.aborted)
      throw new Error("Task was cancelled during streaming");

    const fullResponse = chunks.join("");
    createMessage("assistant", fullResponse, conversationId);

    // Handle title generation for new conversations
    if (isNew && !abortSignal.aborted) {
      taskManager
        .createTask({
          conversationId,
          taskType: "title_generation",
          taskFn: async (abortSignaal) => {
            const titleChunks: string[] = [];
            const titlePrompt = getTitlePrompt(
              userPrompt,
              fullResponse
            );

            await streamTitleResponse({
              model,
              session,
              conversationId,
              chunks: titleChunks,
              message: titlePrompt,
              event: "llm_title_chunk",
              abortSignal: abortSignaal,
            });

            if (!abortSignaal.aborted) {
              const titleMessage = titleChunks.join("");
              updateConversationTitle(titleMessage, conversationId);
            }
          },
        })
        .catch((error) => {
          socketDebug(
            `Title generation failed for ${conversationId}:`,
            error
          );
        });
    }

    if (!abortSignal.aborted) {
      await session.emit("stream_end", { conversationId });
      socketDebug(
        `Completed processing for conversation ${conversationId}`
      );
    }
  } catch (error) {
    socketDebug(
      `Error processing message for session ${session.getConnectionId()}:`,
      error
    );
    await session.sendError(error as Error, {
      event: "llmPrompt",
      originalData: data,
    });
    return;
  }
};

export default processMessage;
