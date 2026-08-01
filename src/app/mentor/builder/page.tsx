"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { CourseBuilderStudio } from "@/components/mentor-dashboard/builder/CourseBuilderStudio";

export default function MentorBuilderOverviewPage() {
  return (
    <MentorLayout>
      <CourseBuilderStudio courseId="crs-1" />
    </MentorLayout>
  );
}
