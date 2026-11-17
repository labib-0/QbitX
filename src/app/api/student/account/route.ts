import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";

export async function DELETE() {
  try {
    const { user } = await requireUser();

    // Cascades through sessions, accounts, enrollments, lesson_progress, student_profiles, etc.
    await db.delete(schema.users).where(eq(schema.users.id, user.id));

    return NextResponse.json({
      success: true,
      message: "Student account and all associated records have been permanently deleted.",
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return internalErrorResponse(error, "/api/student/account DELETE");
  }
}
