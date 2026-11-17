import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

const progressSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required"),
  courseId: z.string().min(1, "courseId is required"),
  isCompleted: z.boolean().default(true),
  watchTimeSeconds: z.number().int().min(0).optional().default(0),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user - strictly bind identity to verified session (Fixes SEC-04 IDOR)
    const { user } = await requireUser();
    const body = await request.json();
    const { lessonId, courseId, isCompleted, watchTimeSeconds } = progressSchema.parse(body);

    // 2. Verify Lesson Exists
    const lessons = await db
      .select()
      .from(schema.lessons)
      .where(and(eq(schema.lessons.id, lessonId), eq(schema.lessons.courseId, courseId)));

    if (lessons.length === 0) {
      return NextResponse.json({ success: false, error: "Lesson not found for this course" }, { status: 404 });
    }

    // 3. Upsert Lesson Progress
    const existingProgress = await db
      .select()
      .from(schema.lessonProgress)
      .where(
        and(
          eq(schema.lessonProgress.userId, user.id),
          eq(schema.lessonProgress.lessonId, lessonId)
        )
      );

    if (existingProgress.length > 0) {
      await db
        .update(schema.lessonProgress)
        .set({
          isCompleted,
          watchTimeSeconds: Math.max(existingProgress[0].watchTimeSeconds || 0, watchTimeSeconds),
          completedAt: isCompleted ? new Date() : null,
        })
        .where(eq(schema.lessonProgress.id, existingProgress[0].id));
    } else {
      await db.insert(schema.lessonProgress).values({
        id: `lp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: user.id,
        lessonId,
        courseId,
        isCompleted,
        watchTimeSeconds,
        completedAt: isCompleted ? new Date() : null,
      });
    }

    // 4. Calculate Overall Course Progress & Update Enrollment
    const allCourseLessons = await db
      .select({ id: schema.lessons.id })
      .from(schema.lessons)
      .where(and(eq(schema.lessons.courseId, courseId), eq(schema.lessons.isPublished, true)));

    const allCompletedForCourse = await db
      .select({ id: schema.lessonProgress.id })
      .from(schema.lessonProgress)
      .where(
        and(
          eq(schema.lessonProgress.userId, user.id),
          eq(schema.lessonProgress.courseId, courseId),
          eq(schema.lessonProgress.isCompleted, true)
        )
      );

    const totalLessons = allCourseLessons.length;
    const completedCount = allCompletedForCourse.length;
    const progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;
    const isCourseFinished = progressPercent === 100;

    // Update enrollment record
    await db
      .update(schema.enrollments)
      .set({
        progressPercent,
        status: isCourseFinished ? "completed" : "active",
        completedAt: isCourseFinished ? new Date() : null,
      })
      .where(
        and(
          eq(schema.enrollments.userId, user.id),
          eq(schema.enrollments.courseId, courseId)
        )
      );

    // If finished course, trigger celebration notification
    if (isCourseFinished) {
      const course = await db.select().from(schema.courses).where(eq(schema.courses.id, courseId));
      const courseTitle = course[0]?.title || "Course";

      await db.insert(schema.notifications).values({
        id: `notif-cert-${Date.now()}`,
        userId: user.id,
        title: "Course Completed! 🏆",
        message: `Outstanding work! You have completed 100% of "${courseTitle}".`,
        type: "success",
        linkUrl: `/student/dashboard`,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        lessonId,
        courseId,
        isCompleted,
        completedLessonsCount: completedCount,
        totalLessonsCount: totalLessons,
        courseProgressPercent: progressPercent,
        isCourseCompleted: isCourseFinished,
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return internalErrorResponse(error, "/api/content/progress");
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireUser();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    const conditions = [eq(schema.lessonProgress.userId, user.id)];
    if (courseId) {
      conditions.push(eq(schema.lessonProgress.courseId, courseId));
    }

    const records = await db
      .select()
      .from(schema.lessonProgress)
      .where(and(...conditions));

    return NextResponse.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return internalErrorResponse(error, "/api/content/progress");
  }
}
