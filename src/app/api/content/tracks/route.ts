// GET  /api/content/tracks -> List all tracks (filtered by user role)
// POST /api/content/tracks -> Create/Draft a new track

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { resolveContentRole } from "@/server/auth/content-role";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { internalErrorResponse } from "@/server/http/api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Role comes from the verified session, not from a client-supplied query param.
    const role = resolveContentRole(await getServerSession());
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
    return internalErrorResponse(error, "/api/content/tracks");
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
