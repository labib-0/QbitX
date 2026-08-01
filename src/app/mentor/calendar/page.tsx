"use client";

import { MentorLayout } from "@/components/mentor-dashboard/MentorLayout";
import { CalendarOfficeHoursWidget } from "@/components/mentor-dashboard/success/CalendarOfficeHoursWidget";

export default function MentorCalendarPage() {
  return (
    <MentorLayout>
      <CalendarOfficeHoursWidget />
    </MentorLayout>
  );
}
