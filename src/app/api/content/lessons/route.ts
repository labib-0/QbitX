// GET  /api/content/lessons -> List lessons for a module OR get detailed lesson with activities/resources
// POST /api/content/lessons -> Create/update lesson in database with strict YouTube validation

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { extractYouTubeId } from "@/components/workspace/YouTubeVideoPlayer";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { UserRole } from "@/types/content";

const createLessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Lesson title must be at least 2 characters").max(200),
  courseId: z.string().min(1, "Course ID is required"),
  moduleId: z.string().min(1, "Module ID is required"),
  lessonType: z.enum(["video", "reading", "quiz", "coding_lab"]).default("video"),
  youtubeVideoId: z.string().optional().nullable().or(z.literal("")),
  durationMinutes: z.number().int().min(1).default(15),
  orderIndex: z.number().int().default(0),
  description: z.string().optional(),
  contentMarkdown: z.string().optional(),
  starterCode: z.string().optional(),
  solutionCode: z.string().optional(),
  isPublished: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    const lessonId = searchParams.get("id");
    const role = (searchParams.get("role") as UserRole) || "student";

    if (lessonId) {
      // 1. Check DB first
      const dbLessons = await db.select().from(schema.lessons).where(eq(schema.lessons.id, lessonId));
      if (dbLessons.length > 0) {
        return NextResponse.json({ success: true, data: dbLessons[0] });
      }

      const details = ContentRetrievalService.getLessonById(lessonId, role);
      if (!details) {
        return NextResponse.json({ success: false, error: "Lesson not found or access denied" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: details });
    }

    if (moduleId) {
      const dbLessons = await db
        .select()
        .from(schema.lessons)
        .where(eq(schema.lessons.moduleId, moduleId))
        .orderBy(asc(schema.lessons.orderIndex));

      if (dbLessons.length > 0) {
        return NextResponse.json({ success: true, count: dbLessons.length, data: dbLessons });
      }

      const lessons = ContentRetrievalService.getLessonsForModule(moduleId, role);
      return NextResponse.json({ success: true, count: lessons.length, data: lessons });
    }

    return NextResponse.json({ success: false, error: "Must specify moduleId or lessonId" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch lesson data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Role Authorization
    const context = await requireRole(["mentor", "admin", "super_admin"]);
    const body = await request.json();
    const data = createLessonSchema.parse(body);

    // 2. Validate YouTube Video ID if video type or provided
    let cleanYoutubeId: string | null = null;
    if (data.youtubeVideoId && data.youtubeVideoId.trim().length > 0) {
      cleanYoutubeId = extractYouTubeId(data.youtubeVideoId);
      if (!cleanYoutubeId) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid YouTube URL or Video ID. Please provide a valid 11-character YouTube video ID or URL.",
          },
          { status: 400 }
        );
      }
    }

    // 3. Insert or Update Lesson in Database
    const lessonId = data.id || `les-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const [lesson] = await db
      .insert(schema.lessons)
      .values({
        id: lessonId,
        courseId: data.courseId,
        moduleId: data.moduleId,
        title: data.title,
        description: data.description || null,
        lessonType: data.lessonType,
        youtubeVideoId: cleanYoutubeId,
        durationMinutes: data.durationMinutes,
        orderIndex: data.orderIndex,
        contentMarkdown: data.contentMarkdown || null,
        starterCode: data.starterCode || null,
        solutionCode: data.solutionCode || null,
        isPublished: data.isPublished,
      })
      .returning();

    // 4. Log Audit Event
    await db.insert(schema.auditLogs).values({
      id: `audit-les-${Date.now()}`,
      actorId: context.user.id,
      actorName: context.user.name,
      actorRole: context.user.role,
      actionType: "LESSON_CREATED",
      targetId: lesson.id,
      targetType: "lesson",
      details: { title: lesson.title, courseId: lesson.courseId, moduleId: lesson.moduleId },
    });

    return NextResponse.json({ success: true, data: lesson }, { status: 201 });
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
      { success: false, error: error.message || "Failed to create lesson" },
      { status: 500 }
    );
  }
}
