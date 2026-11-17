import { NextRequest, NextResponse } from "next/server";
import { getServerSession, requireMentor } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, and, ilike, desc, or } from "drizzle-orm";
import { z } from "zod";

const createCourseSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10),
  category: z.string().default("Software Engineering"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  trackId: z.string().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  durationHours: z.number().int().min(1).default(10),
  prerequisites: z.array(z.string()).default([]),
  learningOutcomes: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const trackId = searchParams.get("trackId");
    const query = searchParams.get("q");

    const sessionContext = await getServerSession();
    const isElevated =
      sessionContext &&
      (sessionContext.user.role === "mentor" ||
        sessionContext.user.role === "admin" ||
        sessionContext.user.role === "super_admin");

    const conditions: any[] = [];

    // Unauthenticated or student users ONLY see published courses
    if (!isElevated) {
      conditions.push(eq(schema.courses.isPublished, true));
    } else {
      const statusFilter = searchParams.get("status");
      if (statusFilter === "published") {
        conditions.push(eq(schema.courses.isPublished, true));
      } else if (statusFilter === "draft") {
        conditions.push(eq(schema.courses.isPublished, false));
      }
    }

    if (category) conditions.push(eq(schema.courses.category, category));
    if (difficulty) conditions.push(eq(schema.courses.difficulty, difficulty));
    if (trackId) conditions.push(eq(schema.courses.trackId, trackId));
    if (query) {
      conditions.push(
        or(
          ilike(schema.courses.title, `%${query}%`),
          ilike(schema.courses.description, `%${query}%`)
        )
      );
    }

    const courses = await db
      .select()
      .from(schema.courses)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(schema.courses.createdAt));

    return NextResponse.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireMentor();
    const body = await request.json();
    const data = createCourseSchema.parse(body);

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const courseId = `crs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const [newCourse] = await db
      .insert(schema.courses)
      .values({
        id: courseId,
        slug,
        ...data,
        instructorId: user.id,
        instructorName: user.name,
      })
      .returning();

    // Log administrative audit event
    await db.insert(schema.auditLogs).values({
      id: `log-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      actionType: "COURSE_CREATED",
      targetId: newCourse.id,
      targetType: "course",
      details: `Created new course: "${newCourse.title}"`,
    });

    return NextResponse.json({ success: true, data: newCourse }, { status: 201 });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create course" },
      { status: 500 }
    );
  }
}
