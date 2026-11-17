// GET /api/mentors/me -> Current user's mentor application/approval status

import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";

function authorizationErrorResponse(error: any) {
  if (error?.name === "UnauthorizedError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
  if (error?.name === "ForbiddenError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 403 });
  }
  return null;
}

export async function GET() {
  try {
    const { user } = await requireUser();

    const profiles = await db
      .select({
        id: schema.mentorProfiles.id,
        userId: schema.mentorProfiles.userId,
        fullName: schema.mentorProfiles.fullName,
        headline: schema.mentorProfiles.headline,
        expertise: schema.mentorProfiles.expertise,
        company: schema.mentorProfiles.company,
        yearsOfExperience: schema.mentorProfiles.yearsOfExperience,
        isApproved: schema.mentorProfiles.isApproved,
        availabilityStatus: schema.mentorProfiles.availabilityStatus,
        createdAt: schema.mentorProfiles.createdAt,
      })
      .from(schema.mentorProfiles)
      .where(eq(schema.mentorProfiles.userId, user.id));

    return NextResponse.json({
      success: true,
      role: user.role,
      data: profiles[0] ?? null,
    });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    return internalErrorResponse(error, "/api/mentors/me");
  }
}
