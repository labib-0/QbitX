// POST /api/automation/jobs -> Trigger scheduled cron jobs

import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/session";
import { JobScheduler } from "@/services/automation/JobScheduler";

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
    await requireAdmin();
    return NextResponse.json({ success: true, data: JobScheduler.getJobs() });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { success: false, error: error.message || "Failed to list jobs" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Batch job execution is an administrative action, not a public trigger.
    await requireAdmin();
    const result = await JobScheduler.runScheduledJobs();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    const authResponse = authorizationErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { success: false, error: error.message || "Job execution failed" },
      { status: 500 }
    );
  }
}
