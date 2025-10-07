import debugLib from "debug";
import processMessage from "./libs/processMessage.js";
import { UserSession } from "./services/userSession.js";
import GlobalTaskManager from "./services/gloablTaskManager.js";

const socketDebug = debugLib("server/src:routes:chat:eventHandler");

/**
 * Setup chat event handlers with integrated task management
 */
async function setupChatEventHandlers(
  session: UserSession,
  globalTaskManager: GlobalTaskManager
) {
  await session.connect();
  const sessionId = session.getConnectionId();

  if (!sessionId) throw new Error("Failed to get session ID");

  const taskManager =
    globalTaskManager.getSessionTaskManager(sessionId);

  // Handle pong - your existing UserSession handles this
  session.on("pong", async () => {
    await session.handlePong();
    socketDebug(`Received pong from ${sessionId}`);
  });

  // Handle LLM prompts with concurrent task management
  session.on(
    "llm_prompt",
    async (data: {
      model?: string;
      userPrompt: string;
      placeholderId?: string;
      conversationId?: string;
    }) => {
      taskManager
        .createTask({
          taskType: "llm_prompt",
          conversationId: data.conversationId,
          taskFn: (abortSignal) =>
            processMessage({
              data,
              session,
              taskManager,
              abortSignal,
            }),
        })
        .catch(async (error) => {
          socketDebug(
            `LLM prompt task failed for ${sessionId}:`,
            error
          );

          try {
            await session.sendError(error as Error, {
              event: "llmPrompt",
              originalData: data,
            });
          } catch (sendError) {
            socketDebug(`Failed to send error:`, sendError);
          }
        });
    }
  );

  // Handle conversation cancellation
  session.on(
    "cancel_conversation",
    async ({ conversationId }: { conversationId: string }) => {
      await taskManager.cancelTasksForConversation(conversationId);
      await session.emit("conversation_cancelled", { conversationId });
      socketDebug(
        `Cancelled all tasks for conversation ${conversationId}`
      );
    }
  );

  // Handle task stats request
  session.on("get_task_stats", async () => {
    const stats = taskManager.getStats();
    await session.emit("task_stats", stats);
  });

  // Handle errors
  session.on("error", async (error: Error) => {
    socketDebug(`Session error for ${sessionId}:`, error);
    await session.sendError(error);
  });
}

export default setupChatEventHandlers;
