import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, desc, and } from "drizzle-orm";

export async function GET() {
  try {
    const { user } = await requireUser();

    // 1. Fetch Student Profile
    const profiles = await db
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, user.id));
    const profile = profiles[0] || null;

    // 2. Fetch Active Course Enrollments
    const userEnrollments = await db
      .select({
        enrollmentId: schema.enrollments.id,
        courseId: schema.courses.id,
        courseTitle: schema.courses.title,
        courseSlug: schema.courses.slug,
        category: schema.courses.category,
        difficulty: schema.courses.difficulty,
        thumbnailUrl: schema.courses.thumbnailUrl,
        instructorName: schema.courses.instructorName,
        progressPercent: schema.enrollments.progressPercent,
        status: schema.enrollments.status,
        enrolledAt: schema.enrollments.enrolledAt,
      })
      .from(schema.enrollments)
      .innerJoin(schema.courses, eq(schema.enrollments.courseId, schema.courses.id))
      .where(eq(schema.enrollments.userId, user.id))
      .orderBy(desc(schema.enrollments.enrolledAt));

    // 3. Fetch Completed Lessons Count
    const completedLessons = await db
      .select()
      .from(schema.lessonProgress)
      .where(
        and(
          eq(schema.lessonProgress.userId, user.id),
          eq(schema.lessonProgress.isCompleted, true)
        )
      );

    // 4. Fetch Active Project Enrollments
    const userProjects = await db
      .select({
        enrollmentId: schema.projectEnrollments.id,
        projectId: schema.projects.id,
        projectTitle: schema.projects.title,
        projectSlug: schema.projects.slug,
        difficulty: schema.projects.difficulty,
        status: schema.projectEnrollments.status,
        currentMilestone: schema.projectEnrollments.currentMilestone,
        startedAt: schema.projectEnrollments.startedAt,
      })
      .from(schema.projectEnrollments)
      .innerJoin(schema.projects, eq(schema.projectEnrollments.projectId, schema.projects.id))
      .where(eq(schema.projectEnrollments.userId, user.id))
      .orderBy(desc(schema.projectEnrollments.startedAt));

    // 5. Fetch User Notifications
    const unreadNotifications = await db
      .select()
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.userId, user.id),
          eq(schema.notifications.isRead, false)
        )
      )
      .orderBy(desc(schema.notifications.createdAt))
      .limit(5);

    // 6. Calculate Real Statistics
    const totalEnrolled = userEnrollments.length;
    const completedCoursesCount = userEnrollments.filter((e: any) => e.status === "completed").length;
    const avgProgress = totalEnrolled > 0
      ? Math.round(userEnrollments.reduce((acc: number, curr: any) => acc + (curr.progressPercent || 0), 0) / totalEnrolled)
      : 0;

    const stats = {
      enrolledCoursesCount: totalEnrolled,
      completedCoursesCount,
      completedLessonsCount: completedLessons.length,
      averageProgressPercent: avgProgress,
      activeProjectsCount: userProjects.length,
      level: Math.floor(completedLessons.length / 5) + 1,
      xp: completedLessons.length * 50 + completedCoursesCount * 500,
    };

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
        profile,
        stats,
        activeCourses: userEnrollments,
        recentCourse: userEnrollments[0] || null,
        activeProjects: userProjects,
        unreadNotifications,
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
