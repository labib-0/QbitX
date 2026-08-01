// GET  /api/content/resources -> Fetch resource by ID or list all
// POST /api/content/resources -> Attach new learning resource

import { NextRequest, NextResponse } from "next/server";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { MOCK_RESOURCES } from "@/lib/contentData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const resource = ContentRetrievalService.getResourceById(id);
      if (!resource) {
        return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: resource });
    }

    return NextResponse.json({ success: true, count: MOCK_RESOURCES.length, data: MOCK_RESOURCES });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Resource attached successfully",
      data: {
        id: `res-${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid resource body" }, { status: 400 });
  }
}
