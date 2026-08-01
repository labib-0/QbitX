"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { AssignmentReviewWidget } from "@/components/mentor-dashboard/AssignmentReviewWidget";

export default function MentorAssignmentsPage() {
  return (
    <MentorLayout>
      <AssignmentReviewWidget />
    </MentorLayout>
  );
}
