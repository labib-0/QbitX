import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { auditLogs } from "@/server/db/schema";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

const DEFAULT_FLAGS: FeatureFlag[] = [
  { id: "flag-1", key: "ai_mentor", name: "AI Mentor Engine 24/7", description: "Enable AI Assistant for students & mentors", isEnabled: true },
  { id: "flag-2", key: "team_kanban", name: "Team Capstone Kanban", description: "Enable team sprint progress tracking", isEnabled: true },
  { id: "flag-3", key: "cert_auto_issue", name: "Certificate Auto-Issuance", description: "Automatically issue certificates on 100% progress", isEnabled: false },
  { id: "flag-4", key: "maintenance_mode", name: "Platform Maintenance Mode", description: "Restrict non-admin access for system upgrades", isEnabled: false },
];

function getFlags(): FeatureFlag[] {
  const g = globalThis as any;
  if (!g.__qbitx_feature_flags) {
    g.__qbitx_feature_flags = [...DEFAULT_FLAGS];
  }
  return g.__qbitx_feature_flags;
}

const updateFlagSchema = z.object({
  id: z.string().min(1),
  isEnabled: z.boolean(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const flags = getFlags();
    return NextResponse.json({ success: true, data: flags });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return internalErrorResponse(error, "/api/admin/settings");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminContext = await requireAdmin();
    const body = await request.json();
    const validated = updateFlagSchema.parse(body);

    const flags = getFlags();
    const target = flags.find((f) => f.id === validated.id);

    if (!target) {
      return NextResponse.json({ success: false, error: "Feature flag not found" }, { status: 404 });
    }

    target.isEnabled = validated.isEnabled;

    // Record audit log entry in database
    const db = getDb();
    await db.insert(auditLogs).values({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: adminContext.user.id,
      action: "FEATURE_FLAG_TOGGLED",
      details: `Admin changed feature flag '${target.name}' (${target.key}) to ${target.isEnabled ? "ENABLED" : "DISABLED"}`,
      ipAddress: request.headers.get("x-forwarded-for") || "internal",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: target });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message }, { status: 400 });
    }
    return internalErrorResponse(error, "/api/admin/settings");
  }
}
