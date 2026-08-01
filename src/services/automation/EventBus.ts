/**
 * src/services/automation/EventBus.ts
 * Centralized Publisher/Subscriber event bus for QbitX platform actions
 */

import { EventPayload, EventType } from "@/types/automation";

type EventListener = (event: EventPayload) => Promise<void> | void;

export class EventBus {
  private static listeners: Map<EventType, EventListener[]> = new Map();

  /**
   * Subscribe to a platform event
   */
  static subscribe(eventType: EventType, listener: EventListener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  /**
   * Publish a platform event to all subscribed listeners
   */
  static async publish(event: Omit<EventPayload, "eventId" | "timestamp">): Promise<EventPayload> {
    const fullEvent: EventPayload = {
      ...event,
      eventId: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    const eventListeners = this.listeners.get(event.eventType) || [];

    for (const listener of eventListeners) {
      try {
        await listener(fullEvent);
      } catch (error) {
        console.error(`[EventBus] Error handling event ${event.eventType}:`, error);
      }
    }

    return fullEvent;
  }
}
