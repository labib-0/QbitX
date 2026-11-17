// POST /api/automation/events -> Publish platform events to EventBus

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/auth/session";
import { EventBus } from "@/services/automation/EventBus";

function authorizationErrorResponse(error: any) {
  if (error?.name === "UnauthorizedError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
  if (error?.name === "ForbiddenError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 403 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Automation events can trigger workflows, notifications, and audit trails.
    // Only verified administrators may publish them, and the actor is taken
    // from the session — never from the request body.
    const context = await requireRole(["admin", "super_admin"]);

    const body = await request.json();
    const { eventType, targetId, targetType, data } = body;

    if (!eventType) {
      return NextResponse.json(
        { success: false, error: "eventType is required" },
        { status: 400 }
      );
    }

    const eventPayload = await EventBus.publish({
      eventType,
      actorId: context.user.id,
      actorRole: context.user.role,
      targetId,
      targetType,
      data,
    });

    return NextResponse.json({ success: true, data: eventPayload });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { success: false, error: error.message || "Event publishing failed" },
      { status: 500 }
    );
  }
}
