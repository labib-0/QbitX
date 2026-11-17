import { describe, it, expect } from "vitest";

describe("Learning Progress & Gamification Math", () => {
  describe("Course Completion Percentage", () => {
    function calculateCourseProgress(completedCount: number, totalCount: number): number {
      if (totalCount <= 0) return 0;
      const pct = Math.round((completedCount / totalCount) * 100);
      return Math.min(100, Math.max(0, pct));
    }

    it("returns 0% when no lessons completed", () => {
      expect(calculateCourseProgress(0, 10)).toBe(0);
    });

    it("calculates accurate percentage for partial completion", () => {
      expect(calculateCourseProgress(3, 10)).toBe(30);
      expect(calculateCourseProgress(1, 3)).toBe(33);
      expect(calculateCourseProgress(2, 3)).toBe(67);
    });

    it("returns 100% when all lessons completed", () => {
      expect(calculateCourseProgress(10, 10)).toBe(100);
    });

    it("caps at 100% even if completedCount exceeds totalCount", () => {
      expect(calculateCourseProgress(12, 10)).toBe(100);
    });

    it("handles zero total count gracefully without dividing by zero", () => {
      expect(calculateCourseProgress(0, 0)).toBe(0);
    });
  });

  describe("Student XP & Level Computation", () => {
    function computeStudentLevel(xp: number): { level: number; nextLevelXp: number } {
      const safeXp = Math.max(0, xp);
      const level = Math.floor(safeXp / 500) + 1;
      const nextLevelXp = level * 500;
      return { level, nextLevelXp };
    }

    it("starts at Level 1 for 0 XP", () => {
      const result = computeStudentLevel(0);
      expect(result.level).toBe(1);
      expect(result.nextLevelXp).toBe(500);
    });

    it("remains Level 1 up to 499 XP", () => {
      const result = computeStudentLevel(450);
      expect(result.level).toBe(1);
      expect(result.nextLevelXp).toBe(500);
    });

    it("reaches Level 2 at 500 XP", () => {
      const result = computeStudentLevel(500);
      expect(result.level).toBe(2);
      expect(result.nextLevelXp).toBe(1000);
    });

    it("reaches Level 5 at 2150 XP", () => {
      const result = computeStudentLevel(2150);
      expect(result.level).toBe(5);
      expect(result.nextLevelXp).toBe(2500);
    });
  });

  describe("Project Status Lifecycle", () => {
    type ProjectStatus = "in_progress" | "submitted" | "completed";

    function canTransition(current: ProjectStatus, next: ProjectStatus): boolean {
      if (current === "in_progress" && next === "submitted") return true;
      if (current === "submitted" && (next === "completed" || next === "in_progress")) return true;
      if (current === "completed") return false; // Terminal state
      return false;
    }

    it("allows transition from in_progress to submitted", () => {
      expect(canTransition("in_progress", "submitted")).toBe(true);
    });

    it("allows mentor to transition from submitted to completed upon approval", () => {
      expect(canTransition("submitted", "completed")).toBe(true);
    });

    it("allows returning to in_progress if changes requested", () => {
      expect(canTransition("submitted", "in_progress")).toBe(true);
    });

    it("disallows modifications once completed", () => {
      expect(canTransition("completed", "submitted")).toBe(false);
      expect(canTransition("completed", "in_progress")).toBe(false);
    });
  });
});
