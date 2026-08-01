// GET  /api/content/lessons -> List lessons for a module OR get detailed lesson with activities/resources
// POST /api/content/lessons -> Create/update lesson

import { NextRequest, NextResponse } from "next/server";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { UserRole } from "@/types/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    const lessonId = searchParams.get("id");
    const role = (searchParams.get("role") as UserRole) || "student";

    if (lessonId) {
      const details = ContentRetrievalService.getLessonById(lessonId, role);
      if (!details) {
        return NextResponse.json({ success: false, error: "Lesson not found or access denied" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: details });
    }

    if (moduleId) {
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
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Lesson content updated in architecture",
      data: {
        id: body.id || `les-${Date.now()}`,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
