import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, sql, desc } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    // 1. Total Students
    const studentCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.users)
      .where(eq(schema.users.role, "student"));

    // 2. Total Mentors
    const mentorCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.users)
      .where(eq(schema.users.role, "mentor"));

    // 3. Total Courses
    const courseCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.courses);

    // 4. Total Enrollments
    const enrollmentCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.enrollments);

    // 5. Total Project Submissions
    const submissionCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.projectSubmissions);

    // 6. Pending Project Reviews
    const pendingReviews = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.projectSubmissions)
      .where(eq(schema.projectSubmissions.status, "pending_review"));

    // 7. Recent Audit Logs
    const recentLogs = await db
      .select()
      .from(schema.auditLogs)
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(8);

    const safeRecentLogs = recentLogs.map((log: any) => {
      let detailsStr = "";
      if (typeof log.details === "string") {
        detailsStr = log.details;
      } else if (log.details && typeof log.details === "object") {
        if ("score" in log.details && "studentName" in log.details) {
          detailsStr = `Graded capstone for ${log.details.studentName} with score ${log.details.score}/100.`;
        } else if ("location" in log.details) {
          detailsStr = `Location: ${log.details.location}`;
        } else if ("domain" in log.details) {
          detailsStr = `Domain: ${log.details.domain} (${log.details.status || "active"})`;
        } else if ("message" in log.details) {
          detailsStr = String(log.details.message);
        } else {
          try {
            detailsStr = JSON.stringify(log.details);
          } catch {
            detailsStr = log.action || "Platform event recorded";
          }
        }
      } else {
        detailsStr = log.action || "Platform event recorded";
      }

      return {
        ...log,
        details: detailsStr,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalStudents: Number(studentCount[0]?.count || 0),
        totalMentors: Number(mentorCount[0]?.count || 0),
        totalCourses: Number(courseCount[0]?.count || 0),
        totalEnrollments: Number(enrollmentCount[0]?.count || 0),
        totalSubmissions: Number(submissionCount[0]?.count || 0),
        pendingReviews: Number(pendingReviews[0]?.count || 0),
        recentActivity: safeRecentLogs,
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return internalErrorResponse(error, "/api/admin/stats");
  }
}
