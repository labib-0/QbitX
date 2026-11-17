// GET /api/automation/rules -> Retrieve active Trigger-Condition-Action workflow rules

import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { WorkflowEngine } from "@/services/automation/WorkflowEngine";
import { AutomationAuditService } from "@/services/automation/AutomationAuditService";
import { internalErrorResponse } from "@/server/http/api-error";

function authorizationErrorResponse(error: any) {
  if (error?.name === "UnauthorizedError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
  if (error?.name === "ForbiddenError") {
    return NextResponse.json({ success: false, error: error.message }, { status: 403 });
  }
  return null;
}

export async function GET() {
  try {
    // Workflow rules and automation audit logs are administrative internals.
    await requireAdmin();

    return NextResponse.json({
      success: true,
      data: {
        rules: WorkflowEngine.getRules(),
        auditLogs: AutomationAuditService.getLogs(),
      },
    });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    return internalErrorResponse(error, "/api/automation/rules");
  }
}
