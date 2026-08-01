"use client";

/**
 * src/services/automation/JobScheduler.ts
 * Background Cron Job Scheduler for Daily, Weekly, and Monthly recurring platform automation
 */

import { JobScheduleSpec } from "@/types/automation";
import { AssignmentAutomation } from "./AssignmentAutomation";
import { SummaryAutomation } from "./SummaryAutomation";
import { AutomationAuditService } from "./AutomationAuditService";

export const MOCK_SCHEDULED_JOBS: JobScheduleSpec[] = [
  {
    id: "job-daily-overdue",
    name: "Daily Overdue Assignment & Lock Check",
    frequency: "daily",
    lastRunAt: "2026-08-01T02:00:00Z",
    nextRunAt: "2026-08-02T02:00:00Z",
    status: "idle",
  },
  {
    id: "job-weekly-mentor-digest",
    name: "Weekly Mentor Class Performance Digest",
    frequency: "weekly",
    lastRunAt: "2026-07-27T00:00:00Z",
    nextRunAt: "2026-08-03T00:00:00Z",
    status: "idle",
  },
  {
    id: "job-daily-admin-health",
    name: "Daily Admin System Health Summary",
    frequency: "daily",
    lastRunAt: "2026-08-01T01:00:00Z",
    nextRunAt: "2026-08-02T01:00:00Z",
    status: "idle",
  },
];

let jobsStore: JobScheduleSpec[] = [...MOCK_SCHEDULED_JOBS];

export class JobScheduler {
  static getJobs(): JobScheduleSpec[] {
    return jobsStore;
  }

  /**
   * Run all pending scheduled cron jobs manually or via external webhook
   */
  static async runScheduledJobs(): Promise<{ executedCount: number; results: any[] }> {
    const results: any[] = [];

    for (const job of jobsStore) {
      job.status = "running";
      const start = Date.now();

      try {
        if (job.id === "job-daily-overdue") {
          const overdueRes = AssignmentAutomation.checkOverdueAssignments();
          results.push({ job: job.name, data: overdueRes });
        } else if (job.id === "job-weekly-mentor-digest") {
          const digestRes = SummaryAutomation.generateWeeklyMentorDigest("usr-mentor-1");
          results.push({ job: job.name, data: digestRes });
        } else if (job.id === "job-daily-admin-health") {
          const healthRes = SummaryAutomation.generateDailyAdminHealthSummary();
          results.push({ job: job.name, data: healthRes });
        }

        job.status = "success";
        job.lastRunAt = new Date().toISOString();

        AutomationAuditService.log({
          ruleId: job.id,
          eventType: "LOGIN",
          executionTimeMs: Date.now() - start,
          status: "success",
          retryCount: 0,
          details: `Executed scheduled cron job "${job.name}".`,
        });
      } catch (error) {
        job.status = "failed";
      }
    }

    return { executedCount: jobsStore.length, results };
  }
}
