import { NextRequest, NextResponse } from "next/server";
import { getServerSession, requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, and, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

const mentorProfileSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters").max(120),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(2000),
  expertise: z.array(z.string()).min(1, "Specify at least one area of expertise"),
  company: z.string().optional().or(z.literal("")),
  yearsOfExperience: z.number().int().min(0).max(50).default(1),
  hourlyRate: z.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const expertiseFilter = searchParams.get("expertise");

    // Fetch approved mentors with user profile information
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
        rating: schema.mentorProfiles.rating,
        reviewCount: schema.mentorProfiles.reviewCount,
        isApproved: schema.mentorProfiles.isApproved,
      })
      .from(schema.mentorProfiles)
      .innerJoin(schema.users, eq(schema.mentorProfiles.userId, schema.users.id))
      .where(eq(schema.mentorProfiles.isApproved, true));

    let filteredMentors = mentors;

    if (search) {
      const searchLower = search.toLowerCase();
      filteredMentors = filteredMentors.filter(
        (m: any) =>
          m.name.toLowerCase().includes(searchLower) ||
          m.headline?.toLowerCase().includes(searchLower) ||
          m.company?.toLowerCase().includes(searchLower) ||
          (Array.isArray(m.expertise) &&
            m.expertise.some((e: string) => e.toLowerCase().includes(searchLower)))
      );
    }

    if (expertiseFilter) {
      const expLower = expertiseFilter.toLowerCase();
      filteredMentors = filteredMentors.filter(
        (m: any) =>
          Array.isArray(m.expertise) &&
          m.expertise.some((e: string) => e.toLowerCase() === expLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredMentors,
      total: filteredMentors.length,
    });
  } catch (error: any) {
    return internalErrorResponse(error, "/api/mentors");
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireUser();
    const body = await request.json();
    const validated = mentorProfileSchema.parse(body);

    const isAutoApproved =
      context.user.role === "admin" || context.user.role === "super_admin";

    const existingProfile = await db
      .select()
      .from(schema.mentorProfiles)
      .where(eq(schema.mentorProfiles.userId, context.user.id));

    let resultProfile;
    if (existingProfile.length > 0) {
      const [updated] = await db
        .update(schema.mentorProfiles)
        .set({
          headline: validated.headline,
          bio: validated.bio,
          expertise: validated.expertise,
          company: validated.company || null,
          yearsOfExperience: validated.yearsOfExperience,
          hourlyRate: validated.hourlyRate,
        })
        .where(eq(schema.mentorProfiles.id, existingProfile[0].id))
        .returning();
      resultProfile = updated;
    } else {
      const profileId = `mp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const [created] = await db
        .insert(schema.mentorProfiles)
        .values({
          id: profileId,
          userId: context.user.id,
          fullName: context.user.name,
          headline: validated.headline,
          bio: validated.bio,
          expertise: validated.expertise,
          company: validated.company || null,
          yearsOfExperience: validated.yearsOfExperience,
          hourlyRate: validated.hourlyRate,
          isApproved: isAutoApproved,
        })
        .returning();
      resultProfile = created;
    }

    return NextResponse.json({
      success: true,
      message: isAutoApproved
        ? "Mentor profile updated and approved."
        : "Mentor application submitted. Pending administrative approval.",
      data: resultProfile,
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
    return internalErrorResponse(error, "/api/mentors");
  }
}
