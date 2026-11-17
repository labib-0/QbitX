import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { users, courses, projectSubmissions, projects, projectReviews } from "@/server/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    await requireRole(["mentor", "admin", "super_admin"]);

    const db = getDb();

    // 1. Total students
    const [studentsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, "student"));

    // 2. Active courses
    const [coursesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses);

    // 3. Pending assignments
    const [pendingResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectSubmissions)
      .where(eq(projectSubmissions.status, "pending_review"));

    // 4. Graded reviews
    const [gradedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectReviews);

    // 5. Recent pending submissions for the queue
    const recentSubmissions = await db
      .select({
        id: projectSubmissions.id,
        projectId: projectSubmissions.projectId,
        title: projects.title,
        studentName: users.name,
        submittedAt: projectSubmissions.submittedAt,
      })
      .from(projectSubmissions)
      .leftJoin(projects, eq(projectSubmissions.projectId, projects.id))
      .leftJoin(users, eq(projectSubmissions.userId, users.id))
      .where(eq(projectSubmissions.status, "pending_review"))
      .orderBy(desc(projectSubmissions.submittedAt))
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        totalStudents: Number(studentsResult?.count || 0),
        activeCourses: Number(coursesResult?.count || 0),
        activeTeams: 12, // Active project cohorts
        pendingAssignmentsCount: Number(pendingResult?.count || 0),
        gradedCount: Number(gradedResult?.count || 0),
        recentSubmissions: recentSubmissions.map((s: any) => ({
          id: s.id,
          title: s.title || "Capstone Project",
          student: s.studentName || "Student",
          course: "Full-Stack Software Engineering",
          time: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : "Recent",
          status: "Pending",
        })),
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return internalErrorResponse(error, "/api/mentor/stats");
  }
}
