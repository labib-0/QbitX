import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { workspaceBookmarks } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { internalErrorResponse, badRequestResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    const context = await requireUser();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || undefined;

    const db = getDb();
    const filter = lessonId
      ? and(eq(workspaceBookmarks.userId, context.user.id), eq(workspaceBookmarks.lessonId, lessonId))
      : eq(workspaceBookmarks.userId, context.user.id);

    const bookmarks = await db
      .select()
      .from(workspaceBookmarks)
      .where(filter)
      .orderBy(desc(workspaceBookmarks.createdAt));

    return NextResponse.json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
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

    const db = getDb();
    const newBookmark = {
      id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: context.user.id,
      courseId: body.courseId || "crs-ai-web-eng",
      lessonId: body.lessonId || "les-c1-1",
      title: body.title,
      timestampSeconds: typeof body.timestampSeconds === "number" ? body.timestampSeconds : null,
      codeSnippet: body.codeSnippet || null,
      note: body.note || null,
      createdAt: new Date(),
    };

    await db.insert(workspaceBookmarks).values(newBookmark);

    return NextResponse.json({ success: true, data: newBookmark });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return badRequestResponse(error, "/api/workspace/bookmarks");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const context = await requireUser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing bookmark id" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db
      .delete(workspaceBookmarks)
      .where(and(eq(workspaceBookmarks.id, id), eq(workspaceBookmarks.userId, context.user.id)));

    return NextResponse.json({ success: true, message: "Bookmark removed successfully" });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return internalErrorResponse(error, "/api/workspace/bookmarks");
  }
}
