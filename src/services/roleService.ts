/**
 * RoleService — Checks user permissions and role-based access.
 * TODO: Integrate with backend RLS (Row Level Security) & JWT role claims.
 */

export const RoleService = {
  isStudent(role?: string): boolean {
    return role === "student";
  },

  isMentor(role?: string): boolean {
    return role === "mentor";
  },

  isAdmin(role?: string): boolean {
    return role === "admin";
  },

  canAccessMentorDashboard(role?: string, isApproved?: boolean): boolean {
    return role === "mentor" && isApproved === true;
  },

  canAccessStudentDashboard(role?: string): boolean {
    return role === "student";
  },
};
