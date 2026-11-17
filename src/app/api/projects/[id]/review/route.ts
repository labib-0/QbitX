import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

const reviewSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  score: z.number().int().min(0).max(100, "Score must be between 0 and 100"),
  feedbackMarkdown: z.string().min(5, "Feedback must be at least 5 characters"),
  status: z.enum(["approved", "changes_requested"]),
  criteriaScores: z.record(z.string(), z.number()).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireRole(["mentor", "admin", "super_admin"]);
    const { id } = await params;
    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // 1. Fetch submission
    const submissions = await db
      .select()
      .from(schema.projectSubmissions)
      .where(eq(schema.projectSubmissions.id, validatedData.submissionId));

    const submission = submissions[0];
    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    // 1b. Check if already reviewed to prevent improper duplicate reviews
    const existingReviews = await db
      .select()
      .from(schema.projectReviews)
      .where(eq(schema.projectReviews.submissionId, submission.id));

    if (existingReviews.length > 0 && submission.status === "reviewed") {
      return NextResponse.json(
        { success: false, error: "This project submission has already been reviewed and approved." },
        { status: 409 }
      );
    }

    // 2. Insert Review
    const reviewId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const [review] = await db
      .insert(schema.projectReviews)
      .values({
        id: reviewId,
        submissionId: submission.id,
        reviewerId: context.user.id,
        score: validatedData.score,
        feedbackMarkdown: validatedData.feedbackMarkdown,
        criteriaScores: validatedData.criteriaScores || null,
        status: validatedData.status,
        reviewedAt: new Date(),
      })
      .returning();

    // 3. Update Submission Status
    const newSubmissionStatus = validatedData.status === "approved" ? "reviewed" : "needs_changes";
    await db
      .update(schema.projectSubmissions)
      .set({
        status: newSubmissionStatus,
        updatedAt: new Date(),
      })
      .where(eq(schema.projectSubmissions.id, submission.id));

    // 4. If approved, mark enrollment completed and award XP IDEMPOTENTLY
    if (validatedData.status === "approved") {
      const existingEnrollments = await db
        .select()
        .from(schema.projectEnrollments)
        .where(
          and(
            eq(schema.projectEnrollments.userId, submission.userId),
            eq(schema.projectEnrollments.projectId, submission.projectId)
          )
        );

      const alreadyCompleted = existingEnrollments[0]?.status === "completed";

      await db
        .update(schema.projectEnrollments)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(
          and(
            eq(schema.projectEnrollments.userId, submission.userId),
            eq(schema.projectEnrollments.projectId, submission.projectId)
          )
        );

      // Award XP to student profile ONLY IF not already completed (Idempotency guarantee)
      if (!alreadyCompleted) {
        await db
          .update(schema.studentProfiles)
          .set({
            xp: sql`${schema.studentProfiles.xp} + 300`,
            updatedAt: new Date(),
          })
          .where(eq(schema.studentProfiles.userId, submission.userId));
      }
    }

    // 5. Send notification to student
    const isApproved = validatedData.status === "approved";
    await db.insert(schema.notifications).values({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: submission.userId,
      title: isApproved ? "Project Approved!" : "Project Feedback Received",
      message: isApproved
        ? `Congratulations! Your project submission was approved with a score of ${validatedData.score}/100 (+300 XP earned).`
        : `Your project submission received feedback with a score of ${validatedData.score}/100. Changes have been requested.`,
      type: "assessment",
      link: `/student/projects/${submission.projectId}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        data: review,
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
      { success: false, error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
