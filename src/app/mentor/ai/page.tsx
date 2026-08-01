"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { MentorAIAssistant } from "@/components/mentor-dashboard/MentorAIAssistant";

export default function MentorAIPage() {
  return (
    <MentorLayout>
      <MentorAIAssistant />
    </MentorLayout>
  );
}
