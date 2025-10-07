import debug from "debug";
import SessionTaskManager from "./sessionTaskManager.js";

const socketDebug = debug(
  "server/src:routes:chat:services:globalTaskManager"
);

/**
 * Global task manager that manages multiple session task managers.
 */
class GlobalTaskManager {
  private static instance: GlobalTaskManager;
  private sessionTaskManagers = new Map<string, SessionTaskManager>();

  private constructor() {}

  static getInstance(): GlobalTaskManager {
    if (!GlobalTaskManager.instance) {
      GlobalTaskManager.instance = new GlobalTaskManager();
    }
    return GlobalTaskManager.instance;
  }

  getSessionTaskManager(sessionId: string): SessionTaskManager {
    if (!this.sessionTaskManagers.has(sessionId)) {
      this.sessionTaskManagers.set(
        sessionId,
        new SessionTaskManager(sessionId)
      );
    }
    return this.sessionTaskManagers.get(sessionId)!;
  }

  async removeSession(sessionId: string): Promise<void> {
    const taskManager = this.sessionTaskManagers.get(sessionId);
    if (taskManager) {
      await taskManager.cancelAllTasks();
      this.sessionTaskManagers.delete(sessionId);
      socketDebug(`Removed task manager for session ${sessionId}`);
    }
  }

  getGlobalStats() {
    const managers = Array.from(this.sessionTaskManagers.values());
    return {
      activeSessions: managers.length,
      totalTasks: managers.reduce(
        (sum, manager) => sum + manager.getTaskCount(),
        0
      ),
      tasksByType: managers.reduce(
        (acc, manager) => {
          const stats = manager.getStats();
          acc.llm_prompt += stats.tasksByType.llm_prompt;
          acc.title_generation += stats.tasksByType.title_generation;
          return acc;
        },
        { llm_prompt: 0, title_generation: 0 }
      ),
    };
  }
}

export default GlobalTaskManager;
