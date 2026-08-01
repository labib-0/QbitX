"use client";

import { use } from "react";
import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { CourseBuilderStudio } from "@/components/mentor-dashboard/builder/CourseBuilderStudio";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function MentorCourseBuilderCanvasPage({ params }: PageProps) {
  const { courseId } = use(params);

  return (
    <MentorLayout>
      <CourseBuilderStudio courseId={courseId} />
    </MentorLayout>
  );
}
