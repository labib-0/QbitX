// GET  /api/content/activities -> Fetch activity by ID
// POST /api/content/activities -> Create/update learning activity

import { NextRequest, NextResponse } from "next/server";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { MOCK_ACTIVITIES } from "@/lib/contentData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const activity = ContentRetrievalService.getActivityById(id);
      if (!activity) {
        return NextResponse.json({ success: false, error: "Activity not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: activity });
    }

    return NextResponse.json({ success: true, count: MOCK_ACTIVITIES.length, data: MOCK_ACTIVITIES });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Activity registered in lesson hierarchy",
      data: {
        id: body.id || `act-${Date.now()}`,
        ...body,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
