"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { AssessmentReviewCenter } from "@/components/mentor-dashboard/success/AssessmentReviewCenter";

export default function MentorQuizzesPage() {
  return (
    <MentorLayout>
      <AssessmentReviewCenter />
    </MentorLayout>
  );
}
