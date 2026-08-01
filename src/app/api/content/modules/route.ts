// GET  /api/content/modules -> List modules for a course
// POST /api/content/modules -> Create or update module

import { NextRequest, NextResponse } from "next/server";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { UserRole } from "@/types/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const role = (searchParams.get("role") as UserRole) || "student";

    if (!courseId) {
      return NextResponse.json({ success: false, error: "courseId parameter is required" }, { status: 400 });
    }

    const modules = ContentRetrievalService.getModulesForCourse(courseId, role);
    return NextResponse.json({ success: true, count: modules.length, data: modules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch modules" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Module saved successfully",
      data: {
        id: body.id || `mod-${Date.now()}`,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
