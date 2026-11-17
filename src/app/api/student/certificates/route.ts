import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, and, or, gte } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";

export async function GET() {
  try {
    const { user } = await requireUser();

    // Query enrollments where the course is completed
    const completedEnrollments = await db
      .select({
        enrollmentId: schema.enrollments.id,
        courseId: schema.courses.id,
        courseTitle: schema.courses.title,
        courseSlug: schema.courses.slug,
        category: schema.courses.category,
        difficulty: schema.courses.difficulty,
        instructorName: schema.courses.instructorName,
        learningOutcomes: schema.courses.learningOutcomes,
        progressPercent: schema.enrollments.progressPercent,
        completedAt: schema.enrollments.completedAt,
        enrolledAt: schema.enrollments.enrolledAt,
      })
      .from(schema.enrollments)
      .innerJoin(schema.courses, eq(schema.enrollments.courseId, schema.courses.id))
      .where(
        and(
          eq(schema.enrollments.userId, user.id),
          or(
            eq(schema.enrollments.status, "completed"),
            gte(schema.enrollments.progressPercent, 100)
          )
        )
      );

    const certificates = completedEnrollments.map((enr: any) => {
      const credId = `QBITX-${enr.courseId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}-${user.id.replace(/[^a-zA-Z0-9]/g, "").substring(0, 8).toUpperCase()}`;
      const issuedDate = enr.completedAt
        ? new Date(enr.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : new Date(enr.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      return {
        id: `cert-${enr.enrollmentId}`,
        credentialId: credId,
        title: `${enr.courseTitle} Certificate of Completion`,
        courseTitle: enr.courseTitle,
        issuer: "QbitX Engineering Academy",
        instructor: enr.instructorName || "Faculty Instructor",
        studentName: user.name,
        date: issuedDate,
        status: "Verified",
        skills: Array.isArray(enr.learningOutcomes) && enr.learningOutcomes.length > 0
          ? enr.learningOutcomes
          : [enr.category, enr.difficulty],
        shareUrl: `/verify-certificate?id=${credId}`,
      };
    });

    return NextResponse.json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    return internalErrorResponse(error, "/api/student/certificates");
  }
}
