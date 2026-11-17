import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { generateAICodeReview } from "@/server/ai";
import { db, schema } from "@/server/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const reviewSchema = z.object({
  code: z.string().min(5, "Code snippet must be at least 5 characters long").max(20000, "Code snippet is too large"),
  language: z.string().optional().default("typescript"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const review = await generateAICodeReview({
      code: validated.code,
      language: validated.language,
      userId: session?.user?.id,
    });

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze code" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const reviews = await db
      .select()
      .from(schema.aiCodeReviews)
      .where(eq(schema.aiCodeReviews.userId, session.user.id))
      .orderBy(desc(schema.aiCodeReviews.createdAt))
      .limit(10);

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch code reviews" },
      { status: 500 }
    );
  }
}
