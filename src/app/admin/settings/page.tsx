"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { SystemSettingsWidget } from "@/components/admin-dashboard/SystemSettingsWidget";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <SystemSettingsWidget />
    </AdminLayout>
  );
}
