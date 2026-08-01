// GET  /api/student/notifications   → returns all notifications
// POST /api/student/notifications    → mark notification(s) as read

import { NextRequest, NextResponse } from "next/server";
import { MOCK_NOTIFICATIONS, Notification } from "@/lib/dashboardData";

// Simple in-memory mutable store (replace with Supabase DB calls in production)
let notificationsStore: Notification[] = [...MOCK_NOTIFICATIONS];

export async function GET() {
  return NextResponse.json({ success: true, data: notificationsStore });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, markAll } = body as { id?: string; markAll?: boolean };

    if (markAll) {
      notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
    } else if (id) {
      notificationsStore = notificationsStore.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
    }

    return NextResponse.json({
      success: true,
      data: notificationsStore,
      unreadCount: notificationsStore.filter((n) => !n.read).length,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
