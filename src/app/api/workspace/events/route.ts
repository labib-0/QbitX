// POST /api/workspace/events -> Dispatch student learning event analytics

import { NextRequest, NextResponse } from "next/server";
import { LearningAnalytics } from "@/services/workspace/LearningAnalytics";
import { badRequestResponse } from "@/server/http/api-error";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, lessonId, eventType, payload } = body;

    if (!userId || !courseId || !eventType) {
      return NextResponse.json({ success: false, error: "userId, courseId, and eventType required" }, { status: 400 });
    }

    const event = LearningAnalytics.logEvent({
      userId,
      courseId,
      lessonId,
      eventType,
      payload,
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    return badRequestResponse(error, "/api/workspace/events");
  }
}
