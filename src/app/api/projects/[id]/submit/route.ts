import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and, desc } from "drizzle-orm";
import { z } from "zod";

const githubRepoRegex = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/;

const submitProjectSchema = z.object({
  githubRepoUrl: z
    .string()
    .regex(
      githubRepoRegex,
      "Please provide a valid GitHub repository URL (e.g., https://github.com/username/repository)"
    ),
  liveDemoUrl: z.string().url("Please provide a valid URL for the live demo").optional().or(z.literal("")),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireUser();
    const { id } = await params;
    const body = await request.json();
    const validatedData = submitProjectSchema.parse(body);

    // 1. Find project
    const projects = await db
      .select()
      .from(schema.projects)
      .where(or(eq(schema.projects.id, id), eq(schema.projects.slug, id)));

    const project = projects[0];
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // 2. Ensure user has an enrollment record (or auto-enroll them)
    const enrollments = await db
      .select()
      .from(schema.projectEnrollments)
      .where(
        and(
          eq(schema.projectEnrollments.userId, context.user.id),
          eq(schema.projectEnrollments.projectId, project.id)
        )
      );

    if (enrollments.length === 0) {
      await db.insert(schema.projectEnrollments).values({
        id: `proj-enr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: context.user.id,
        projectId: project.id,
        status: "submitted",
        currentMilestone: 1,
        startedAt: new Date(),
      });
    } else {
      await db
        .update(schema.projectEnrollments)
        .set({ status: "submitted" })
        .where(eq(schema.projectEnrollments.id, enrollments[0].id));
    }

    // 3. Create submission record
    const submissionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const [submission] = await db
      .insert(schema.projectSubmissions)
      .values({
        id: submissionId,
        projectId: project.id,
        userId: context.user.id,
        githubRepoUrl: validatedData.githubRepoUrl.trim(),
        liveDemoUrl: validatedData.liveDemoUrl?.trim() || null,
        notes: validatedData.notes?.trim() || null,
        status: "pending_review",
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 4. Create confirmation notification
    await db.insert(schema.notifications).values({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: context.user.id,
      title: "Project Submission Received",
      message: `Your submission for "${project.title}" has been received and queued for mentor review.`,
      type: "submission",
      link: `/student/projects/${project.slug || project.id}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project submitted successfully. Your mentor review is now pending.",
        data: submission,
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
      { success: false, error: error.message || "Failed to submit project" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireUser();
    const { id } = await params;

    const projects = await db
      .select()
      .from(schema.projects)
      .where(or(eq(schema.projects.id, id), eq(schema.projects.slug, id)));

    const project = projects[0];
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const submissions = await db
      .select()
      .from(schema.projectSubmissions)
      .where(
        and(
          eq(schema.projectSubmissions.userId, context.user.id),
          eq(schema.projectSubmissions.projectId, project.id)
        )
      )
      .orderBy(desc(schema.projectSubmissions.submittedAt));

    const submissionsWithReviews = [];
    for (const sub of submissions) {
      const reviews = await db
        .select({
          id: schema.projectReviews.id,
          reviewerId: schema.projectReviews.reviewerId,
          score: schema.projectReviews.score,
          feedbackMarkdown: schema.projectReviews.feedbackMarkdown,
          criteriaScores: schema.projectReviews.criteriaScores,
          status: schema.projectReviews.status,
          reviewedAt: schema.projectReviews.reviewedAt,
          reviewerName: schema.users.name,
        })
        .from(schema.projectReviews)
        .leftJoin(schema.users, eq(schema.projectReviews.reviewerId, schema.users.id))
        .where(eq(schema.projectReviews.submissionId, sub.id))
        .orderBy(desc(schema.projectReviews.reviewedAt));

      submissionsWithReviews.push({
        ...sub,
        reviews,
      });
    }

    return NextResponse.json({
      success: true,
      data: submissionsWithReviews,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
