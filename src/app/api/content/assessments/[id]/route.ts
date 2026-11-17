import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and, asc, desc } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    // Find assessment by id or lessonId
    const assessments = await db
      .select()
      .from(schema.assessments)
      .where(or(eq(schema.assessments.id, id), eq(schema.assessments.lessonId, id)));

    const assessment = assessments[0];
    if (!assessment) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
    }

    // Fetch questions WITHOUT exposing correctOptionIndex or explanation
    const questions = await db
      .select({
        id: schema.assessmentQuestions.id,
        assessmentId: schema.assessmentQuestions.assessmentId,
        questionText: schema.assessmentQuestions.questionText,
        options: schema.assessmentQuestions.options,
        orderIndex: schema.assessmentQuestions.orderIndex,
      })
      .from(schema.assessmentQuestions)
      .where(eq(schema.assessmentQuestions.assessmentId, assessment.id))
      .orderBy(asc(schema.assessmentQuestions.orderIndex));

    // If student is logged in, fetch previous attempts
    let previousAttempts: any[] = [];
    if (session?.user?.id) {
      previousAttempts = await db
        .select()
        .from(schema.assessmentAttempts)
        .where(
          and(
            eq(schema.assessmentAttempts.assessmentId, assessment.id),
            eq(schema.assessmentAttempts.userId, session.user.id)
          )
        )
        .orderBy(desc(schema.assessmentAttempts.attemptedAt))
        .limit(5);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: assessment.id,
        lessonId: assessment.lessonId,
        courseId: assessment.courseId,
        title: assessment.title,
        description: assessment.description,
        passingScore: assessment.passingScore,
        questions,
        previousAttempts,
      },
    });
  } catch (error: any) {
    return internalErrorResponse(error, "/api/content/assessments/[id] GET");
  }
}
