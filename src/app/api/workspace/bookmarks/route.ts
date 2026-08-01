// GET  /api/workspace/bookmarks -> Fetch bookmarks
// POST /api/workspace/bookmarks -> Add bookmark

import { NextRequest, NextResponse } from "next/server";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "usr-student-demo";
    const lessonId = searchParams.get("lessonId") || undefined;

    const bookmarks = WorkspaceService.getBookmarks(userId, lessonId);
    return NextResponse.json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = WorkspaceService.addBookmark({
      userId: body.userId || "usr-student-demo",
      courseId: body.courseId || "crs-1",
      lessonId: body.lessonId || "les-1",
      title: body.title,
      timestampSeconds: body.timestampSeconds,
      codeSnippet: body.codeSnippet,
      note: body.note,
    });
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
