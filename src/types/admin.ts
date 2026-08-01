/**
 * src/types/admin.ts
 * Admin Dashboard & Platform Management Models
 */

export type PlatformRole = "super_admin" | "platform_admin" | "academic_admin" | "mentor" | "student";

export interface PlatformUserItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: PlatformRole;
  status: "active" | "suspended" | "pending";
  organization: string;
  joinedAt: string;
  lastLogin: string;
}

export interface MentorApplication {
  id: string;
  applicantName: string;
  email: string;
  avatar?: string;
  expertise: string[];
  academicDegree: string;
  university: string;
  appliedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewerNote?: string;
}

export interface OrganizationItem {
  id: string;
  name: string;
  type: "university" | "college" | "bootcamp" | "company";
  studentsCount: number;
  mentorsCount: number;
  coursesCount: number;
  status: "active" | "trial" | "suspended";
  domain: string;
}

export interface ModerationItem {
  id: string;
  contentType: "discussion" | "announcement" | "resource" | "comment";
  authorName: string;
  contentSnippet: string;
  flaggedReason: string;
  reportedAt: string;
  status: "pending" | "approved" | "hidden" | "warned";
}

export interface SystemHealthStatus {
  apiStatus: "operational" | "degraded" | "down";
  apiLatencyMs: number;
  dbStatus: "healthy" | "slow" | "error";
  storageUsedGb: number;
  storageMaxGb: number;
  activeSessionsCount: number;
  errorRatePct: number;
  lastBackupAt: string;
}

export interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
}
