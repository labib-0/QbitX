/**
 * src/types/automation.ts
 * Automation Engine & Workflow System Models
 */

export type EventType =
  | "USER_REGISTERED"
  | "STUDENT_ENROLLED"
  | "LESSON_STARTED"
  | "LESSON_COMPLETED"
  | "MODULE_COMPLETED"
  | "COURSE_COMPLETED"
  | "QUIZ_SUBMITTED"
  | "ASSIGNMENT_SUBMITTED"
  | "ASSIGNMENT_GRADED"
  | "PROJECT_APPROVED"
  | "CERTIFICATE_ISSUED"
  | "TEAM_CREATED"
  | "TEAM_UPDATED"
  | "MENTOR_ASSIGNED"
  | "ANNOUNCEMENT_PUBLISHED"
  | "BADGE_EARNED"
  | "XP_UPDATED"
  | "LOGIN"
  | "LOGOUT";

export interface EventPayload {
  eventId: string;
  eventType: EventType;
  actorId: string;
  actorRole: "student" | "mentor" | "admin" | "super_admin";
  targetId?: string;
  targetType?: "course" | "module" | "lesson" | "assignment" | "certificate" | "team" | "user";
  timestamp: string;
  data?: Record<string, any>;
}

export interface WorkflowCondition {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
  value: any;
}

export interface WorkflowAction {
  type:
    | "issue_certificate"
    | "award_xp"
    | "unlock_badge"
    | "send_notification"
    | "flag_at_risk"
    | "lock_assignment"
    | "log_audit"
    | "invoke_ai_hook";
  params: Record<string, any>;
}

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: EventType;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isEnabled: boolean;
  createdAt: string;
}

export interface JobScheduleSpec {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  lastRunAt?: string;
  nextRunAt?: string;
  status: "idle" | "running" | "failed" | "success";
}

export interface AutomationAuditLog {
  id: string;
  ruleId?: string;
  eventType: EventType;
  executionTimeMs: number;
  status: "success" | "failed" | "retried";
  retryCount: number;
  affectedEntityId?: string;
  details: string;
  timestamp: string;
}
