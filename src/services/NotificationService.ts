/**
 * NotificationService.ts
 * Manages student notifications, alerts, and messages.
 * 
 * TODO: Replace with real notification WebSocket / Push API.
 */

export interface NotificationItem {
  id: string;
  type: "assignment" | "mentor" | "guild" | "course" | "achievement";
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
}

export class NotificationService {
  static async getNotifications(): Promise<NotificationItem[]> {
    return [
      {
        id: "n1",
        type: "mentor",
        title: "Senior Mentor Feedback Available",
        message: "Dr. Sarah Chen reviewed your RAG Pipeline pull request #14.",
        timeAgo: "15 min ago",
        read: false,
      },
      {
        id: "n2",
        type: "assignment",
        title: "Assignment Due Reminder",
        message: "DSA Lab #4 (Graph Traversal Algorithms) is due tomorrow at 11:59 PM.",
        timeAgo: "1 hour ago",
        read: false,
      },
      {
        id: "n3",
        type: "achievement",
        title: "Streak Milestone Unlocked! 🔥",
        message: "You maintained a 14-Day Learning Streak! +250 Bonus XP awarded.",
        timeAgo: "4 hours ago",
        read: true,
      },
      {
        id: "n4",
        type: "guild",
        title: "AI Guild Workshop Announcement",
        message: "Join tonight's live workshop on Fine-Tuning Llama 3 models.",
        timeAgo: "Yesterday",
        read: true,
      },
    ];
  }
}
