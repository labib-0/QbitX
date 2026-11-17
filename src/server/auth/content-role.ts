import type { UserRole } from "@/types/content";
import type { AuthenticatedContext } from "./session";

/**
 * Derive the content-access role from the verified server session.
 *
 * Roles must never be read from request parameters: a client could otherwise
 * send `?role=admin` and read draft or mentor-only content.
 */
export function resolveContentRole(context: AuthenticatedContext | null): UserRole {
  if (!context || context.user.status === "suspended") {
    return "student";
  }

  switch (context.user.role) {
    case "super_admin":
    case "admin":
      return "admin";
    case "mentor":
      return "mentor";
    default:
      return "student";
  }
}
