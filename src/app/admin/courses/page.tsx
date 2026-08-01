"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { CourseOversightWidget } from "@/components/admin-dashboard/CourseOversightWidget";

export default function AdminCoursesPage() {
  return (
    <AdminLayout>
      <CourseOversightWidget />
    </AdminLayout>
  );
}
