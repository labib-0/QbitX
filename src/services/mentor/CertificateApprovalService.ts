/**
 * src/services/mentor/CertificateApprovalService.ts
 * Manages certificate eligibility review, manual approval, and revocation
 */

import { CertificateApprovalItem } from "@/types/success";
import { AuditLogService } from "./AuditLogService";

export const MOCK_CERTIFICATE_ITEMS: CertificateApprovalItem[] = [
  {
    id: "cert-req-1",
    studentId: "usr-student-demo",
    studentName: "Alex Rivera",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    courseId: "crs-1",
    courseTitle: "Introduction to Programming Language",
    completionPct: 100,
    averageGradePct: 98,
    completedAt: "2026-07-30",
    status: "eligible",
  },
  {
    id: "cert-req-2",
    studentId: "usr-student-2",
    studentName: "Sarah Jenkins",
    studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    courseId: "crs-2",
    courseTitle: "Full-Stack AI Web Engineering",
    completionPct: 100,
    averageGradePct: 92,
    completedAt: "2026-07-28",
    status: "approved",
    approvedBy: "usr-mentor-1",
    approvedAt: "2026-07-29T10:00:00Z",
  },
];

let certificateStore: CertificateApprovalItem[] = [...MOCK_CERTIFICATE_ITEMS];

export class CertificateApprovalService {
  static getCertificateItems(): CertificateApprovalItem[] {
    return certificateStore;
  }

  static approveCertificate(id: string, mentorName: string): boolean {
    const item = certificateStore.find((c) => c.id === id);
    if (item) {
      item.status = "approved";
      item.approvedBy = mentorName;
      item.approvedAt = new Date().toISOString();

      AuditLogService.logAction({
        actorId: "usr-mentor-1",
        actorName: mentorName,
        actorRole: "mentor",
        actionType: "CERTIFICATE_APPROVED",
        targetId: item.id,
        targetType: "certificate",
        details: `Approved course completion certificate for ${item.studentName} in "${item.courseTitle}".`,
      });
      return true;
    }
    return false;
  }
}
