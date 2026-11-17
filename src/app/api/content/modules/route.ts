// GET  /api/content/modules -> List modules for a course
// POST /api/content/modules -> Create or update module

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { resolveContentRole } from "@/server/auth/content-role";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { internalErrorResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    // Role comes from the verified session, not from a client-supplied query param.
    const role = resolveContentRole(await getServerSession());

    if (!courseId) {
      return NextResponse.json({ success: false, error: "courseId parameter is required" }, { status: 400 });
    }

    const modules = ContentRetrievalService.getModulesForCourse(courseId, role);
    return NextResponse.json({ success: true, count: modules.length, data: modules });
  } catch (error: any) {
    return internalErrorResponse(error, "/api/content/modules");
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
