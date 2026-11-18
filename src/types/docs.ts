export type DocsOverrideMode = "auto" | "force_public" | "force_private";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
  affiliation?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  badge?: string;
}

export interface DocsScheduleConfig {
  enabled?: boolean;
  startDate?: string; // ISO format e.g. 2026-06-10T00:00:00.000Z
  endDate?: string;   // ISO format e.g. 2026-06-14T23:59:59.000Z
  overrideMode: DocsOverrideMode;
  judgingNotice?: string;
}

export interface DocsSettings {
  isPublic: boolean;
  schedule: DocsScheduleConfig;
  teamName: string;
  teamTagline: string;
  customNoticeMessage?: string;
  teamMembers: TeamMember[];
  lastUpdated: string;
}

export interface DocsAccessStatus {
  accessible: boolean;
  isAccessible: boolean;
  isAdmin: boolean;
  reason: string;
  overrideMode: DocsOverrideMode;
  schedule: DocsScheduleConfig;
  judgingNotice?: string;
  customNotice?: string;
  startsAt?: string;
  endsAt?: string;
}

export interface LiveSystemMetrics {
  totalStudents: number;
  totalMentors: number;
  totalCourses: number;
  totalSubmissions: number;
  totalEnrollments: number;
  totalAiConversations: number;
  systemStatus: "Operational" | "Degraded" | "Maintenance";
  databaseLatencyMs: number;
  version: string;
  lastSyncedAt: string;
  status?: string;
  dbLatencyMs?: number;
}

export interface ApiEndpointItem {
  id: string;
  category: "Auth" | "Student" | "Mentor" | "Admin" | "Content" | "AI" | "Workspace" | "System" | string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string;
  path: string;
  title?: string;
  description: string;
  authRequired?: "None" | "Student" | "Mentor" | "Admin" | "Super Admin" | string;
  auth?: string;
  sampleRequest?: Record<string, any>;
  sampleResponse?: Record<string, any>;
  requestBody?: Record<string, any>;
  responseExample?: Record<string, any>;
}
