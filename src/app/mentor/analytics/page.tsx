"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { MentorAnalyticsWidget } from "@/components/mentor-dashboard/MentorAnalyticsWidget";

export default function MentorAnalyticsPage() {
  return (
    <MentorLayout>
      <MentorAnalyticsWidget />
    </MentorLayout>
  );
}
