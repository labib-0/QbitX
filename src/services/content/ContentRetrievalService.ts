/**
 * src/services/content/ContentRetrievalService.ts
 * Unified service for querying tracks, courses, modules, lessons, activities, and resources with relational assembly
 */

import {
  Track,
  Course,
  Module,
  Lesson,
  Activity,
  LearningResource,
  Assessment,
  UserRole,
} from "@/types/content";
import {
  MOCK_TRACKS,
  MOCK_COURSES,
  MOCK_MODULES,
  MOCK_LESSONS,
  MOCK_ACTIVITIES,
  MOCK_RESOURCES,
  MOCK_ASSESSMENTS,
} from "@/lib/contentData";
import { ContentPermissionService } from "./ContentPermissionService";

export class ContentRetrievalService {
  /**
   * Get all tracks visible to a user role
   */
  static getTracks(userRole: UserRole = "student"): Track[] {
    return MOCK_TRACKS.filter((track) =>
      ContentPermissionService.canUserAccessEntity(track.metadata.status, track.metadata.visibility, userRole)
    );
  }

  /**
   * Get a single track by ID or slug with associated course references
   */
  static getTrackByIdOrSlug(idOrSlug: string, userRole: UserRole = "student"): Track | null {
    const track = MOCK_TRACKS.find(
      (t) => t.id === idOrSlug || t.metadata.slug === idOrSlug
    );
    if (!track) return null;
    if (!ContentPermissionService.canUserAccessEntity(track.metadata.status, track.metadata.visibility, userRole)) {
      return null;
    }
    return track;
  }

  /**
   * Get all courses, optionally filtered by track ID
   */
  static getCourses(trackId?: string, userRole: UserRole = "student"): Course[] {
    return MOCK_COURSES.filter((course) => {
      const matchesTrack = !trackId || course.trackId === trackId;
      const isVisible = ContentPermissionService.canUserAccessEntity(
        course.metadata.status,
        course.metadata.visibility,
        userRole
      );
      return matchesTrack && isVisible;
    });
  }

  /**
   * Get course by ID or slug with full module hierarchy
   */
  static getCourseByIdOrSlug(idOrSlug: string, userRole: UserRole = "student"): Course | null {
    const course = MOCK_COURSES.find(
      (c) => c.id === idOrSlug || c.metadata.slug === idOrSlug
    );
    if (!course) return null;
    if (!ContentPermissionService.canUserAccessEntity(course.metadata.status, course.metadata.visibility, userRole)) {
      return null;
    }
    return course;
  }

  /**
   * Get modules for a course ordered by orderIndex
   */
  static getModulesForCourse(courseId: string, userRole: UserRole = "student"): Module[] {
    const course = this.getCourseByIdOrSlug(courseId, userRole);
    if (!course) return [];

    return MOCK_MODULES.filter((m) => course.moduleIds.includes(m.id)).sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
  }

  /**
   * Get lessons for a module ordered by orderIndex
   */
  static getLessonsForModule(moduleId: string, userRole: UserRole = "student"): Lesson[] {
    const module = MOCK_MODULES.find((m) => m.id === moduleId);
    if (!module) return [];

    return MOCK_LESSONS.filter(
      (l) =>
        module.lessonIds.includes(l.id) &&
        ContentPermissionService.canUserAccessEntity(l.metadata.status, l.metadata.visibility, userRole)
    ).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  /**
   * Get full lesson details including relational activities, resources, and assessments
   */
  static getLessonById(
    lessonId: string,
    userRole: UserRole = "student"
  ): {
    lesson: Lesson;
    activities: Activity[];
    resources: LearningResource[];
    assessments: Assessment[];
  } | null {
    const lesson = MOCK_LESSONS.find((l) => l.id === lessonId);
    if (!lesson) return null;
    if (!ContentPermissionService.canUserAccessEntity(lesson.metadata.status, lesson.metadata.visibility, userRole)) {
      return null;
    }

    const activities = MOCK_ACTIVITIES.filter((a) =>
      lesson.activityIds.includes(a.id)
    ).sort((a, b) => a.orderIndex - b.orderIndex);

    const resources = MOCK_RESOURCES.filter((r) =>
      lesson.resourceIds.includes(r.id)
    );

    const assessments = MOCK_ASSESSMENTS.filter((a) =>
      lesson.assessmentIds.includes(a.id)
    );

    return { lesson, activities, resources, assessments };
  }

  /**
   * Get individual activity by ID
   */
  static getActivityById(activityId: string): Activity | null {
    return MOCK_ACTIVITIES.find((a) => a.id === activityId) || null;
  }

  /**
   * Get individual resource by ID
   */
  static getResourceById(resourceId: string): LearningResource | null {
    return MOCK_RESOURCES.find((r) => r.id === resourceId) || null;
  }
}
