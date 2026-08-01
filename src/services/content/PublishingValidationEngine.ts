/**
 * src/services/content/PublishingValidationEngine.ts
 * Automated pre-publish validation checklist engine
 */

import { Course, Module, Lesson } from "@/types/content";
import { PublishingValidationResult, PublishingChecklistIssue } from "@/types/builder";
import { ContentRetrievalService } from "./ContentRetrievalService";

export class PublishingValidationEngine {
  /**
   * Validate a course before publishing to live students
   */
  static validateCourse(course: Course): PublishingValidationResult {
    const issues: PublishingChecklistIssue[] = [];

    // 1. Validate Thumbnail & Cover Image
    if (!course.metadata.thumbnail) {
      issues.push({
        id: "err-thumb",
        severity: "warning",
        message: "Course is missing a promotional thumbnail image.",
        component: "course",
        entityId: course.id,
        fixActionHint: "Upload a thumbnail image in Course Settings.",
      });
    }

    // 2. Validate Modules
    const modules = ContentRetrievalService.getModulesForCourse(course.id, "mentor");
    if (modules.length === 0) {
      issues.push({
        id: "err-no-modules",
        severity: "error",
        message: "Course contains 0 modules. Add at least one module before publishing.",
        component: "course",
        entityId: course.id,
        fixActionHint: "Click 'Add Module' in the Course Studio.",
      });
    }

    // 3. Validate Lessons inside Modules
    modules.forEach((mod) => {
      const lessons = ContentRetrievalService.getLessonsForModule(mod.id, "mentor");
      if (lessons.length === 0) {
        issues.push({
          id: `err-empty-mod-${mod.id}`,
          severity: "error",
          message: `Module "${mod.metadata.title}" contains no lessons.`,
          component: "module",
          entityId: mod.id,
          fixActionHint: "Add lessons or remove empty module.",
        });
      }

      lessons.forEach((les) => {
        if (!les.activityIds || les.activityIds.length === 0) {
          issues.push({
            id: `warn-empty-les-${les.id}`,
            severity: "warning",
            message: `Lesson "${les.metadata.title}" has no attached video, reading, or quiz activity.`,
            component: "lesson",
            entityId: les.id,
            fixActionHint: "Open Lesson Builder and add learning activity.",
          });
        }
      });
    });

    // 4. Validate Learning Objectives
    if (!course.aiMetadata?.learningObjectives || course.aiMetadata.learningObjectives.length === 0) {
      issues.push({
        id: "warn-objectives",
        severity: "warning",
        message: "Course has no defined learning objectives for AI recommendation.",
        component: "course",
        entityId: course.id,
        fixActionHint: "Use AI Authoring Assistant to generate learning objectives.",
      });
    }

    const errorsCount = issues.filter((i) => i.severity === "error").length;
    const warningsCount = issues.filter((i) => i.severity === "warning").length;

    return {
      isValid: errorsCount === 0 && warningsCount === 0,
      canPublish: errorsCount === 0,
      errorsCount,
      warningsCount,
      issues,
    };
  }
}
