/**
 * src/services/mentor/AuditLogService.ts
 * Audit logging system storing structured activity logs for future Admin Dashboard oversight
 */

import { AuditLogEntry } from "@/types/success";

let auditLogStore: AuditLogEntry[] = [
  {
    id: "log-1",
    actorId: "usr-mentor-1",
    actorName: "Labib Senior Mentor",
    actorRole: "mentor",
    actionType: "ASSIGNMENT_GRADED",
    targetId: "sub-1",
    targetType: "assignment",
    details: "Graded 'RAG Pipeline Capstone' for Alex Rivera with score 95/100.",
    timestamp: "2026-07-31T14:30:00Z",
  },
  {
    id: "log-2",
    actorId: "usr-mentor-1",
    actorName: "Labib Senior Mentor",
    actorRole: "mentor",
    actionType: "STUDENT_INTERVENTION_CREATED",
    targetId: "usr-student-3",
    targetType: "student",
    details: "Dispatched 1-on-1 PASS Study Session invitation to Michael Chen.",
    timestamp: "2026-07-31T16:00:00Z",
  },
];

export class AuditLogService {
  static getLogs(): AuditLogEntry[] {
    return auditLogStore;
  }

  static logAction(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    auditLogStore.unshift(newLog);
    return newLog;
  }
}
