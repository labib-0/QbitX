/**
 * src/services/content/ContentAuthoringService.ts
 * Manages course creation, duplication, module reordering, draft saving, and lesson insertion
 */

import { Course, Module, Lesson, ContentMetadata, PublicationStatus } from "@/types/content";
import { MOCK_COURSES, MOCK_MODULES, MOCK_LESSONS } from "@/lib/contentData";

export class ContentAuthoringService {
  /**
   * Create a new course draft
   */
  static createCourse(title: string, category: string, createdBy: string): Course {
    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      metadata: {
        id: `crs-${Date.now()}`,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title,
        description: "Draft course created in QbitX Course Builder Studio.",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
        tags: ["draft", category.toLowerCase()],
        category,
        difficulty: "beginner",
        estimatedDurationMinutes: 120,
        language: "en",
        visibility: "mentor_only",
        status: "draft",
        version: "1.0.0",
        createdBy,
        updatedBy: createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
      },
      aiMetadata: {
        learningObjectives: ["Master fundamentals of " + title],
        skillsTaught: [category, "Problem Solving"],
        prerequisites: [],
        keywords: [title.toLowerCase(), category.toLowerCase()],
        difficultyScore: 25,
        bloomsTaxonomyLevel: "understand",
        estimatedLearningMinutes: 120,
        relatedLessonIds: [],
        suggestedNextLessonIds: [],
      },
      permissions: {
        ownerId: createdBy,
        editorIds: [createdBy],
        reviewerIds: ["usr-admin-1"],
        mentorAccess: true,
        studentAccess: false,
        adminAccess: true,
      },
      moduleIds: [],
      completionRules: [],
    };

    MOCK_COURSES.unshift(newCourse);
    return newCourse;
  }

  /**
   * Add a new module to a course
   */
  static addModule(courseId: string, title: string): Module {
    const course = MOCK_COURSES.find((c) => c.id === courseId);
    const existingMods = MOCK_MODULES.filter((m) => m.courseId === courseId);

    const newModule: Module = {
      id: `mod-${Date.now()}`,
      courseId,
      orderIndex: existingMods.length + 1,
      metadata: {
        id: `mod-${Date.now()}`,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title,
        description: "Module syllabus description.",
        tags: ["module"],
        category: course?.metadata.category || "General",
        difficulty: "beginner",
        estimatedDurationMinutes: 60,
        language: "en",
        visibility: "public",
        status: "published",
        version: "1.0.0",
        createdBy: "usr-mentor-1",
        updatedBy: "usr-mentor-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
      },
      lessonIds: [],
      completionRules: [],
    };

    MOCK_MODULES.push(newModule);
    if (course) {
      course.moduleIds.push(newModule.id);
    }
    return newModule;
  }

  /**
   * Reorder modules inside a course
   */
  static reorderModules(courseId: string, moduleIdsInOrder: string[]): boolean {
    const course = MOCK_COURSES.find((c) => c.id === courseId);
    if (course) {
      course.moduleIds = moduleIdsInOrder;
      moduleIdsInOrder.forEach((id, index) => {
        const mod = MOCK_MODULES.find((m) => m.id === id);
        if (mod) mod.orderIndex = index + 1;
      });
      return true;
    }
    return false;
  }
}
