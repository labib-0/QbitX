/**
 * src/services/automation/WorkflowEngine.ts
 * Trigger -> Condition -> Action workflow engine processing configurable automation rules
 */

import { EventPayload, WorkflowRule, WorkflowCondition } from "@/types/automation";
import { EventBus } from "./EventBus";
import { GamificationAutomation } from "./GamificationAutomation";
import { NotificationAutomation } from "./NotificationAutomation";
import { AutomationAuditService } from "./AutomationAuditService";

export const DEFAULT_WORKFLOW_RULES: WorkflowRule[] = [
  {
    id: "rule-course-complete",
    name: "Course Completion Pipeline",
    description: "Issue certificate, award 500 XP, unlock badge, and notify student when a course is 100% completed.",
    trigger: "COURSE_COMPLETED",
    conditions: [
      { field: "completionPct", operator: "equals", value: 100 },
    ],
    actions: [
      { type: "issue_certificate", params: {} },
      { type: "award_xp", params: { amount: 500 } },
      { type: "unlock_badge", params: { badgeId: "badge-course-master" } },
      { type: "send_notification", params: {} },
      { type: "log_audit", params: {} },
    ],
    isEnabled: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "rule-lesson-complete",
    name: "Lesson Progress XP Pipeline",
    description: "Award XP and update student streak on lesson completion.",
    trigger: "LESSON_COMPLETED",
    conditions: [],
    actions: [
      { type: "award_xp", params: { amount: 50 } },
      { type: "log_audit", params: {} },
    ],
    isEnabled: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

let rulesStore: WorkflowRule[] = [...DEFAULT_WORKFLOW_RULES];

export class WorkflowEngine {
  static init() {
    // Subscribe Workflow Engine to all platform events via EventBus
    const eventTypes = DEFAULT_WORKFLOW_RULES.map((r) => r.trigger);
    eventTypes.forEach((eventType) => {
      EventBus.subscribe(eventType, async (event) => {
        await WorkflowEngine.processEvent(event);
      });
    });
  }

  static getRules(): WorkflowRule[] {
    return rulesStore;
  }

  /**
   * Process a platform event against active workflow rules
   */
  static async processEvent(event: EventPayload): Promise<void> {
    const startTime = Date.now();
    const matchingRules = rulesStore.filter((r) => r.isEnabled && r.trigger === event.eventType);

    for (const rule of matchingRules) {
      // Evaluate conditions
      const conditionMet = rule.conditions.every((cond) => {
        const val = event.data?.[cond.field];
        if (cond.operator === "equals") return val === cond.value;
        return true;
      });

      if (conditionMet) {
        // Execute actions
        for (const action of rule.actions) {
          if (action.type === "award_xp") {
            GamificationAutomation.processXPEvent(event);
          } else if (action.type === "send_notification") {
            NotificationAutomation.dispatchNotificationForEvent(event);
          }
        }

        // Audit log execution
        AutomationAuditService.log({
          ruleId: rule.id,
          eventType: event.eventType,
          executionTimeMs: Date.now() - startTime,
          status: "success",
          retryCount: 0,
          affectedEntityId: event.targetId || event.actorId,
          details: `Processed workflow rule "${rule.name}" for event ${event.eventType}.`,
        });
      }
    }
  }
}

// Auto-initialize subscriptions
WorkflowEngine.init();
