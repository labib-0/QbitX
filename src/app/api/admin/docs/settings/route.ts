import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { DocsSettingsService } from "@/services/docs/DocsSettingsService";
import { getDb, schema } from "@/server/db";
import { z } from "zod";
import { internalErrorResponse } from "@/server/http/api-error";

const updateDocsSettingsSchema = z.object({
  isPublic: z.boolean().optional(),
  schedule: z
    .object({
      enabled: z.boolean().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      overrideMode: z.enum(["auto", "force_public", "force_private"]).optional(),
      judgingNotice: z.string().optional(),
    })
    .optional(),
  teamName: z.string().optional(),
  teamTagline: z.string().optional(),
  customNoticeMessage: z.string().optional(),
  teamMembers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        role: z.string(),
        email: z.string(),
        avatarUrl: z.string(),
        affiliation: z.string(),
        bio: z.string(),
        githubUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        badge: z.string().optional(),
      })
    )
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const settings = DocsSettingsService.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    if (error.name === "ForbiddenError") {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }
    return internalErrorResponse(error, "/api/admin/docs/settings");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminContext = await requireAdmin();
    const body = await request.json();
    const validated = updateDocsSettingsSchema.parse(body);

    const updated = DocsSettingsService.updateSettings(validated as any);

    // Record audit log
    try {
      const db = getDb();
      await db.insert(schema.auditLogs).values({
        id: `audit-docs-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        actorId: adminContext.user.id,
        actorName: adminContext.user.name || "Admin",
        actorRole: adminContext.user.role || "admin",
        actionType: "DOCS_SETTINGS_UPDATED",
        action: "Updated documentation & pitch deck publishing controls",
        details: `Docs Mode: ${updated.schedule.overrideMode}, Schedule: ${updated.schedule.enabled ? "Active" : "Disabled"} (${updated.schedule.startDate} to ${updated.schedule.endDate})`,
        ipAddress: request.headers.get("x-forwarded-for") || "internal",
        createdAt: new Date(),
      });
    } catch (auditErr) {
      console.warn("Failed to write docs settings audit log:", auditErr);
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Documentation and pitch deck publishing controls updated successfully.",
    });
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
    return internalErrorResponse(error, "/api/admin/docs/settings");
  }
}
