/**
 * src/services/workspace/LearningAnalytics.ts
 * Event tracking engine for collecting student learning interactions with offline queue capability
 */

import { LearningEvent, LearningEventType } from "@/types/workspace";

const EVENT_QUEUE_STORAGE_KEY = "qbitx_learning_event_queue";

export class LearningAnalytics {
  private static eventQueue: LearningEvent[] = [];

  /**
   * Dispatch a learning event
   */
  static logEvent(params: {
    userId: string;
    courseId: string;
    lessonId?: string;
    eventType: LearningEventType;
    payload?: Record<string, unknown>;
  }): LearningEvent {
    const event: LearningEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      courseId: params.courseId,
      lessonId: params.lessonId,
      eventType: params.eventType,
      payload: params.payload,
      timestamp: new Date().toISOString(),
      offlineQueued: typeof window !== "undefined" && !navigator.onLine,
    };

    this.eventQueue.push(event);

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(EVENT_QUEUE_STORAGE_KEY);
        const existing = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          EVENT_QUEUE_STORAGE_KEY,
          JSON.stringify([event, ...existing].slice(0, 100))
        );
      } catch (e) {
        console.error("Failed to store learning event:", e);
      }
    }

    return event;
  }

  /**
   * Get all logged events for testing / analytics export
   */
  static getQueuedEvents(): LearningEvent[] {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(EVENT_QUEUE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : this.eventQueue;
      } catch (e) {
        return this.eventQueue;
      }
    }
    return this.eventQueue;
  }
}
