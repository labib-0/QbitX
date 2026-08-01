/**
 * src/services/automation/AutomationAuditService.ts
 * Structured audit logging for background automation tasks, rules, and job executions
 */

import { AutomationAuditLog } from "@/types/automation";

let auditLogsStore: AutomationAuditLog[] = [
  {
    id: "auto-log-1",
    ruleId: "rule-course-complete",
    eventType: "COURSE_COMPLETED",
    executionTimeMs: 42,
    status: "success",
    retryCount: 0,
    affectedEntityId: "crs-1",
    details: "Executed course completion pipeline: Issued Certificate, Awarded 500 XP, Unlocked Badge.",
    timestamp: "2026-08-01T10:00:00Z",
  },
];

export class AutomationAuditService {
  static getLogs(): AutomationAuditLog[] {
    return auditLogsStore;
  }

  static log(entry: Omit<AutomationAuditLog, "id" | "timestamp">): AutomationAuditLog {
    const newLog: AutomationAuditLog = {
      ...entry,
      id: `auto-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    auditLogsStore.unshift(newLog);
    return newLog;
  }
}
