import debug from "debug";

const socketDebug = debug(
  "server/src:routes:chat:services:sessionTaskManager"
);

const TASK_CONFIG = {
  TASK_TIMEOUT_MS: 60000,
  CLEANUP_INTERVAL_MS: 30000,
  MAX_CONCURRENT_TASKS_PER_SESSION: 10,
} as const;

interface TaskInfo {
  id: string;
  startTime: number;
  conversationId?: string;
  timeoutId: NodeJS.Timeout;
  abortController: AbortController;
  type: "llm_prompt" | "title_generation";
  status: "running" | "completed" | "failed" | "cancelled";
}

/**
 * This adds concurrent task management for sessions.
 * It allows multiple tasks to be run concurrently, with a limit on the number of concurrent tasks
 */
class SessionTaskManager {
  private taskCounter = 0;
  private lastActivity = Date.now();
  private activeTasks = new Map<string, TaskInfo>();

  constructor(private readonly sessionId: string) {}

  async createTask<T>({
    taskFn,
    taskType,
    conversationId,
    timeoutMs = TASK_CONFIG.TASK_TIMEOUT_MS,
  }: {
    timeoutMs?: number;
    conversationId?: string;
    taskType: "llm_prompt" | "title_generation";
    taskFn: (abortSignal: AbortSignal) => Promise<T>;
  }): Promise<T> {
    // Rate limiting check
    if (
      this.activeTasks.size >=
      TASK_CONFIG.MAX_CONCURRENT_TASKS_PER_SESSION
    ) {
      throw new Error(
        `Too many concurrent tasks (max: ${TASK_CONFIG.MAX_CONCURRENT_TASKS_PER_SESSION})`
      );
    }

    const startTime = Date.now();
    const taskId = this.generateTaskId(taskType);
    const abortController = new AbortController();

    // Setup timeout
    const timeoutId = setTimeout(() => {
      socketDebug(`Task ${taskId} timed out after ${timeoutMs}ms`);
      abortController.abort();
    }, timeoutMs);

    const taskInfo: TaskInfo = {
      startTime,
      timeoutId,
      id: taskId,
      type: taskType,
      conversationId,
      abortController,
      status: "running",
    };

    this.activeTasks.set(taskId, taskInfo);
    this.updateActivity();

    socketDebug(
      `Created ${taskType} task ${taskId} for session ${this.sessionId} (${this.activeTasks.size} active)`
    );

    try {
      const result = await taskFn(abortController.signal);
      taskInfo.status = "completed";
      return result;
    } catch (error) {
      taskInfo.status = abortController.signal.aborted
        ? "cancelled"
        : "failed";

      if (abortController.signal.aborted) {
        throw new Error(`Task ${taskId} was cancelled or timed out`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      this.activeTasks.delete(taskId);
      socketDebug(
        `Task ${taskId} completed for session ${this.sessionId} (${this.activeTasks.size} remaining)`
      );
    }
  }

  async cancelAllTasks(): Promise<void> {
    if (this.activeTasks.size === 0) return;

    socketDebug(
      `Cancelling ${this.activeTasks.size} active tasks for session ${this.sessionId}`
    );

    // Abort all tasks
    for (const taskInfo of this.activeTasks.values()) {
      taskInfo.status = "cancelled";
      taskInfo.abortController.abort();
      clearTimeout(taskInfo.timeoutId);
    }

    // Wait briefly for cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.activeTasks.clear();

    socketDebug(`All tasks cancelled for session ${this.sessionId}`);
  }

  getTaskCount(): number {
    return this.activeTasks.size;
  }

  getTasksByConversation(conversationId: string): TaskInfo[] {
    return Array.from(this.activeTasks.values()).filter(
      (task) => task.conversationId === conversationId
    );
  }

  async cancelTasksForConversation(
    conversationId: string
  ): Promise<void> {
    const tasksToCancel = this.getTasksByConversation(conversationId);

    if (tasksToCancel.length === 0) return;

    socketDebug(
      `Cancelling ${tasksToCancel.length} tasks for conversation ${conversationId}`
    );

    for (const task of tasksToCancel) {
      task.status = "cancelled";
      task.abortController.abort();
      clearTimeout(task.timeoutId);
      this.activeTasks.delete(task.id);
    }
  }

  getStats() {
    const now = Date.now();
    const tasks = Array.from(this.activeTasks.values());

    return {
      sessionId: this.sessionId,
      activeTaskCount: tasks.length,
      tasksByType: {
        llm_prompt: tasks.filter((t) => t.type === "llm_prompt")
          .length,
        title_generation: tasks.filter(
          (t) => t.type === "title_generation"
        ).length,
      },
      longestRunningTask:
        tasks.length > 0
          ? Math.max(...tasks.map((t) => now - t.startTime))
          : 0,
      lastActivity: this.lastActivity,
    };
  }

  private generateTaskId(taskType: string): string {
    return `${taskType}_${this.sessionId}_${++this
      .taskCounter}_${Date.now()}`;
  }

  private updateActivity(): void {
    this.lastActivity = Date.now();
  }
}
export default SessionTaskManager;
