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
    name: "Dr. Tariqul Islam",
    email: "mentor@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    role: "mentor",
    status: "active",
    organization: "Bangladesh University of Engineering and Technology (BUET)",
    joinedAt: "2025-10-15",
    lastLogin: "10 mins ago",
  },
  {
    id: "usr-mentor-2",
    name: "Eng. Mahbubur Rahman",
    email: "mahbubur.rahman@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    role: "mentor",
    status: "active",
    organization: "Brain Station 23 / BUET CSE Alum",
    joinedAt: "2025-11-01",
    lastLogin: "1 hour ago",
  },
  {
    id: "usr-student-demo",
    name: "Tanvir Ahmed",
    email: "student@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    role: "student",
    status: "active",
    organization: "BUET (CSE 2nd Year)",
    joinedAt: "2026-01-05",
    lastLogin: "25 mins ago",
  },
  {
    id: "usr-student-2",
    name: "Anika Tabassum",
    email: "anika.tabassum@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    role: "student",
    status: "active",
    organization: "North South University (NSU)",
    joinedAt: "2026-01-12",
    lastLogin: "2 hours ago",
  },
  {
    id: "usr-student-3",
    name: "Nafis Fuad",
    email: "nafis.fuad@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    role: "student",
    status: "active",
    organization: "BRAC University",
    joinedAt: "2026-01-18",
    lastLogin: "Yesterday",
  },
];

export const MOCK_MENTOR_APPLICATIONS: MentorApplication[] = [
  {
    id: "app-1",
    applicantName: "Dr. Shamsul Arefin",
    email: "s.arefin@cuet.ac.bd",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    expertise: ["Bengali NLP", "Machine Learning", "Distributed Systems"],
    academicDegree: "Ph.D. Computer Science & Engineering",
    university: "Chittagong University of Engineering and Technology (CUET)",
    appliedAt: "2026-07-28",
    status: "pending",
  },
  {
    id: "app-2",
    applicantName: "Eng. Kazi Moinul Islam",
    email: "kazi.moinul@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    expertise: ["Cloud Infrastructure", "Kubernetes", "FinTech Security"],
    academicDegree: "B.Sc. in CSE (BUET), ex-TigerIT Principal Architect",
    university: "BUET",
    appliedAt: "2026-07-30",
    status: "pending",
  },
];

export const MOCK_ORGANIZATIONS: OrganizationItem[] = [
  {
    id: "org-1",
    name: "Bangladesh University of Engineering and Technology (BUET)",
    type: "university",
    studentsCount: 840,
    mentorsCount: 18,
    coursesCount: 5,
    status: "active",
    domain: "buet.ac.bd",
  },
  {
    id: "org-2",
    name: "University of Dhaka (DU)",
    type: "university",
    studentsCount: 650,
    mentorsCount: 14,
    coursesCount: 4,
    status: "active",
    domain: "du.ac.bd",
  },
  {
    id: "org-3",
    name: "BRAC University",
    type: "university",
    studentsCount: 720,
    mentorsCount: 12,
    coursesCount: 4,
    status: "active",
    domain: "bracu.ac.bd",
  },
  {
    id: "org-4",
    name: "North South University (NSU)",
    type: "university",
    studentsCount: 590,
    mentorsCount: 10,
    coursesCount: 3,
    status: "active",
    domain: "northsouth.edu",
  },
  {
    id: "org-5",
    name: "Islamic University of Technology (IUT)",
    type: "university",
    studentsCount: 480,
    mentorsCount: 8,
    coursesCount: 3,
    status: "active",
    domain: "iut-dhaka.edu",
  },
];

export const MOCK_FEATURE_FLAGS: FeatureFlagItem[] = [
  { id: "flag-1", key: "ai_mentor", name: "AI Mentor Engine 24/7", description: "Enable AI Assistant for students & mentors", isEnabled: true },
  { id: "flag-2", key: "team_kanban", name: "Team Capstone Kanban", description: "Enable team sprint progress tracking", isEnabled: true },
  { id: "flag-3", key: "cert_auto_issue", name: "Certificate Auto-Issuance", description: "Automatically issue certificates on 100% progress", isEnabled: false },
  { id: "flag-4", key: "maintenance_mode", name: "Platform Maintenance Mode", description: "Restrict non-admin access for system upgrades", isEnabled: false },
];

const userStore: PlatformUserItem[] = [...MOCK_ADMIN_USERS];
const appStore: MentorApplication[] = [...MOCK_MENTOR_APPLICATIONS];

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
