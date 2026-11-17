import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionContext = await getServerSession();

    // 1. Fetch Lesson
    const lessons = await db
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.id, id));

    const lesson = lessons[0];
    if (!lesson) {
      return NextResponse.json({ success: false, error: "Lesson not found" }, { status: 404 });
    }

    // 2. Fetch Resources
    const resources = await db
      .select()
      .from(schema.learningResources)
      .where(eq(schema.learningResources.lessonId, lesson.id));

    // 3. Fetch Assessment if any
    const assessments = await db
      .select()
      .from(schema.assessments)
      .where(eq(schema.assessments.lessonId, lesson.id));

    // 4. Check user progress if logged in
    let userProgress = null;
    if (sessionContext?.user) {
      const progressList = await db
        .select()
        .from(schema.lessonProgress)
        .where(
          and(
            eq(schema.lessonProgress.userId, sessionContext.user.id),
            eq(schema.lessonProgress.lessonId, lesson.id)
          )
        );
      userProgress = progressList[0] || null;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...lesson,
        resources,
        assessment: assessments[0] || null,
        userProgress,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
