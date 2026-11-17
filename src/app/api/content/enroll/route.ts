import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

const enrollSchema = z.object({
  courseId: z.string().min(1, "courseId is required"),
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = await request.json();
    const { courseId } = enrollSchema.parse(body);

    // 1. Check Course Existence
    const courses = await db.select().from(schema.courses).where(eq(schema.courses.id, courseId));
    const course = courses[0];
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    if (!course.isPublished && user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, error: "Cannot enroll in an unpublished course." },
        { status: 403 }
      );
    }

    // 2. Check Existing Enrollment
    const existing = await db
      .select()
      .from(schema.enrollments)
      .where(
        and(
          eq(schema.enrollments.userId, user.id),
          eq(schema.enrollments.courseId, courseId)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: "You are already enrolled in this course.",
        data: existing[0],
      });
    }

    // 3. Create Enrollment in Database
    const enrollmentId = `enr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const [newEnrollment] = await db
      .insert(schema.enrollments)
      .values({
        id: enrollmentId,
        userId: user.id,
        courseId,
        status: "active",
        progressPercent: 0,
      })
      .returning();

    // 4. Create In-App Notification
    await db.insert(schema.notifications).values({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: "Course Enrollment Confirmed! 🎉",
      message: `You have successfully enrolled in "${course.title}". Start your learning journey today!`,
      type: "success",
      linkUrl: `/student/workspace?courseId=${course.id}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully enrolled in ${course.title}`,
        data: newEnrollment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload", details: error.errors },
        { status: 400 }
      );
    }
    return internalErrorResponse(error, "/api/content/enroll");
  }
}
