/**
 * src/services/content/ContentPermissionService.ts
 * Evaluates visibility, status, and role-based permissions (Student, Mentor, Admin)
 */

import {
  ContentPermissions,
  PublicationStatus,
  Visibility,
  UserRole,
} from "@/types/content";

export class ContentPermissionService {
  /**
   * Determine if a user role can access an entity based on publication status and visibility
   */
  static canUserAccessEntity(
    status: PublicationStatus,
    visibility: Visibility,
    userRole: UserRole
  ): boolean {
    // Admins can see everything
    if (userRole === "admin") return true;

    // Archived items are hidden from students and mentors unless special permission
    if (status === "archived") return false;

    // Students can ONLY see published content
    if (userRole === "student") {
      if (status !== "published") return false;
      if (visibility === "private" || visibility === "mentor_only") return false;
      return true;
    }

    // Mentors can see published, review, and draft content if mentorAccess is enabled
    if (userRole === "mentor") {
      if (visibility === "private") return false;
      return true;
    }

    return false;
  }

  /**
   * Evaluate full granular ContentPermissions matrix for a specific user ID & role
   */
  static canUserEditContent(
    permissions: ContentPermissions,
    userId: string,
    userRole: UserRole
  ): boolean {
    if (userRole === "admin") return true;
    if (permissions.ownerId === userId) return true;
    if (permissions.editorIds.includes(userId)) return true;
    return false;
  }

  static canUserReviewContent(
    permissions: ContentPermissions,
    userId: string,
    userRole: UserRole
  ): boolean {
    if (userRole === "admin") return true;
    if (permissions.reviewerIds.includes(userId)) return true;
    return false;
  }
}
