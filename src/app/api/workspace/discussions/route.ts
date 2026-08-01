// GET  /api/workspace/discussions -> Fetch threads for a lesson
// POST /api/workspace/discussions -> Post thread or comment

import { NextRequest, NextResponse } from "next/server";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || "les-1";

    const threads = WorkspaceService.getDiscussions(lessonId);
    return NextResponse.json({ success: true, count: threads.length, data: threads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { threadId, lessonId = "les-1", title, content, authorId, authorName, authorRole = "student" } = body;

    if (threadId) {
      // Adding a comment to existing thread
      const comment = WorkspaceService.addComment(threadId, lessonId, {
        authorId,
        authorName,
        authorRole,
        content,
      });
      return NextResponse.json({ success: true, data: comment });
    }

    // Creating new thread
    const thread = WorkspaceService.addDiscussion({
      lessonId,
      authorId,
      authorName,
      authorRole,
      title,
      content,
      isPinned: false,
      isResolved: false,
      tags: body.tags || [],
    });

    return NextResponse.json({ success: true, data: thread });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
