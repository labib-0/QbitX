"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { MentorApprovalWidget } from "@/components/admin-dashboard/MentorApprovalWidget";

export default function AdminMentorsPage() {
  return (
    <AdminLayout>
      <MentorApprovalWidget />
    </AdminLayout>
  );
}
