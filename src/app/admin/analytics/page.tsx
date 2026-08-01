"use client";

import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import { MentorAnalyticsWidget } from "@/components/mentor-dashboard/MentorAnalyticsWidget";

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <MentorAnalyticsWidget />
    </AdminLayout>
  );
}
