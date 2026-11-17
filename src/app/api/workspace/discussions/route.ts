import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { workspaceDiscussions, workspaceDiscussionReplies } from "@/server/db/schema";
import { eq, desc, asc, inArray } from "drizzle-orm";
import { internalErrorResponse, badRequestResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || "les-c1-1";

    const db = getDb();
    const threads = await db
      .select()
      .from(workspaceDiscussions)
      .where(eq(workspaceDiscussions.lessonId, lessonId))
      .orderBy(desc(workspaceDiscussions.createdAt));

    const threadIds = threads.map((t: any) => t.id);

    const replies =
      threadIds.length > 0
        ? await db
            .select()
            .from(workspaceDiscussionReplies)
            .where(inArray(workspaceDiscussionReplies.discussionId, threadIds))
            .orderBy(asc(workspaceDiscussionReplies.createdAt))
        : [];

    const replyMap = new Map<string, any[]>();
    for (const reply of replies as any[]) {
      if (!replyMap.has(reply.discussionId)) {
        replyMap.set(reply.discussionId, []);
      }
      replyMap.get(reply.discussionId)!.push({
        id: reply.id,
        threadId: reply.discussionId,
        authorId: reply.authorId,
        authorName: reply.authorName,
        authorRole: "student",
        content: reply.content,
        upvotesCount: reply.upvotes,
        createdAt: reply.createdAt instanceof Date ? reply.createdAt.toISOString() : String(reply.createdAt),
      });
    }

    const formatted = threads.map((t: any) => ({
      id: t.id,
      lessonId: t.lessonId,
      authorId: t.authorId,
      authorName: t.authorName,
      authorRole: "student" as const,
      title: t.title,
      content: t.content,
      upvotes: t.upvotes,
      isPinned: false,
      isResolved: false,
      tags: [],
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
      updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : String(t.updatedAt),
      comments: replyMap.get(t.id) || [],
    }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error: any) {
    return internalErrorResponse(error, "/api/workspace/discussions");
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireUser();
    const body = await request.json();
    const { threadId, lessonId = "les-c1-1", title, content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    const db = getDb();

    if (threadId) {
      // Adding a comment to an existing thread
      const newComment = {
        id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        discussionId: threadId,
        authorId: context.user.id,
        authorName: context.user.name,
        content: content.trim(),
        upvotes: 0,
        createdAt: new Date(),
      };

      await db.insert(workspaceDiscussionReplies).values(newComment);

      return NextResponse.json({
        success: true,
        data: {
          ...newComment,
          threadId: newComment.discussionId,
          authorRole: context.user.role,
          upvotesCount: 0,
          createdAt: newComment.createdAt.toISOString(),
        },
      });
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required for a new thread" },
        { status: 400 }
      );
    }

    // Creating a new thread
    const newThread = {
      id: `disc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      lessonId,
      authorId: context.user.id,
      authorName: context.user.name,
      title: title.trim(),
      content: content.trim(),
      upvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(workspaceDiscussions).values(newThread);

    return NextResponse.json({
      success: true,
      data: {
        ...newThread,
        authorRole: context.user.role,
        isPinned: false,
        isResolved: false,
        tags: body.tags || [],
        comments: [],
        createdAt: newThread.createdAt.toISOString(),
        updatedAt: newThread.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return badRequestResponse(error, "/api/workspace/discussions");
  }
}
