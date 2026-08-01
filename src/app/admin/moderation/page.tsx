"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { ModerationWidget } from "@/components/admin-dashboard/ModerationWidget";

export default function AdminModerationPage() {
  return (
    <AdminLayout>
      <ModerationWidget />
    </AdminLayout>
  );
}
