import { NextRequest, NextResponse } from "next/server";
import { getServerSession, requireRole, requireAdmin } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and, asc, desc } from "drizzle-orm";
import { z } from "zod";

const updateProjectSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  description: z.string().min(10).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  technologies: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
  instructionsMarkdown: z.string().optional(),
  starterRepoUrl: z.string().url().optional().or(z.literal("")),
  estimatedHours: z.number().int().min(1).optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionContext = await getServerSession();

    // 1. Fetch project by ID or slug
    const projects = await db
      .select()
      .from(schema.projects)
      .where(or(eq(schema.projects.id, id), eq(schema.projects.slug, id)));

    const project = projects[0];
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Access control: if not published, must be mentor or admin
    if (!project.isPublished) {
      const isElevated =
        sessionContext &&
        (sessionContext.user.role === "mentor" ||
          sessionContext.user.role === "admin" ||
          sessionContext.user.role === "super_admin");

      if (!isElevated) {
        return NextResponse.json(
          { success: false, error: "Project is not yet published." },
          { status: 403 }
        );
      }
    }

    // 2. Fetch milestones ordered by orderIndex
    const milestones = await db
      .select()
      .from(schema.projectMilestones)
      .where(eq(schema.projectMilestones.projectId, project.id))
      .orderBy(asc(schema.projectMilestones.orderIndex));

    // 3. If authenticated, fetch user's enrollment, submissions, and reviews
    let enrollment = null;
    const submissions: any[] = [];

    if (sessionContext?.user?.id) {
      const enrollments = await db
        .select()
        .from(schema.projectEnrollments)
        .where(
          and(
            eq(schema.projectEnrollments.userId, sessionContext.user.id),
            eq(schema.projectEnrollments.projectId, project.id)
          )
        );
      enrollment = enrollments[0] || null;

      const userSubmissions = await db
        .select()
        .from(schema.projectSubmissions)
        .where(
          and(
            eq(schema.projectSubmissions.userId, sessionContext.user.id),
            eq(schema.projectSubmissions.projectId, project.id)
          )
        )
        .orderBy(desc(schema.projectSubmissions.submittedAt));

      // Fetch reviews for submissions
      for (const sub of userSubmissions) {
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

        submissions.push({
          ...sub,
          reviews,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        milestones,
        enrollment,
        submissions,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch project details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["mentor", "admin", "super_admin"]);
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    const [updated] = await db
      .update(schema.projects)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(or(eq(schema.projects.id, id), eq(schema.projects.slug, id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [deleted] = await db
      .delete(schema.projects)
      .where(or(eq(schema.projects.id, id), eq(schema.projects.slug, id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
