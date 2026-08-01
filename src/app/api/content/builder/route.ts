// POST /api/content/builder -> Course authoring & pre-publish validation API handler

import { NextRequest, NextResponse } from "next/server";
import { ContentAuthoringService } from "@/services/content/ContentAuthoringService";
import { PublishingValidationEngine } from "@/services/content/PublishingValidationEngine";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, title, category, courseId, createdBy } = body;

    if (action === "create_course") {
      const course = ContentAuthoringService.createCourse(title || "Untitled Course", category || "Computer Science", createdBy || "usr-mentor-1");
      return NextResponse.json({ success: true, data: course });
    }

    if (action === "validate_publishing") {
      const course = ContentRetrievalService.getCourseById(courseId || "crs-1", "mentor");
      if (!course) return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });

      const validation = PublishingValidationEngine.validateCourse(course);
      return NextResponse.json({ success: true, data: validation });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Builder API error" }, { status: 500 });
  }
}
