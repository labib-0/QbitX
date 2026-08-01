"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { OrganizationManagerWidget } from "@/components/admin-dashboard/OrganizationManagerWidget";

export default function AdminOrganizationsPage() {
  return (
    <AdminLayout>
      <OrganizationManagerWidget />
    </AdminLayout>
  );
}
