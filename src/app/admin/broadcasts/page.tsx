"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { GlobalNotificationWidget } from "@/components/admin-dashboard/GlobalNotificationWidget";

export default function AdminBroadcastsPage() {
  return (
    <AdminLayout>
      <GlobalNotificationWidget />
    </AdminLayout>
  );
}
