import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

const updateMentorshipSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "completed", "cancelled"]).optional(),
  meetingUrl: z.string().url().optional().or(z.literal("")),
  mentorNotes: z.string().max(2000).optional(),
  studentFeedback: z.string().max(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireUser();
    const { id } = await params;
    const body = await request.json();
    const validated = updateMentorshipSchema.parse(body);

    // 1. Fetch request
    const existing = await db
      .select()
      .from(schema.mentorshipRequests)
      .where(eq(schema.mentorshipRequests.id, id));

    const reqItem = existing[0];
    if (!reqItem) {
      return NextResponse.json({ success: false, error: "Mentorship request not found" }, { status: 404 });
    }

    const isMentor = context.user.id === reqItem.mentorId;
    const isStudent = context.user.id === reqItem.studentId;
    const isAdmin = context.user.role === "admin" || context.user.role === "super_admin";

    if (!isMentor && !isStudent && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this mentorship request" },
        { status: 403 }
      );
    }

    const updates: Partial<typeof schema.mentorshipRequests.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (validated.status) {
      // Students can only cancel; Mentors/Admins can accept, reject, complete
      if (isStudent && validated.status !== "cancelled" && !isAdmin) {
        return NextResponse.json(
          { success: false, error: "Students can only cancel pending requests" },
          { status: 403 }
        );
      }
      updates.status = validated.status;
    }

    if (validated.meetingUrl !== undefined && (isMentor || isAdmin)) {
      updates.meetingUrl = validated.meetingUrl || null;
    }

    if (validated.mentorNotes !== undefined && (isMentor || isAdmin)) {
      updates.mentorNotes = validated.mentorNotes || null;
    }

    if (validated.studentFeedback !== undefined && (isStudent || isAdmin)) {
      updates.studentFeedback = validated.studentFeedback || null;
    }

    if (validated.rating !== undefined && (isStudent || isAdmin)) {
      updates.rating = validated.rating;

      // Update mentor rating score
      await db
        .update(schema.mentorProfiles)
        .set({
          reviewCount: sql`${schema.mentorProfiles.reviewCount} + 1`,
          rating: String(validated.rating),
        })
        .where(eq(schema.mentorProfiles.userId, reqItem.mentorId));
    }

    const [updated] = await db
      .update(schema.mentorshipRequests)
      .set(updates)
      .where(eq(schema.mentorshipRequests.id, id))
      .returning();

    // Notify appropriate party
    if (isMentor && validated.status) {
      await db.insert(schema.notifications).values({
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: reqItem.studentId,
        title: validated.status === "accepted" ? "Mentorship Session Accepted!" : "Mentorship Request Update",
        message:
          validated.status === "accepted"
            ? `Your mentor accepted your request for "${reqItem.subject}".`
            : `Your mentorship request status changed to: ${validated.status}.`,
        type: "mentorship",
        link: "/student/dashboard",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Mentorship request updated",
      data: updated,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return internalErrorResponse(error, "/api/mentorship/request/[id]");
  }
}
