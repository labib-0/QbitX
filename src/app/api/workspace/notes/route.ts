// GET  /api/workspace/notes -> Get student notes
// POST /api/workspace/notes -> Create student note

import { NextRequest, NextResponse } from "next/server";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "usr-student-demo";
    const lessonId = searchParams.get("lessonId") || undefined;

    const notes = WorkspaceService.getNotes(userId, lessonId);
    return NextResponse.json({ success: true, count: notes.length, data: notes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = WorkspaceService.addNote({
      userId: body.userId || "usr-student-demo",
      courseId: body.courseId || "crs-1",
      lessonId: body.lessonId || "les-1",
      timestampSeconds: body.timestampSeconds,
      title: body.title,
      content: body.content,
      tags: body.tags || ["student-note"],
      isPinned: !!body.isPinned,
      isShared: !!body.isShared,
    });
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
