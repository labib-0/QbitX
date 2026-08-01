"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { PlatformOverviewWidget } from "@/components/admin-dashboard/PlatformOverviewWidget";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <PlatformOverviewWidget />
    </AdminLayout>
  );
}
