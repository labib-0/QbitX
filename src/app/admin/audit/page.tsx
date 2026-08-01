"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { AuditLogViewerWidget } from "@/components/admin-dashboard/AuditLogViewerWidget";

export default function AdminAuditLogsPage() {
  return (
    <AdminLayout>
      <AuditLogViewerWidget />
    </AdminLayout>
  );
}
