"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { TeamSupervisionWidget } from "@/components/mentor-dashboard/success/TeamSupervisionWidget";

export default function MentorProjectsPage() {
  return (
    <MentorLayout>
      <TeamSupervisionWidget />
    </MentorLayout>
  );
}
