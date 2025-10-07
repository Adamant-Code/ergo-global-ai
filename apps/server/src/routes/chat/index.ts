import debugLib from "debug";
import { Namespace, Socket } from "socket.io";
import setupChatEventHandlers from "./eventHandler.js";
import { UserSession } from "./services/userSession.js";
import { jwtSocketMiddleware } from "./middleware/socket.js";
import GlobalTaskManager from "./services/gloablTaskManager.js";

const socketDebug = debugLib("server/src:routes:chat:socket");

/** Setup chat namespace */
export const setupChatNamespaceListeners = (io: Namespace) => {
  const globalTaskManager = GlobalTaskManager.getInstance();

  io.use(jwtSocketMiddleware);

  io.on("connection", async (socket: Socket) => {
    socketDebug(`New client connected: ${socket.id}`);

    const session = new UserSession(socket, "/chat");

    if (!session)
      return socketDebug(`Session creation failed for ${socket.id}`);

    // Set up chat handlers
    await setupChatEventHandlers(session, globalTaskManager);

    socket.on("disconnect", async (reason) => {
      socketDebug(
        `Client disconnected: ${socket.id}. Reason: ${reason}`
      );

      const sessionId = session.getConnectionId();
      if (sessionId) await globalTaskManager.removeSession(sessionId);
    });
  });

  // Global stats monitoring
  setInterval(() => {
    const stats = globalTaskManager.getGlobalStats();
    if (stats.activeSessions > 0) {
      socketDebug(
        `Task Stats: ${stats.activeSessions} sessions, ${stats.totalTasks} tasks`
      );
    }
  }, 60000);
};
