// GET /api/student/dashboard
// Returns aggregated dashboard data for the authenticated student

import { NextResponse } from "next/server";
import {
  MOCK_COURSES,
  MOCK_ASSIGNMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_ANNOUNCEMENTS,
  MOCK_STATS,
} from "@/lib/dashboardData";

export async function GET() {
  try {
    const data = {
      stats: MOCK_STATS,
      activeCourses: MOCK_COURSES.filter((c) => c.isActive),
      recentCourse: MOCK_COURSES[0],
      pendingAssignments: MOCK_ASSIGNMENTS.filter((a) => a.status === "pending"),
      unreadNotifications: MOCK_NOTIFICATIONS.filter((n) => !n.read),
      announcements: MOCK_ANNOUNCEMENTS,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load dashboard data" }, { status: 500 });
  }
}
