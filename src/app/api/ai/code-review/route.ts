import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { generateAICodeReview } from "@/server/ai";
import { db, schema } from "@/server/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

export const maxDuration = 60;

const reviewSchema = z.object({
  code: z.string().min(5, "Code snippet must be at least 5 characters long").max(20000, "Code snippet is too large"),
  language: z.string().optional().default("typescript"),
});

function authorizationErrorResponse(error: any) {
  if (error?.name === "UnauthorizedError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
  if (error?.name === "ForbiddenError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 403 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Code review invokes a paid LLM; it must never be usable anonymously.
    const { user } = await requireUser();
    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const review = await generateAICodeReview({
      code: validated.code,
      language: validated.language,
      userId: user.id,
    });

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return internalErrorResponse(error, "/api/ai/code-review");
  }
}

export async function GET() {
  try {
    const { user } = await requireUser();

    const reviews = await db
      .select()
      .from(schema.aiCodeReviews)
      .where(eq(schema.aiCodeReviews.userId, user.id))
      .orderBy(desc(schema.aiCodeReviews.createdAt))
      .limit(10);

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    return internalErrorResponse(error, "/api/ai/code-review");
  }
}
