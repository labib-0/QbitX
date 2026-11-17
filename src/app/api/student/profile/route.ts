import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  university: z.string().max(150).optional(),
  department: z.string().max(150).optional(),
  studentId: z.string().max(50).optional(),
  academicYear: z.string().max(50).optional(),
  experienceLevel: z.string().optional(),
  track: z.string().optional(),
  bio: z.string().max(1000).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  skills: z.union([z.array(z.string()), z.string()]).optional(),
});

export async function GET() {
  try {
    const { user } = await requireUser();

    const profiles = await db
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, user.id));

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
        profile: profiles[0] || null,
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return internalErrorResponse(error, "/api/student/profile GET");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    // 1. Update user name in users table if provided
    if (validated.name && validated.name.trim() !== user.name) {
      await db
        .update(schema.users)
        .set({ name: validated.name.trim(), updatedAt: new Date() })
        .where(eq(schema.users.id, user.id));
    }

    // 2. Parse skills if submitted as comma-separated string
    let parsedSkills: string[] | undefined = undefined;
    if (validated.skills !== undefined) {
      if (Array.isArray(validated.skills)) {
        parsedSkills = validated.skills;
      } else if (typeof validated.skills === "string") {
        parsedSkills = validated.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // 3. Upsert studentProfiles
    const existing = await db
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, user.id));

    const profileData: any = {};
    if (validated.university !== undefined) profileData.university = validated.university.trim();
    if (validated.department !== undefined) profileData.department = validated.department.trim();
    if (validated.studentId !== undefined) profileData.studentId = validated.studentId.trim();
    if (validated.academicYear !== undefined) profileData.academicYear = validated.academicYear.trim();
    if (validated.experienceLevel !== undefined) profileData.experienceLevel = validated.experienceLevel;
    if (validated.track !== undefined) profileData.track = validated.track;
    if (validated.bio !== undefined) profileData.bio = validated.bio.trim();
    if (validated.githubUrl !== undefined) profileData.githubUrl = validated.githubUrl.trim();
    if (validated.linkedinUrl !== undefined) profileData.linkedinUrl = validated.linkedinUrl.trim();
    if (validated.portfolioUrl !== undefined) profileData.portfolioUrl = validated.portfolioUrl.trim();
    if (parsedSkills !== undefined) profileData.skills = parsedSkills;
    profileData.updatedAt = new Date();

    if (existing.length > 0) {
      await db
        .update(schema.studentProfiles)
        .set(profileData)
        .where(eq(schema.studentProfiles.userId, user.id));
    } else {
      await db.insert(schema.studentProfiles).values({
        id: `sp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: user.id,
        ...profileData,
      });
    }

    // Fetch updated record
    const updatedProfiles = await db
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, user.id));

    return NextResponse.json({
      success: true,
      message: "Student profile updated successfully",
      data: {
        name: validated.name?.trim() || user.name,
        profile: updatedProfiles[0] || null,
      },
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return internalErrorResponse(error, "/api/student/profile PATCH");
  }
}
