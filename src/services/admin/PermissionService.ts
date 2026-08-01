/**
 * src/services/admin/PermissionService.ts
 * Centralized RBAC permission engine for QbitX platform roles
 */

import { PlatformRole } from "@/types/admin";

export type PermissionAction =
  | "manage_users"
  | "approve_mentors"
  | "publish_courses"
  | "manage_settings"
  | "view_audit_logs"
  | "moderate_content"
  | "manage_organizations"
  | "broadcast_notifications";

export const ROLE_PERMISSIONS_MATRIX: Record<PlatformRole, PermissionAction[]> = {
  super_admin: [
    "manage_users",
    "approve_mentors",
    "publish_courses",
    "manage_settings",
    "view_audit_logs",
    "moderate_content",
    "manage_organizations",
    "broadcast_notifications",
  ],
  platform_admin: [
    "manage_users",
    "approve_mentors",
    "publish_courses",
    "view_audit_logs",
    "moderate_content",
    "broadcast_notifications",
  ],
  academic_admin: ["approve_mentors", "publish_courses", "moderate_content"],
  mentor: ["publish_courses"],
  student: [],
};

export class PermissionService {
  /**
   * Check if a role possesses a specific permission
   */
  static hasPermission(role: string, action: PermissionAction): boolean {
    const validRole = (role as PlatformRole) || "student";
    const allowed = ROLE_PERMISSIONS_MATRIX[validRole] || [];
    return allowed.includes(action);
  }

  /**
   * Check if role can access Admin Portal (/admin/*)
   */
  static canAccessAdminPortal(role?: string): boolean {
    if (!role) return false;
    return role === "admin" || role === "super_admin" || role === "platform_admin" || role === "academic_admin";
  }
}
