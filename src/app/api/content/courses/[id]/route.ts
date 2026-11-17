import { NextRequest, NextResponse } from "next/server";
import { getServerSession, requireMentor, requireAdmin } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and, asc } from "drizzle-orm";
import { z } from "zod";

const updateCourseSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().min(10).optional(),
  category: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  durationHours: z.number().int().min(1).optional(),
  prerequisites: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionContext = await getServerSession();

    // 1. Fetch Course by ID or Slug
    const courses = await db
      .select()
      .from(schema.courses)
      .where(or(eq(schema.courses.id, id), eq(schema.courses.slug, id)));

    const course = courses[0];
    if (!course) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    // Access control: if not published, must be mentor or admin
    if (!course.isPublished) {
      const isElevated =
        sessionContext &&
        (sessionContext.user.role === "mentor" ||
          sessionContext.user.role === "admin" ||
          sessionContext.user.role === "super_admin");

      if (!isElevated) {
        return NextResponse.json(
          { success: false, error: "Course is in draft status and not yet publicly available." },
          { status: 403 }
        );
      }
    }

    // 2. Fetch Modules & Lessons
    const courseModules = await db
      .select()
      .from(schema.modules)
      .where(eq(schema.modules.courseId, course.id))
      .orderBy(asc(schema.modules.orderIndex));

    const courseLessons = await db
      .select({
        id: schema.lessons.id,
        moduleId: schema.lessons.moduleId,
        courseId: schema.lessons.courseId,
        title: schema.lessons.title,
        description: schema.lessons.description,
        lessonType: schema.lessons.lessonType,
        youtubeVideoId: schema.lessons.youtubeVideoId,
        durationMinutes: schema.lessons.durationMinutes,
        orderIndex: schema.lessons.orderIndex,
        isPublished: schema.lessons.isPublished,
      })
      .from(schema.lessons)
      .where(eq(schema.lessons.courseId, course.id))
      .orderBy(asc(schema.lessons.orderIndex));

    // Nest lessons under modules
    const modulesWithLessons = courseModules.map((mod: any) => ({
      ...mod,
      lessons: courseLessons.filter((l: any) => l.moduleId === mod.id),
    }));

    // 3. Check Enrollment Status for authenticated user
    let isEnrolled = false;
    let enrollmentProgress = 0;
    if (sessionContext?.user) {
      const enrollment = await db
        .select()
        .from(schema.enrollments)
        .where(
          and(
            eq(schema.enrollments.userId, sessionContext.user.id),
            eq(schema.enrollments.courseId, course.id)
          )
        );
      if (enrollment.length > 0) {
        isEnrolled = true;
        enrollmentProgress = enrollment[0].progressPercent;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...course,
        modules: modulesWithLessons,
        totalLessonsCount: courseLessons.length,
        isEnrolled,
        enrollmentProgress,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch course details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireMentor();
    const { id } = await params;
    const body = await request.json();
    const data = updateCourseSchema.parse(body);

    const [updated] = await db
      .update(schema.courses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(or(eq(schema.courses.id, id), eq(schema.courses.slug, id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    // Log audit event
    await db.insert(schema.auditLogs).values({
      id: `log-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      actionType: data.isPublished !== undefined ? "COURSE_STATUS_TOGGLED" : "COURSE_UPDATED",
      targetId: updated.id,
      targetType: "course",
      details: `Updated course '${updated.title}' (Published: ${updated.isPublished})`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update course" },
      { status: 500 }
    );
  }
}
