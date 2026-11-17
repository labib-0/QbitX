import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";

export async function GET(request: NextRequest) {
  try {
    const context = await requireUser();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || undefined;

    // Securely bind to authenticated user session
    const notes = WorkspaceService.getNotes(context.user.id, lessonId);
    return NextResponse.json({ success: true, count: notes.length, data: notes });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireUser();
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: "Note title and content are required" },
        { status: 400 }
      );
    }

    const created = WorkspaceService.addNote({
      userId: context.user.id, // Strictly bind to session user
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
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
