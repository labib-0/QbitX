// GET  /api/content/tracks -> List all tracks (filtered by user role)
// POST /api/content/tracks -> Create/Draft a new track

import { NextRequest, NextResponse } from "next/server";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { UserRole } from "@/types/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get("role") as UserRole) || "student";
    const idOrSlug = searchParams.get("id") || searchParams.get("slug");

    if (idOrSlug) {
      const track = ContentRetrievalService.getTrackByIdOrSlug(idOrSlug, role);
      if (!track) {
        return NextResponse.json({ success: false, error: "Track not found or access denied" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: track });
    }

    const tracks = ContentRetrievalService.getTracks(role);
    return NextResponse.json({ success: true, count: tracks.length, data: tracks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch tracks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Track metadata created successfully (Draft mode)",
      data: {
        id: `trk-${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  }
}
