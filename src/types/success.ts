/**
 * src/types/success.ts
 * Mentor Success Center Models: Audit Logging, Early Intervention, Rubric Grading, Certificates, Office Hours
 */

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: "student" | "mentor" | "admin" | "super_admin" | "platform_admin" | "academic_admin";
  actionType:
    | "ASSIGNMENT_GRADED"
    | "FEEDBACK_SENT"
    | "CERTIFICATE_APPROVED"
    | "CERTIFICATE_REVOKED"
    | "STUDENT_INTERVENTION_CREATED"
    | "OFFICE_HOURS_SCHEDULED"
    | "COURSE_PUBLISHED"
    | "USER_SUSPENDED"
    | "MENTOR_APPROVED"
    | "ROLE_CHANGED"
    | "SETTINGS_UPDATED";
  targetId: string;
  targetType: "assignment" | "certificate" | "student" | "office_hour" | "course";
  details: string;
  timestamp: string;
}

export interface AtRiskStudent {
  studentId: string;
  studentName: string;
  email: string;
  avatar: string;
  courseTitle: string;
  riskLevel: "high" | "medium" | "low";
  riskFactors: string[];
  lastActive: string;
  quizAveragePct: number;
  missedAssignmentsCount: number;
  recommendedIntervention: string;
  interventionStatus: "pending" | "dispatched" | "resolved";
}

export interface CertificateApprovalItem {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  courseId: string;
  courseTitle: string;
  completionPct: number;
  averageGradePct: number;
  completedAt: string;
  status: "eligible" | "approved" | "under_review" | "revoked";
  approvedBy?: string;
  approvedAt?: string;
}

export interface OfficeHourSession {
  id: string;
  title: string;
  mentorId: string;
  mentorName: string;
  dateTime: string;
  durationMinutes: number;
  location: string; // e.g. "Lab 304" or "Google Meet"
  maxStudents: number;
  bookedStudentsCount: number;
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
}

export interface RubricCriteriaItem {
  id: string;
  name: string;
  maxPoints: number;
  scoreGiven: number;
  comments: string;
}
