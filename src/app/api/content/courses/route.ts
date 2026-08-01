// GET  /api/content/courses -> List/Get courses (filtered by trackId, role)
// POST /api/content/courses -> Create or update course

import { NextRequest, NextResponse } from "next/server";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { UserRole } from "@/types/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get("role") as UserRole) || "student";
    const trackId = searchParams.get("trackId") || undefined;
    const idOrSlug = searchParams.get("id") || searchParams.get("slug");

    if (idOrSlug) {
      const course = ContentRetrievalService.getCourseByIdOrSlug(idOrSlug, role);
      if (!course) {
        return NextResponse.json({ success: false, error: "Course not found or access denied" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: course });
    }

    const courses = ContentRetrievalService.getCourses(trackId, role);
    return NextResponse.json({ success: true, count: courses.length, data: courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Course registered/updated in content architecture",
      data: {
        id: body.id || `crs-${Date.now()}`,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
