/**
 * src/services/mentor/InterventionService.ts
 * At-risk student evaluation and early intervention dispatch service
 */

import { AtRiskStudent } from "@/types/success";
import { AuditLogService } from "./AuditLogService";

export const MOCK_AT_RISK_STUDENTS: AtRiskStudent[] = [
  {
    studentId: "usr-student-3",
    studentName: "Michael Chen",
    email: "m.chen@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    courseTitle: "CS Fundamentals With QbitX",
    riskLevel: "high",
    riskFactors: ["4 lessons behind schedule", "Missed 2 lab deadlines", "Quiz average < 70%"],
    lastActive: "3 days ago",
    quizAveragePct: 68,
    missedAssignmentsCount: 2,
    recommendedIntervention: "Dispatch 1-on-1 PASS Tutoring Session & Python Recursion Refresher",
    interventionStatus: "pending",
  },
  {
    studentId: "usr-student-4",
    studentName: "David Miller",
    email: "david.m@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    courseTitle: "Introduction to Programming Language",
    riskLevel: "medium",
    riskFactors: ["Incomplete Module 2 quiz", "No platform login in 48 hours"],
    lastActive: "2 days ago",
    quizAveragePct: 74,
    missedAssignmentsCount: 1,
    recommendedIntervention: "Send automated check-in reminder & assignment grace period extension",
    interventionStatus: "pending",
  },
];

let atRiskStore: AtRiskStudent[] = [...MOCK_AT_RISK_STUDENTS];

export class InterventionService {
  static getAtRiskStudents(): AtRiskStudent[] {
    return atRiskStore;
  }

  static dispatchIntervention(studentId: string, mentorName: string): boolean {
    const student = atRiskStore.find((s) => s.studentId === studentId);
    if (student) {
      student.interventionStatus = "dispatched";

      AuditLogService.logAction({
        actorId: "usr-mentor-1",
        actorName: mentorName,
        actorRole: "mentor",
        actionType: "STUDENT_INTERVENTION_CREATED",
        targetId: student.studentId,
        targetType: "student",
        details: `Dispatched intervention "${student.recommendedIntervention}" to ${student.studentName}.`,
      });
      return true;
    }
    return false;
  }
}
