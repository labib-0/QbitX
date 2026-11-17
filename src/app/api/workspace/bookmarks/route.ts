import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";
import { internalErrorResponse, badRequestResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    const context = await requireUser();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || undefined;

    // Securely bind to authenticated user session
    const bookmarks = WorkspaceService.getBookmarks(context.user.id, lessonId);
    return NextResponse.json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return internalErrorResponse(error, "/api/workspace/bookmarks");
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireUser();
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Bookmark title is required" },
        { status: 400 }
      );
    }

    const created = WorkspaceService.addBookmark({
      userId: context.user.id, // Strictly bind to session user
      courseId: body.courseId || "crs-1",
      lessonId: body.lessonId || "les-1",
      title: body.title,
      timestampSeconds: body.timestampSeconds,
      codeSnippet: body.codeSnippet,
      note: body.note,
    });
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return badRequestResponse(error, "/api/workspace/bookmarks");
  }
}
