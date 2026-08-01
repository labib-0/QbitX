"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { SystemHealthWidget } from "@/components/admin-dashboard/SystemHealthWidget";

export default function AdminSystemHealthPage() {
  return (
    <AdminLayout>
      <SystemHealthWidget />
    </AdminLayout>
  );
}
