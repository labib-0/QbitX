import { describe, it, expect } from "vitest";
import {
  UnauthorizedError,
  ForbiddenError,
  PlatformRole,
} from "@/server/auth/session";

describe("Authorization and Role Permission Layer", () => {
  it("UnauthorizedError has correct name and default message", () => {
    const err = new UnauthorizedError();
    expect(err.name).toBe("UnauthorizedError");
    expect(err.message).toContain("Authentication required");
  });

  it("ForbiddenError has correct name and message", () => {
    const err = new ForbiddenError("Insufficient rights");
    expect(err.name).toBe("ForbiddenError");
    expect(err.message).toBe("Insufficient rights");
  });

  describe("Role Hierarchy & Evaluation Logic", () => {
    function evaluateRoleAccess(userRole: PlatformRole, allowedRoles: PlatformRole[]): boolean {
      if (userRole === "super_admin") return true; // Super admin always passes
      return allowedRoles.includes(userRole);
    }

    it("allows student to access student-allowed resources", () => {
      expect(evaluateRoleAccess("student", ["student", "mentor", "admin"])).toBe(true);
    });

    it("denies student from accessing admin-only resources", () => {
      expect(evaluateRoleAccess("student", ["admin", "super_admin"])).toBe(false);
    });

    it("allows mentor to access mentor resources", () => {
      expect(evaluateRoleAccess("mentor", ["mentor", "admin"])).toBe(true);
    });

    it("denies mentor from accessing super_admin only actions", () => {
      expect(evaluateRoleAccess("mentor", ["super_admin"])).toBe(false);
    });

    it("super_admin passes all role checks regardless of allowedRoles list", () => {
      expect(evaluateRoleAccess("super_admin", ["student"])).toBe(true);
      expect(evaluateRoleAccess("super_admin", ["mentor"])).toBe(true);
      expect(evaluateRoleAccess("super_admin", ["admin"])).toBe(true);
    });
  });

  describe("Ownership Validation Logic", () => {
    function checkOwnership(
      sessionUserId: string,
      sessionUserRole: PlatformRole,
      resourceOwnerId: string
    ): boolean {
      if (sessionUserRole === "admin" || sessionUserRole === "super_admin") {
        return true; // Administrators can oversee resources
      }
      return sessionUserId === resourceOwnerId;
    }

    it("allows resource owner to access their own resource", () => {
      expect(checkOwnership("usr-student-1", "student", "usr-student-1")).toBe(true);
    });

    it("blocks student from accessing another student resource", () => {
      expect(checkOwnership("usr-student-1", "student", "usr-student-2")).toBe(false);
    });

    it("allows admin to access any student resource", () => {
      expect(checkOwnership("usr-admin-1", "admin", "usr-student-2")).toBe(true);
    });
  });
});
