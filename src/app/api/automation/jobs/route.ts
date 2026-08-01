// POST /api/automation/jobs -> Trigger scheduled cron jobs

import { NextRequest, NextResponse } from "next/server";
import { JobScheduler } from "@/services/automation/JobScheduler";

export async function GET() {
  return NextResponse.json({ success: true, data: JobScheduler.getJobs() });
}

export async function POST() {
  try {
    const result = await JobScheduler.runScheduledJobs();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Job execution failed" }, { status: 500 });
  }
}
