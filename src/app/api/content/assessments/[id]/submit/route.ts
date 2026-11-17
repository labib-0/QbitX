import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";
import { z } from "zod";

const submitAssessmentSchema = z.object({
  answers: z.record(z.string(), z.number()),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser();
    const { id } = await params;
    const body = await request.json();
    const { answers } = submitAssessmentSchema.parse(body);

    // 1. Fetch assessment
    const assessments = await db
      .select()
      .from(schema.assessments)
      .where(or(eq(schema.assessments.id, id), eq(schema.assessments.lessonId, id)));

    const assessment = assessments[0];
    if (!assessment) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
    }

    // 2. Fetch all questions with correctOptionIndex from DB
    const questions = await db
      .select()
      .from(schema.assessmentQuestions)
      .where(eq(schema.assessmentQuestions.assessmentId, assessment.id));

    if (questions.length === 0) {
      return NextResponse.json({ success: false, error: "No questions configured for assessment." }, { status: 400 });
    }

    // 3. Server-side score evaluation
    let correctCount = 0;
    const results: Record<string, { correct: boolean; correctOptionIndex: number; explanation?: string | null }> = {};

    for (const q of questions) {
      const studentAnswer = answers[q.id];
      const isCorrect = studentAnswer !== undefined && studentAnswer === q.correctOptionIndex;
      if (isCorrect) correctCount += 1;

      results[q.id] = {
        correct: isCorrect,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
      };
    }

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= assessment.passingScore;

    // 4. Persist attempt record
    const attemptId = `atm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(schema.assessmentAttempts).values({
      id: attemptId,
      assessmentId: assessment.id,
      userId: user.id,
      score,
      passed,
      answers,
      attemptedAt: new Date(),
    });

    // 5. If passed, mark lesson completed
    if (passed && assessment.lessonId && assessment.courseId) {
      const existingProgress = await db
        .select()
        .from(schema.lessonProgress)
        .where(
          and(
            eq(schema.lessonProgress.userId, user.id),
            eq(schema.lessonProgress.lessonId, assessment.lessonId)
          )
        );

      if (existingProgress.length === 0) {
        await db.insert(schema.lessonProgress).values({
          id: `lp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: user.id,
          lessonId: assessment.lessonId,
          courseId: assessment.courseId,
          isCompleted: true,
          completedAt: new Date(),
        });
      } else if (!existingProgress[0].isCompleted) {
        await db
          .update(schema.lessonProgress)
          .set({ isCompleted: true, completedAt: new Date() })
          .where(eq(schema.lessonProgress.id, existingProgress[0].id));
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        score,
        passed,
        passingScore: assessment.passingScore,
        totalQuestions: questions.length,
        correctCount,
        results,
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Invalid answers format", details: error.errors }, { status: 400 });
    }
    return internalErrorResponse(error, "/api/content/assessments/[id]/submit POST");
  }
}
