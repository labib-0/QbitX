"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { CourseManagementWidget } from "@/components/mentor-dashboard/CourseManagementWidget";

export default function MentorCoursesPage() {
  return (
    <MentorLayout>
      <CourseManagementWidget />
    </MentorLayout>
  );
}
