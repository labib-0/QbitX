/**
 * src/services/automation/GamificationAutomation.ts
 * XP awards, Badge unlocks, and Learning Streak auto-calculation engine
 */

import { EventPayload } from "@/types/automation";

export interface StreakMetrics {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  hasGraceFreeze: boolean;
}

export class GamificationAutomation {
  private static userStreaks: Map<string, StreakMetrics> = new Map();

  /**
   * Auto-award XP based on learning activity
   */
  static processXPEvent(event: EventPayload): { xpEarned: number; newTotalXP: number } {
    let xpEarned = 10; // Default XP

    switch (event.eventType) {
      case "LESSON_COMPLETED":
        xpEarned = 50;
        break;
      case "MODULE_COMPLETED":
        xpEarned = 150;
        break;
      case "COURSE_COMPLETED":
        xpEarned = 500;
        break;
      case "QUIZ_SUBMITTED":
        xpEarned = 30;
        break;
      case "ASSIGNMENT_GRADED":
        xpEarned = 100;
        break;
      case "LOGIN":
        xpEarned = 15;
        break;
    }

    return { xpEarned, newTotalXP: 2450 + xpEarned };
  }

  /**
   * Auto-calculate student learning streak
   */
  static updateStreak(studentId: string): StreakMetrics {
    const todayStr = new Date().toISOString().split("T")[0];
    const existing = this.userStreaks.get(studentId) || {
      currentStreak: 14,
      longestStreak: 21,
      lastActiveDate: "2026-07-31",
      hasGraceFreeze: true,
    };

    if (existing.lastActiveDate !== todayStr) {
      existing.currentStreak += 1;
      if (existing.currentStreak > existing.longestStreak) {
        existing.longestStreak = existing.currentStreak;
      }
      existing.lastActiveDate = todayStr;
      this.userStreaks.set(studentId, existing);
    }

    return existing;
  }
}
