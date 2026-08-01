// POST /api/automation/events -> Publish platform events to EventBus

import { NextRequest, NextResponse } from "next/server";
import { EventBus } from "@/services/automation/EventBus";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, actorId, actorRole, targetId, targetType, data } = body;

    if (!eventType || !actorId) {
      return NextResponse.json({ success: false, error: "eventType and actorId are required" }, { status: 400 });
    }

    const eventPayload = await EventBus.publish({
      eventType,
      actorId,
      actorRole: actorRole || "student",
      targetId,
      targetType,
      data,
    });

    return NextResponse.json({ success: true, data: eventPayload });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Event publishing failed" }, { status: 500 });
  }
}
