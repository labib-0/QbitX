import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";
import { internalErrorResponse, badRequestResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || "les-1";

    const threads = WorkspaceService.getDiscussions(lessonId);
    return NextResponse.json({ success: true, count: threads.length, data: threads });
  } catch (error: any) {
    return internalErrorResponse(error, "/api/workspace/discussions");
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireUser();
    const body = await request.json();
    const { threadId, lessonId = "les-1", title, content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const authorRole: "student" | "mentor" | "admin" =
      context.user.role === "super_admin" ? "admin" : context.user.role;

    if (threadId) {
      // Adding a comment to existing thread
      const comment = WorkspaceService.addComment(threadId, lessonId, {
        authorId: context.user.id,
        authorName: context.user.name,
        authorRole,
        content: content.trim(),
      });
      return NextResponse.json({ success: true, data: comment });
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required for a new thread" },
        { status: 400 }
      );
    }

    // Creating new thread
    const thread = WorkspaceService.addDiscussion({
      lessonId,
      authorId: context.user.id,
      authorName: context.user.name,
      authorRole,
      title: title.trim(),
      content: content.trim(),
      isPinned: false,
      isResolved: false,
      tags: body.tags || [],
    });

    return NextResponse.json({ success: true, data: thread });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return badRequestResponse(error, "/api/workspace/discussions");
  }
}
