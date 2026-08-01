/**
 * src/services/admin/AdminDataService.ts
 * Platform administrative data service for Users, Mentor Applications, Organizations, Moderation, and Health
 */

import {
  PlatformUserItem,
  MentorApplication,
  OrganizationItem,
  ModerationItem,
  SystemHealthStatus,
  FeatureFlagItem,
} from "@/types/admin";
import { AuditLogService } from "@/services/mentor/AuditLogService";

export const MOCK_ADMIN_USERS: PlatformUserItem[] = [
  {
    id: "usr-admin-1",
    name: "System Super Admin",
    email: "admin@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    role: "super_admin",
    status: "active",
    organization: "QbitX HQ",
    joinedAt: "2025-09-01",
    lastLogin: "Just now",
  },
  {
    id: "usr-mentor-1",
    name: "Labib Senior Mentor",
    email: "mentor@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    role: "mentor",
    status: "active",
    organization: "Stanford University",
    joinedAt: "2025-10-15",
    lastLogin: "10 mins ago",
  },
  {
    id: "usr-student-demo",
    name: "Alex Rivera",
    email: "student@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    role: "student",
    status: "active",
    organization: "MIT Tech University",
    joinedAt: "2026-01-05",
    lastLogin: "1 hour ago",
  },
];

export const MOCK_MENTOR_APPLICATIONS: MentorApplication[] = [
  {
    id: "app-1",
    applicantName: "Dr. Robert Vance",
    email: "r.vance@mit.edu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    expertise: ["Distributed Systems", "Go", "Cloud Architecture"],
    academicDegree: "Ph.D. Computer Science (MIT)",
    university: "MIT",
    appliedAt: "2026-07-28",
    status: "pending",
  },
];

export const MOCK_ORGANIZATIONS: OrganizationItem[] = [
  {
    id: "org-1",
    name: "Stanford University",
    type: "university",
    studentsCount: 640,
    mentorsCount: 12,
    coursesCount: 3,
    status: "active",
    domain: "stanford.edu",
  },
  {
    id: "org-2",
    name: "MIT School of Computing",
    type: "university",
    studentsCount: 780,
    mentorsCount: 12,
    coursesCount: 4,
    status: "active",
    domain: "mit.edu",
  },
];

export const MOCK_FEATURE_FLAGS: FeatureFlagItem[] = [
  { id: "flag-1", key: "ai_mentor", name: "AI Mentor Engine 24/7", description: "Enable AI Assistant for students & mentors", isEnabled: true },
  { id: "flag-2", key: "team_kanban", name: "Team Capstone Kanban", description: "Enable team sprint progress tracking", isEnabled: true },
  { id: "flag-3", key: "cert_auto_issue", name: "Certificate Auto-Issuance", description: "Automatically issue certificates on 100% progress", isEnabled: false },
  { id: "flag-4", key: "maintenance_mode", name: "Platform Maintenance Mode", description: "Restrict non-admin access for system upgrades", isEnabled: false },
];

let userStore: PlatformUserItem[] = [...MOCK_ADMIN_USERS];
let appStore: MentorApplication[] = [...MOCK_MENTOR_APPLICATIONS];

export class AdminDataService {
  static getUsers(query?: string): PlatformUserItem[] {
    if (!query) return userStore;
    const q = query.toLowerCase();
    return userStore.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q));
  }

  static toggleUserStatus(userId: string): boolean {
    const user = userStore.find((u) => u.id === userId);
    if (user) {
      user.status = user.status === "active" ? "suspended" : "active";

      AuditLogService.logAction({
        actorId: "usr-admin-1",
        actorName: "System Super Admin",
        actorRole: "super_admin",
        actionType: "USER_SUSPENDED",
        targetId: user.id,
        targetType: "student",
        details: `Updated account status for ${user.name} to ${user.status}.`,
      });
      return true;
    }
    return false;
  }

  static getMentorApplications(): MentorApplication[] {
    return appStore;
  }

  static approveMentorApplication(appId: string): boolean {
    const app = appStore.find((a) => a.id === appId);
    if (app) {
      app.status = "approved";

      AuditLogService.logAction({
        actorId: "usr-admin-1",
        actorName: "System Super Admin",
        actorRole: "super_admin",
        actionType: "MENTOR_APPROVED",
        targetId: app.id,
        targetType: "student",
        details: `Approved senior mentor application for ${app.applicantName}.`,
      });
      return true;
    }
    return false;
  }

  static getOrganizations(): OrganizationItem[] {
    return MOCK_ORGANIZATIONS;
  }

  static getFeatureFlags(): FeatureFlagItem[] {
    return MOCK_FEATURE_FLAGS;
  }

  static getSystemHealth(): SystemHealthStatus {
    return {
      apiStatus: "operational",
      apiLatencyMs: 14,
      dbStatus: "healthy",
      storageUsedGb: 42,
      storageMaxGb: 500,
      activeSessionsCount: 840,
      errorRatePct: 0.02,
      lastBackupAt: "2026-08-01T02:00:00Z",
    };
  }
}
