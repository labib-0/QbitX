/**
 * src/services/automation/QueueManager.ts
 * Queue-ready background task manager (supports in-memory execution, ready for BullMQ / Redis)
 */

export interface QueueTask {
  id: string;
  taskName: string;
  payload: Record<string, any>;
  attempts: number;
  maxAttempts: number;
  status: "pending" | "processing" | "completed" | "failed";
}

export class QueueManager {
  private static taskQueue: QueueTask[] = [];

  /**
   * Enqueue task for background processing
   */
  static enqueue(taskName: string, payload: Record<string, any>, maxAttempts = 3): QueueTask {
    const task: QueueTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      taskName,
      payload,
      attempts: 0,
      maxAttempts,
      status: "pending",
    };
    this.taskQueue.push(task);
    this.processNext(task);
    return task;
  }

  private static async processNext(task: QueueTask) {
    task.status = "processing";
    task.attempts += 1;

    try {
      // Background execution simulation
      await new Promise((resolve) => setTimeout(resolve, 50));
      task.status = "completed";
    } catch (error) {
      if (task.attempts < task.maxAttempts) {
        task.status = "pending";
      } else {
        task.status = "failed";
      }
    }
  }

  static getQueueStatus() {
    return {
      totalTasks: this.taskQueue.length,
      pending: this.taskQueue.filter((t) => t.status === "pending").length,
      completed: this.taskQueue.filter((t) => t.status === "completed").length,
      failed: this.taskQueue.filter((t) => t.status === "failed").length,
    };
  }
}
