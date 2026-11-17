import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { users, notifications, auditLogs } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { internalErrorResponse, badRequestResponse } from "@/server/http/api-error";

const broadcastSchema = z.object({
  title: z.string().optional().default("System Announcement"),
  message: z.string().min(3, "Message must be at least 3 characters").max(1000),
  audience: z.enum(["all", "students", "mentors"]).default("all"),
  type: z.enum(["info", "success", "warning", "alert"]).default("info"),
});

export async function POST(request: NextRequest) {
  try {
    const adminContext = await requireAdmin();
    const body = await request.json();
    const validated = broadcastSchema.parse(body);

    const db = getDb();

    // 1. Fetch recipient users based on audience
    let targetUsers: { id: string }[] = [];
    if (validated.audience === "students") {
      targetUsers = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "student"));
    } else if (validated.audience === "mentors") {
      targetUsers = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "mentor"));
    } else {
      targetUsers = await db
        .select({ id: users.id })
        .from(users);
    }

    if (targetUsers.length > 0) {
      const now = new Date();
      const notificationRows = targetUsers.map((u) => ({
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        userId: u.id,
        title: validated.title,
        message: validated.message,
        type: validated.type,
        linkUrl: "/student/dashboard",
        isRead: false,
        createdAt: now,
      }));

      await db.insert(notifications).values(notificationRows);
    }

    // 2. Audit log entry
    await db.insert(auditLogs).values({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: adminContext.user.id,
      action: "BROADCAST_SENT",
      details: `Dispatched broadcast to ${validated.audience} (${targetUsers.length} users): "${validated.message.slice(0, 50)}..."`,
      ipAddress: request.headers.get("x-forwarded-for") || "internal",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      recipientsCount: targetUsers.length,
      message: `Announcement successfully dispatched to ${targetUsers.length} user(s).`,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message }, { status: 400 });
    }
    return internalErrorResponse(error, "/api/admin/broadcasts");
  }
}
