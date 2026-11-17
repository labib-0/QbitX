import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await requireUser();
    const { id } = await params;

    // 1. Verify project exists
    const projects = await db
      .select()
      .from(schema.projects)
      .where(or(eq(schema.projects.id, id), eq(schema.projects.slug, id)));

    const project = projects[0];
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    if (!project.isPublished) {
      return NextResponse.json(
        { success: false, error: "Cannot enroll in an unpublished project." },
        { status: 400 }
      );
    }

    // 2. Check if already enrolled
    const existing = await db
      .select()
      .from(schema.projectEnrollments)
      .where(
        and(
          eq(schema.projectEnrollments.userId, context.user.id),
          eq(schema.projectEnrollments.projectId, project.id)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Already enrolled in this project",
        data: existing[0],
      });
    }

    // 3. Create project enrollment
    const enrollmentId = `proj-enr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const [newEnrollment] = await db
      .insert(schema.projectEnrollments)
      .values({
        id: enrollmentId,
        userId: context.user.id,
        projectId: project.id,
        status: "in_progress",
        currentMilestone: 1,
        startedAt: new Date(),
      })
      .returning();

    // 4. Create notification
    await db.insert(schema.notifications).values({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: context.user.id,
      title: "Project Started",
      message: `You have successfully enrolled in project: "${project.title}". Check out the milestones and start building!`,
      type: "system",
      link: `/student/projects/${project.slug || project.id}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enrolled successfully",
        data: newEnrollment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to enroll in project" },
      { status: 500 }
    );
  }
}
