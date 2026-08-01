/**
 * src/services/content/ProgressService.ts
 * Manages student learning progress independently from content objects
 */

import {
  LearningProgress,
  ProgressStatus,
  StudentProgressSummary,
} from "@/types/content";
import { MOCK_PROGRESS, MOCK_COURSES, MOCK_LESSONS } from "@/lib/contentData";

let progressStore: LearningProgress[] = [...MOCK_PROGRESS];

export class ProgressService {
  /**
   * Fetch progress records for a user, optionally filtered by entityId or entityType
   */
  static getProgress(
    userId: string,
    entityId?: string,
    entityType?: "track" | "course" | "module" | "lesson" | "activity"
  ): LearningProgress[] {
    return progressStore.filter((p) => {
      const matchesUser = p.userId === userId;
      const matchesEntity = !entityId || p.entityId === entityId;
      const matchesType = !entityType || p.entityType === entityType;
      return matchesUser && matchesEntity && matchesType;
    });
  }

  /**
   * Get progress for a single specific entity
   */
  static getEntityProgress(userId: string, entityId: string): LearningProgress | null {
    return progressStore.find((p) => p.userId === userId && p.entityId === entityId) || null;
  }

  /**
   * Record or update student progress for an entity
   */
  static recordProgress(params: {
    userId: string;
    entityId: string;
    entityType: "track" | "course" | "module" | "lesson" | "activity";
    status: ProgressStatus;
    scorePercentage?: number;
    additionalTimeSeconds?: number;
    watchPercentage?: number;
    verifiedBy?: string;
  }): LearningProgress {
    const existingIndex = progressStore.findIndex(
      (p) => p.userId === params.userId && p.entityId === params.entityId
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = progressStore[existingIndex];
      const updated: LearningProgress = {
        ...existing,
        status: params.status,
        scorePercentage: params.scorePercentage ?? existing.scorePercentage,
        timeSpentSeconds: existing.timeSpentSeconds + (params.additionalTimeSeconds || 0),
        watchPercentage: params.watchPercentage ?? existing.watchPercentage,
        lastAccessedAt: now,
        completedAt: params.status === "completed" ? (existing.completedAt || now) : existing.completedAt,
        verifiedAt: params.status === "verified" ? (existing.verifiedAt || now) : existing.verifiedAt,
        verifiedBy: params.verifiedBy || existing.verifiedBy,
      };
      progressStore[existingIndex] = updated;
      return updated;
    }

    const newRecord: LearningProgress = {
      id: `prog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: params.userId,
      entityId: params.entityId,
      entityType: params.entityType,
      status: params.status,
      scorePercentage: params.scorePercentage,
      timeSpentSeconds: params.additionalTimeSeconds || 0,
      watchPercentage: params.watchPercentage,
      lastAccessedAt: now,
      startedAt: now,
      completedAt: params.status === "completed" ? now : undefined,
      verifiedAt: params.status === "verified" ? now : undefined,
      verifiedBy: params.verifiedBy,
    };

    progressStore.unshift(newRecord);
    return newRecord;
  }

  /**
   * Calculate student summary metrics across all courses and lessons
   */
  static getStudentProgressSummary(userId: string): StudentProgressSummary {
    const userRecords = this.getProgress(userId);

    const enrolledCourses = userRecords.filter((p) => p.entityType === "course");
    const completedCourses = userRecords.filter(
      (p) => p.entityType === "course" && (p.status === "completed" || p.status === "verified")
    );
    const completedLessons = userRecords.filter(
      (p) => p.entityType === "lesson" && (p.status === "completed" || p.status === "verified")
    );
    const completedActivities = userRecords.filter(
      (p) => p.entityType === "activity" && (p.status === "completed" || p.status === "verified")
    );

    const totalTimeSpent = userRecords.reduce((sum, p) => sum + p.timeSpentSeconds, 0);

    const totalCourses = MOCK_COURSES.length;
    const overallProgressPct = Math.round((completedCourses.length / (totalCourses || 1)) * 100);

    return {
      userId,
      overallProgressPercentage: overallProgressPct,
      enrolledTracksCount: userRecords.filter((p) => p.entityType === "track").length,
      enrolledCoursesCount: enrolledCourses.length,
      completedCoursesCount: completedCourses.length,
      completedLessonsCount: completedLessons.length,
      completedActivitiesCount: completedActivities.length,
      totalTimeSpentSeconds: totalTimeSpent,
      activeStreakDays: 14,
      lastActiveDate: new Date().toISOString().split("T")[0],
    };
  }
}
