import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { workspaceNotes } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { internalErrorResponse, badRequestResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    const context = await requireUser();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId") || undefined;

    const db = getDb();
    const filter = lessonId
      ? and(eq(workspaceNotes.userId, context.user.id), eq(workspaceNotes.lessonId, lessonId))
      : eq(workspaceNotes.userId, context.user.id);

    const notes = await db
      .select()
      .from(workspaceNotes)
      .where(filter)
      .orderBy(desc(workspaceNotes.createdAt));

    return NextResponse.json({ success: true, count: notes.length, data: notes });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return internalErrorResponse(error, "/api/workspace/notes");
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

    const db = getDb();
    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: context.user.id,
      courseId: body.courseId || "crs-ai-web-eng",
      lessonId: body.lessonId || "les-c1-1",
      timestampSeconds: typeof body.timestampSeconds === "number" ? body.timestampSeconds : null,
      title: body.title,
      content: body.content,
      tags: Array.isArray(body.tags) ? body.tags : ["student-note"],
      isPinned: !!body.isPinned,
      isShared: !!body.isShared,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(workspaceNotes).values(newNote);

    return NextResponse.json({ success: true, data: newNote });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return badRequestResponse(error, "/api/workspace/notes");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const context = await requireUser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing note id" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db
      .delete(workspaceNotes)
      .where(and(eq(workspaceNotes.id, id), eq(workspaceNotes.userId, context.user.id)));

    return NextResponse.json({ success: true, message: "Note deleted successfully" });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return internalErrorResponse(error, "/api/workspace/notes");
  }
}
