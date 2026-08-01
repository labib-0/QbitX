"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { UserManagementWidget } from "@/components/admin-dashboard/UserManagementWidget";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UserManagementWidget />
    </AdminLayout>
  );
}
