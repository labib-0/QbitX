"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { StudentManagementWidget } from "@/components/mentor-dashboard/StudentManagementWidget";

export default function MentorStudentsPage() {
  return (
    <MentorLayout>
      <StudentManagementWidget />
    </MentorLayout>
  );
}
