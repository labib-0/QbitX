// GET  /api/content/progress -> Query student progress records or summary
// POST /api/content/progress -> Record/update progress or completion for an entity

import { NextRequest, NextResponse } from "next/server";
import { ProgressService } from "@/services/content/ProgressService";
import { ProgressStatus } from "@/types/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "usr-student-demo";
    const summary = searchParams.get("summary");
    const entityId = searchParams.get("entityId") || undefined;
    const entityType = (searchParams.get("entityType") as any) || undefined;

    if (summary === "true") {
      const stats = ProgressService.getStudentProgressSummary(userId);
      return NextResponse.json({ success: true, data: stats });
    }

    const records = ProgressService.getProgress(userId, entityId, entityType);
    return NextResponse.json({ success: true, count: records.length, data: records });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = "usr-student-demo",
      entityId,
      entityType,
      status,
      scorePercentage,
      additionalTimeSeconds,
      watchPercentage,
      verifiedBy,
    } = body as {
      userId?: string;
      entityId: string;
      entityType: "track" | "course" | "module" | "lesson" | "activity";
      status: ProgressStatus;
      scorePercentage?: number;
      additionalTimeSeconds?: number;
      watchPercentage?: number;
      verifiedBy?: string;
    };

    if (!entityId || !entityType || !status) {
      return NextResponse.json(
        { success: false, error: "entityId, entityType, and status are required fields" },
        { status: 400 }
      );
    }

    const updatedProgress = ProgressService.recordProgress({
      userId,
      entityId,
      entityType,
      status,
      scorePercentage,
      additionalTimeSeconds,
      watchPercentage,
      verifiedBy,
    });

    return NextResponse.json({ success: true, data: updatedProgress });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to record progress" }, { status: 500 });
  }
}
