import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { projectSubmissions, projects, users, projectReviews } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    await requireRole(["mentor", "admin", "super_admin"]);

    const db = getDb();
    const rows = await db
      .select({
        id: projectSubmissions.id,
        projectId: projectSubmissions.projectId,
        userId: projectSubmissions.userId,
        githubRepoUrl: projectSubmissions.githubRepoUrl,
        liveDemoUrl: projectSubmissions.liveDemoUrl,
        notes: projectSubmissions.notes,
        status: projectSubmissions.status,
        submittedAt: projectSubmissions.submittedAt,
        projectTitle: projects.title,
        studentName: users.name,
        studentEmail: users.email,
        studentAvatar: users.image,
      })
      .from(projectSubmissions)
      .leftJoin(projects, eq(projectSubmissions.projectId, projects.id))
      .leftJoin(users, eq(projectSubmissions.userId, users.id))
      .orderBy(desc(projectSubmissions.submittedAt));

    // Also fetch any reviews for these submissions
    const reviews = await db.select().from(projectReviews);
    const reviewMap = new Map<string, any>();
    for (const r of reviews as any[]) {
      reviewMap.set(r.submissionId, r);
    }

    const formatted = rows.map((sub: any) => {
      const review = reviewMap.get(sub.id);
      return {
        id: sub.id,
        projectId: sub.projectId,
        studentId: sub.userId,
        studentName: sub.studentName || "Student",
        studentEmail: sub.studentEmail || "",
        studentAvatar: sub.studentAvatar || null,
        assignmentTitle: sub.projectTitle || "Capstone Project",
        courseTitle: "Full-Stack Software Engineering",
        repoUrl: sub.githubRepoUrl,
        liveDemoUrl: sub.liveDemoUrl || null,
        status: sub.status === "reviewed" ? "graded" : sub.status,
        provisionalScore: review ? review.score : null,
        mentorComment: review ? review.feedbackMarkdown : null,
        submittedAt: sub.submittedAt instanceof Date ? sub.submittedAt.toISOString() : String(sub.submittedAt),
      };
    });

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return internalErrorResponse(error, "/api/mentor/submissions");
  }
}
