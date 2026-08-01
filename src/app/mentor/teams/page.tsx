"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { TeamMonitorWidget } from "@/components/mentor-dashboard/TeamMonitorWidget";

export default function MentorTeamsPage() {
  return (
    <MentorLayout>
      <TeamMonitorWidget />
    </MentorLayout>
  );
}
