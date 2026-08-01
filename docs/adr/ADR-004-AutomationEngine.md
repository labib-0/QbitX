# ADR-004: Event-Driven Central Automation Engine & Queue Abstraction

- **Status**: Accepted
- **Date**: 2026-08-01
- **Deciders**: QbitX Architecture Team

---

## Problem
Background tasks (certificate issuance, XP awards, streak updates, overdue assignment locks, mentor digests) were tightly coupled to UI action handlers.

---

## Options Considered
1. **Direct Synchronous Action Calls**: UI handlers execute all side effects inline. Leads to slow UI response times and tight coupling.
2. **EventBus + Trigger-Condition-Action WorkflowEngine + QueueManager**: Decoupled publisher/subscriber model. UI publishes events, WorkflowEngine processes rules asynchronously.

---

## Decision
Adopt **Decoupled EventBus + WorkflowEngine + Queue-Ready Abstraction**.

---

## Consequences
- **Positive**:
  - Modules publish events (`LESSON_COMPLETED`, `COURSE_COMPLETED`) without knowing which rules execute.
  - Ready for drop-in Redis / BullMQ integration in production.
- **Negative / Trade-offs**:
  - Requires maintaining event payloads and subscriber lists.
