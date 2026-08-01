"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { CertificateApprovalWidget } from "@/components/mentor-dashboard/success/CertificateApprovalWidget";

export default function MentorCertificatesPage() {
  return (
    <MentorLayout>
      <CertificateApprovalWidget />
    </MentorLayout>
  );
}
