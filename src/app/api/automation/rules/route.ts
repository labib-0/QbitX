// GET /api/automation/rules -> Retrieve active Trigger-Condition-Action workflow rules

import { NextResponse } from "next/server";
import { WorkflowEngine } from "@/services/automation/WorkflowEngine";
import { AutomationAuditService } from "@/services/automation/AutomationAuditService";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      rules: WorkflowEngine.getRules(),
      auditLogs: AutomationAuditService.getLogs(),
    },
  });
}
