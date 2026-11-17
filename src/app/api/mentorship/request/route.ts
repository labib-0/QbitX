import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and, desc } from "drizzle-orm";
import { z } from "zod";

const createRequestSchema = z.object({
  mentorId: z.string().min(1, "Mentor ID is required"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(120),
  description: z.string().min(10, "Please describe what you would like guidance on (min 10 characters)").max(2000),
  scheduledAt: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const context = await requireUser();
    const userId = context.user.id;
    const isMentorOrAdmin =
      context.user.role === "mentor" ||
      context.user.role === "admin" ||
      context.user.role === "super_admin";

    // If mentor, show requests where user is mentorId; if student, where user is studentId
    const requests = await db
      .select({
        id: schema.mentorshipRequests.id,
        studentId: schema.mentorshipRequests.studentId,
        mentorId: schema.mentorshipRequests.mentorId,
        subject: schema.mentorshipRequests.subject,
        description: schema.mentorshipRequests.description,
        status: schema.mentorshipRequests.status,
        scheduledAt: schema.mentorshipRequests.scheduledAt,
        meetingUrl: schema.mentorshipRequests.meetingUrl,
        mentorNotes: schema.mentorshipRequests.mentorNotes,
        studentFeedback: schema.mentorshipRequests.studentFeedback,
        rating: schema.mentorshipRequests.rating,
        createdAt: schema.mentorshipRequests.createdAt,
      })
      .from(schema.mentorshipRequests)
      .where(
        isMentorOrAdmin
          ? or(
              eq(schema.mentorshipRequests.mentorId, userId),
              eq(schema.mentorshipRequests.studentId, userId)
            )
          : eq(schema.mentorshipRequests.studentId, userId)
      )
      .orderBy(desc(schema.mentorshipRequests.createdAt));

    // Enrich with participant names
    const enriched = [];
    for (const req of requests) {
      const student = await db
        .select({ name: schema.users.name, email: schema.users.email, image: schema.users.image })
        .from(schema.users)
        .where(eq(schema.users.id, req.studentId));

      const mentor = await db
        .select({ name: schema.users.name, email: schema.users.email, image: schema.users.image })
        .from(schema.users)
        .where(eq(schema.users.id, req.mentorId));

      enriched.push({
        ...req,
        student: student[0] || { name: "Student" },
        mentor: mentor[0] || { name: "Mentor" },
      });
    }

    return NextResponse.json({
      success: true,
      data: enriched,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch mentorship requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireUser();
    const body = await request.json();
    const validated = createRequestSchema.parse(body);

    // Verify mentor exists
    const mentorUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, validated.mentorId));

    if (mentorUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "Target mentor not found" },
        { status: 404 }
      );
    }

    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const [newRequest] = await db
      .insert(schema.mentorshipRequests)
      .values({
        id: requestId,
        studentId: context.user.id,
        mentorId: validated.mentorId,
        subject: validated.subject,
        description: validated.description,
        status: "pending",
        scheduledAt: validated.scheduledAt ? new Date(validated.scheduledAt) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Create notification for the mentor
    await db.insert(schema.notifications).values({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: validated.mentorId,
      title: "New Mentorship Request",
      message: `${context.user.name} submitted a mentorship request: "${validated.subject}"`,
      type: "mentorship",
      link: "/mentor/mentorship",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mentorship request submitted successfully",
        data: newRequest,
      },
      { status: 201 }
    );
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
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create mentorship request" },
      { status: 500 }
    );
  }
}
