/**
 * src/services/content/CompletionRuleEngine.ts
 * Configurable rule engine for evaluating module, lesson, and course completion criteria
 */

import { CompletionRule, Course, Module, ProgressStatus } from "@/types/content";
import { ProgressService } from "./ProgressService";
import { ContentRetrievalService } from "./ContentRetrievalService";

export interface RuleEvaluationResult {
  ruleId: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
}

export class CompletionRuleEngine {
  /**
   * Evaluate a single completion rule against student progress
   */
  static evaluateRule(
    rule: CompletionRule,
    userId: string,
    contextEntityId: string
  ): RuleEvaluationResult {
    switch (rule.type) {
      case "complete_all_lessons": {
        const lessons = ContentRetrievalService.getLessonsForModule(contextEntityId);
        if (lessons.length === 0) {
          return { ruleId: rule.id, passed: true, message: "No lessons required." };
        }
        const userProgress = ProgressService.getProgress(userId, undefined, "lesson");
        const completedLessonIds = new Set(
          userProgress
            .filter((p) => p.status === "completed" || p.status === "verified")
            .map((p) => p.entityId)
        );
        const allDone = lessons.every((l) => completedLessonIds.has(l.id));
        return {
          ruleId: rule.id,
          passed: allDone,
          message: allDone
            ? "All lessons completed successfully."
            : `${completedLessonIds.size}/${lessons.length} lessons completed.`,
        };
      }

      case "pass_all_quizzes": {
        const requiredAssessmentIds = rule.requiredAssessmentIds || [];
        const userProgress = ProgressService.getProgress(userId);
        const passedAssessments = new Set(
          userProgress
            .filter((p) => (p.scorePercentage || 0) >= 80)
            .map((p) => p.entityId)
        );
        const allPassed = requiredAssessmentIds.every((id) => passedAssessments.has(id));
        return {
          ruleId: rule.id,
          passed: allPassed,
          message: allPassed
            ? "All required quizzes passed."
            : "Some required quizzes are not yet passed.",
        };
      }

      case "min_watch_pct": {
        const targetPct = rule.minWatchPercentage || 80;
        const progress = ProgressService.getEntityProgress(userId, contextEntityId);
        const watchPct = progress?.watchPercentage || 0;
        const passed = watchPct >= targetPct;
        return {
          ruleId: rule.id,
          passed,
          message: passed
            ? `Watch percentage goal met (${watchPct}%).`
            : `Watch percentage ${watchPct}% is below required ${targetPct}%.`,
        };
      }

      case "mentor_approval": {
        const progress = ProgressService.getEntityProgress(userId, contextEntityId);
        const isVerified = progress?.status === "verified";
        return {
          ruleId: rule.id,
          passed: isVerified,
          message: isVerified
            ? "Mentor approval verified."
            : "Awaiting mentor review and approval.",
        };
      }

      default:
        return {
          ruleId: rule.id,
          passed: true,
          message: "Rule condition satisfied.",
        };
    }
  }

  /**
   * Evaluate all completion rules for a module
   */
  static evaluateModuleCompletion(
    module: Module,
    userId: string
  ): { isCompleted: boolean; results: RuleEvaluationResult[] } {
    if (!module.completionRules || module.completionRules.length === 0) {
      return { isCompleted: true, results: [] };
    }
    const results = module.completionRules.map((rule) =>
      this.evaluateRule(rule, userId, module.id)
    );
    const isCompleted = results.every((r) => r.passed);
    return { isCompleted, results };
  }

  /**
   * Evaluate all completion rules for a course
   */
  static evaluateCourseCompletion(
    course: Course,
    userId: string
  ): { isCompleted: boolean; results: RuleEvaluationResult[] } {
    if (!course.completionRules || course.completionRules.length === 0) {
      return { isCompleted: true, results: [] };
    }
    const results = course.completionRules.map((rule) =>
      this.evaluateRule(rule, userId, course.id)
    );
    const isCompleted = results.every((r) => r.passed);
    return { isCompleted, results };
  }
}
