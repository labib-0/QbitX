"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { MentorMessagingCenter } from "@/components/mentor-dashboard/success/MentorMessagingCenter";

export default function MentorAnnouncementsPage() {
  return (
    <MentorLayout>
      <MentorMessagingCenter />
    </MentorLayout>
  );
}
