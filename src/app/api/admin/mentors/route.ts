import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or } from "drizzle-orm";
import { z } from "zod";

const updateMentorStatusSchema = z.object({
  mentorId: z.string().min(1, "Mentor ID is required"),
  isApproved: z.boolean(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const mentors = await db
      .select({
        id: schema.mentorProfiles.id,
        userId: schema.mentorProfiles.userId,
        name: schema.users.name,
        email: schema.users.email,
        image: schema.users.image,
        headline: schema.mentorProfiles.headline,
        bio: schema.mentorProfiles.bio,
        expertise: schema.mentorProfiles.expertise,
        company: schema.mentorProfiles.company,
        yearsOfExperience: schema.mentorProfiles.yearsOfExperience,
        hourlyRate: schema.mentorProfiles.hourlyRate,
        isApproved: schema.mentorProfiles.isApproved,
        rating: schema.mentorProfiles.rating,
        reviewCount: schema.mentorProfiles.reviewCount,
      })
      .from(schema.mentorProfiles)
      .innerJoin(schema.users, eq(schema.mentorProfiles.userId, schema.users.id));

    return NextResponse.json({
      success: true,
      data: mentors,
      total: mentors.length,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const validated = updateMentorStatusSchema.parse(body);

    const profiles = await db
      .select()
      .from(schema.mentorProfiles)
      .where(
        or(
          eq(schema.mentorProfiles.id, validated.mentorId),
          eq(schema.mentorProfiles.userId, validated.mentorId)
        )
      );

    const profile = profiles[0];
    if (!profile) {
      return NextResponse.json({ success: false, error: "Mentor profile not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(schema.mentorProfiles)
      .set({ isApproved: validated.isApproved })
      .where(eq(schema.mentorProfiles.id, profile.id))
      .returning();

    // If approved, ensure user role is updated to mentor
    if (validated.isApproved) {
      await db
        .update(schema.users)
        .set({ role: "mentor" })
        .where(eq(schema.users.id, profile.userId));
    }

    // Audit log
    await db.insert(schema.auditLogs).values({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      actorId: admin.user.id,
      action: "MENTOR_APPROVAL_STATUS_UPDATE",
      actionType: "MENTOR_APPROVAL_STATUS_UPDATE",
      targetId: profile.userId,
      details: {
        isApproved: validated.isApproved,
      },
    });

    return NextResponse.json({
      success: true,
      message: validated.isApproved ? "Mentor approved successfully" : "Mentor revoked/rejected",
      data: updated,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update mentor" },
      { status: 500 }
    );
  }
}
