/**
 * src/services/automation/NotificationAutomation.ts
 * In-app notification dispatcher for milestone events, published grades, and team alerts
 */

import { EventPayload } from "@/types/automation";

export class NotificationAutomation {
  static dispatchNotificationForEvent(event: EventPayload): { recipientId: string; title: string; message: string } | null {
    switch (event.eventType) {
      case "ASSIGNMENT_GRADED":
        return {
          recipientId: event.actorId,
          title: "Grade & Feedback Published",
          message: `Your mentor published grades and feedback for assignment ${event.targetId || "submission"}.`,
        };

      case "COURSE_COMPLETED":
        return {
          recipientId: event.actorId,
          title: "Course Completion Certificate Issued! 🎉",
          message: "Congratulations! Your verified certificate of completion is now available in your profile.",
        };

      case "ANNOUNCEMENT_PUBLISHED":
        return {
          recipientId: "all_students",
          title: "New Class Announcement",
          message: "A new announcement was posted by your Senior Mentor.",
        };

      default:
        return null;
    }
  }
}
