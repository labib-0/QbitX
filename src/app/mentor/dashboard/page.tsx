"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { MentorOverviewWidget } from "@/components/mentor-dashboard/MentorOverviewWidget";

export default function MentorDashboardPage() {
  return (
    <MentorLayout>
      <MentorOverviewWidget />
    </MentorLayout>
  );
}
