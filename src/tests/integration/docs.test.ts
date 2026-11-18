import { describe, it, expect, beforeEach } from "vitest";
import { DocsSettingsService } from "@/services/docs/DocsSettingsService";

describe("Docs Module Access Control & Scheduling Integration Tests", () => {
  beforeEach(() => {
    DocsSettingsService.resetToDefaults();
  });

  it("should initialize with default June 10 - June 14, 2026 scheduling and Bangladeshi team roster", () => {
    const settings = DocsSettingsService.getSettings();

    expect(settings.schedule.startDate).toBe("2026-06-10T00:00:00.000Z");
    expect(settings.schedule.endDate).toBe("2026-06-14T23:59:59.000Z");
    expect(settings.teamMembers.length).toBeGreaterThanOrEqual(4);

    // Bangladeshi team names verified
    const names = settings.teamMembers.map((m) => m.name);
    expect(names).toContain("Labib Ul Hasan");
    expect(names).toContain("Dr. Kamal Hossain");
    expect(names).toContain("Nusrat Jahan");
    expect(names).toContain("Tanvir Ahmed");

    // All members have uniform styling and verified emails
    settings.teamMembers.forEach((member) => {
      expect(member.email).toContain("@");
      expect(member.role).toBeTruthy();
      expect(member.avatarUrl).toBeTruthy();
    });
  });

  describe("Access Evaluation Logic", () => {
    it("should always grant access to administrators regardless of scheduling window", () => {
      // Set to force_private
      DocsSettingsService.updateSettings({
        schedule: {
          startDate: "2026-06-10T00:00:00.000Z",
          endDate: "2026-06-14T23:59:59.000Z",
          overrideMode: "force_private",
        },
      });

      const adminAccess = DocsSettingsService.evaluateAccess("admin");
      expect(adminAccess.accessible).toBe(true);
      expect(adminAccess.isAdmin).toBe(true);

      const superAdminAccess = DocsSettingsService.evaluateAccess("super_admin");
      expect(superAdminAccess.accessible).toBe(true);
      expect(superAdminAccess.isAdmin).toBe(true);
    });

    it("should allow public access when overrideMode is 'force_public'", () => {
      DocsSettingsService.updateSettings({
        schedule: {
          startDate: "2026-06-10T00:00:00.000Z",
          endDate: "2026-06-14T23:59:59.000Z",
          overrideMode: "force_public",
        },
      });

      const visitorAccess = DocsSettingsService.evaluateAccess(null, new Date("2026-01-01"));
      expect(visitorAccess.accessible).toBe(true);
    });

    it("should restrict public access when overrideMode is 'force_private'", () => {
      DocsSettingsService.updateSettings({
        schedule: {
          startDate: "2026-06-10T00:00:00.000Z",
          endDate: "2026-06-14T23:59:59.000Z",
          overrideMode: "force_private",
        },
      });

      const visitorAccess = DocsSettingsService.evaluateAccess(null, new Date("2026-06-11"));
      expect(visitorAccess.accessible).toBe(false);
      expect(visitorAccess.reason).toContain("restricted by platform administrators");
    });

    it("should strictly evaluate scheduled window (June 10 - June 14, 2026) when overrideMode is 'auto'", () => {
      DocsSettingsService.updateSettings({
        schedule: {
          startDate: "2026-06-10T00:00:00.000Z",
          endDate: "2026-06-14T23:59:59.000Z",
          overrideMode: "auto",
        },
      });

      // Before window: June 9
      const beforeWindow = DocsSettingsService.evaluateAccess(null, new Date("2026-06-09T23:59:00.000Z"));
      expect(beforeWindow.accessible).toBe(false);
      expect(beforeWindow.reason).toContain("scheduled to open on June 10, 2026");

      // Within window: June 11
      const insideWindow = DocsSettingsService.evaluateAccess(null, new Date("2026-06-11T12:00:00.000Z"));
      expect(insideWindow.accessible).toBe(true);

      // Within window: June 14, 23:00
      const insideLate = DocsSettingsService.evaluateAccess(null, new Date("2026-06-14T23:00:00.000Z"));
      expect(insideLate.accessible).toBe(true);

      // After window: June 15
      const afterWindow = DocsSettingsService.evaluateAccess(null, new Date("2026-06-15T00:01:00.000Z"));
      expect(afterWindow.accessible).toBe(false);
      expect(afterWindow.reason).toContain("showcase window has concluded");
    });
  });

  describe("Settings Mutation", () => {
    it("should allow admins to update team roster and custom notices", () => {
      DocsSettingsService.updateSettings({
        customNoticeMessage: "Special evaluation period for YC Group 2026.",
        teamMembers: [
          {
            id: "m-1",
            name: "Labib Ul Hasan",
            role: "Lead Full-Stack Architect",
            email: "labib@qbitx.org",
            affiliation: "BUET / QbitX",
          },
        ],
      });

      const updated = DocsSettingsService.getSettings();
      expect(updated.customNoticeMessage).toBe("Special evaluation period for YC Group 2026.");
      expect(updated.teamMembers.length).toBe(1);
      expect(updated.teamMembers[0].name).toBe("Labib Ul Hasan");
    });
  });
});
