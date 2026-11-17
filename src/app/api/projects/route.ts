import { NextRequest, NextResponse } from "next/server";
import { getServerSession, requireRole } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and, ilike, sql } from "drizzle-orm";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(3).max(150),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  description: z.string().min(10),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  technologies: z.array(z.string()).default([]),
  learningObjectives: z.array(z.string()).default([]),
  instructionsMarkdown: z.string().optional(),
  starterRepoUrl: z.string().url().optional().or(z.literal("")),
  estimatedHours: z.number().int().min(1).default(20),
  isPublished: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const tech = searchParams.get("tech");
    const search = searchParams.get("search");

    const sessionContext = await getServerSession();
    const isElevated =
      sessionContext &&
      (sessionContext.user.role === "mentor" ||
        sessionContext.user.role === "admin" ||
        sessionContext.user.role === "super_admin");

    // 1. Fetch projects
    let query = db.select().from(schema.projects);

    const conditions = [];
    if (!isElevated) {
      conditions.push(eq(schema.projects.isPublished, true));
    }
    if (difficulty && ["beginner", "intermediate", "advanced"].includes(difficulty)) {
      conditions.push(eq(schema.projects.difficulty, difficulty));
    }
    if (search) {
      conditions.push(
        or(
          ilike(schema.projects.title, `%${search}%`),
          ilike(schema.projects.description, `%${search}%`)
        )
      );
    }

    const projectList = conditions.length > 0
      ? await query.where(and(...conditions))
      : await query;

    // Filter by tech in memory if requested (since technologies is jsonb)
    const filteredProjects = tech
      ? projectList.filter((p: any) =>
          Array.isArray(p.technologies) &&
          p.technologies.some((t: string) => t.toLowerCase() === tech.toLowerCase())
        )
      : projectList;

    // 2. Fetch user enrollments if authenticated
    let userEnrollmentsMap = new Map<string, typeof schema.projectEnrollments.$inferSelect>();
    let userSubmissionsCountMap = new Map<string, number>();

    if (sessionContext?.user?.id) {
      const enrollments = await db
        .select()
        .from(schema.projectEnrollments)
        .where(eq(schema.projectEnrollments.userId, sessionContext.user.id));

      for (const enr of enrollments) {
        userEnrollmentsMap.set(enr.projectId, enr);
      }

      const submissions = await db
        .select({
          projectId: schema.projectSubmissions.projectId,
          count: sql<number>`count(*)`,
        })
        .from(schema.projectSubmissions)
        .where(eq(schema.projectSubmissions.userId, sessionContext.user.id))
        .groupBy(schema.projectSubmissions.projectId);

      for (const sub of submissions) {
        userSubmissionsCountMap.set(sub.projectId, Number(sub.count));
      }
    }

    // 3. Fetch milestones count per project
    const milestonesCount = await db
      .select({
        projectId: schema.projectMilestones.projectId,
        count: sql<number>`count(*)`,
      })
      .from(schema.projectMilestones)
      .groupBy(schema.projectMilestones.projectId);

    const milestonesCountMap = new Map<string, number>();
    for (const mc of milestonesCount) {
      milestonesCountMap.set(mc.projectId, Number(mc.count));
    }

    // 4. Construct enriched response
    const enrichedProjects = filteredProjects.map((p: any) => {
      const enrollment = userEnrollmentsMap.get(p.id);
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        technologies: p.technologies || [],
        learningObjectives: p.learningObjectives || [],
        starterRepoUrl: p.starterRepoUrl,
        estimatedHours: p.estimatedHours,
        isPublished: p.isPublished,
        milestonesCount: milestonesCountMap.get(p.id) || 0,
        enrollment: enrollment
          ? {
              id: enrollment.id,
              status: enrollment.status,
              currentMilestone: enrollment.currentMilestone,
              startedAt: enrollment.startedAt,
              completedAt: enrollment.completedAt,
            }
          : null,
        submissionsCount: userSubmissionsCountMap.get(p.id) || 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedProjects,
      total: enrichedProjects.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole(["mentor", "admin", "super_admin"]);
    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const existingSlug = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.slug, validatedData.slug));

    if (existingSlug.length > 0) {
      return NextResponse.json(
        { success: false, error: "A project with this slug already exists." },
        { status: 409 }
      );
    }

    const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const [newProject] = await db
      .insert(schema.projects)
      .values({
        id: projectId,
        slug: validatedData.slug,
        title: validatedData.title,
        description: validatedData.description,
        difficulty: validatedData.difficulty,
        technologies: validatedData.technologies,
        learningObjectives: validatedData.learningObjectives,
        instructionsMarkdown: validatedData.instructionsMarkdown || "",
        starterRepoUrl: validatedData.starterRepoUrl || null,
        estimatedHours: validatedData.estimatedHours,
        isPublished: validatedData.isPublished,
      })
      .returning();

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
