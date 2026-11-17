import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const onboardingSchema = z.object({
  university: z.string().optional(),
  department: z.string().optional(),
  studentId: z.string().optional(),
  academicYear: z.string().optional(),
  experienceLevel: z.string().optional(),
  track: z.string().optional(),
  learningGoals: z.array(z.string()).optional(),
  selectedSkills: z.array(z.string()).optional(),
  careerInterests: z.array(z.string()).optional(),
  weeklyHours: z.string().optional(),
  bio: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireUser();
    const body = await request.json();
    const data = onboardingSchema.parse(body);

    const existing = await db
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, user.id));

    if (existing.length > 0) {
      await db
        .update(schema.studentProfiles)
        .set({
          ...data,
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(schema.studentProfiles.userId, user.id));
    } else {
      await db.insert(schema.studentProfiles).values({
        id: `sp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: user.id,
        ...data,
        onboardingCompleted: true,
      });
    }

    return NextResponse.json({ success: true, message: "Onboarding profile saved successfully." });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to save profile." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { user } = await requireUser();
    const profiles = await db
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, user.id));

    return NextResponse.json({
      success: true,
      data: profiles[0] || null,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || "Failed to load profile." }, { status: 500 });
  }
}
