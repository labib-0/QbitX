# QbitX System Architecture (Release Candidate RC-1)

## 1. High-Level Architecture Overview

QbitX is built on a **decoupled, event-driven micro-service architecture** inside Next.js 16 (App Router) with React 19 and TypeScript. The application cleanly separates UI components from core business logic services, allowing seamless integration across Student, Mentor, and Admin portals.

```mermaid
graph TD
    Client[Next.js 16 Client Portal: React 19 + TypeScript] --> Auth[AuthContext & Supabase Auth Layer]
    Auth --> RBAC[PermissionService: Role-Based Access Control]

    RBAC --> StudentPortal[Student Portal: /student/*]
    RBAC --> MentorPortal[Mentor Portal: /mentor/*]
    RBAC --> AdminPortal[Admin Portal: /admin/*]

    StudentPortal --> ContentService[ContentRetrievalService & Workspace API]
    MentorPortal --> AuthoringService[ContentAuthoringService & Rubric Grading]
    AdminPortal --> AdminDataService[AdminDataService & AuditLogService]

    ContentService --> EventBus[Central EventBus]
    AuthoringService --> EventBus
    AdminDataService --> EventBus

    EventBus --> WorkflowEngine[WorkflowEngine: Trigger -> Condition -> Action]
    WorkflowEngine --> GamificationEngine[GamificationAutomation: XP, Streaks, Badges]
    WorkflowEngine --> AuditLogger[AutomationAuditService]
```

---

## 2. Student Portal Execution Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Student Workspace UI
    participant Service as ContentRetrievalService
    participant EventBus as EventBus
    participant Workflow as WorkflowEngine

    Student->>UI: Complete Lesson 3 ("Binary Search Trees")
    UI->>Service: markLessonComplete(lessonId)
    Service->>EventBus: publish("LESSON_COMPLETED", payload)
    EventBus->>Workflow: processEvent("LESSON_COMPLETED")
    Workflow->>Workflow: Award +50 XP & Update 14-Day Streak
    Workflow-->>UI: Update UI XP Bar & Streak Badge
```

---

## 3. Mentor Course Authoring & Success Flow

```mermaid
sequenceDiagram
    autonumber
    actor Mentor
    participant Studio as Course Builder Studio
    participant Validator as PublishingValidationEngine
    participant ContentDB as Content Authoring Service
    participant Audit as AuditLogService

    Mentor->>Studio: Author Lesson & Save Draft
    Mentor->>Validator: Run Pre-Publish Checklist
    Validator-->>Studio: Validation 100% Passed (3/3 Checks)
    Mentor->>ContentDB: Publish Course (v1.2)
    ContentDB->>Audit: logAction("COURSE_PUBLISHED")
    Audit-->>Studio: Live in Student Portal
```

---

## 4. Automation Engine & Event Pipeline

```mermaid
graph LR
    Event[Platform Action] --> EventBus[EventBus: Publish Event]
    EventBus --> RuleEngine{WorkflowEngine: Match Active Rules}
    RuleEngine -->|Conditions Met| ActionList[Execute Actions]

    ActionList --> Action1[Issue Certificate]
    ActionList --> Action2[Award 500 XP]
    ActionList --> Action3[Unlock Badge]
    ActionList --> Action4[Dispatch In-App Notification]
    ActionList --> Action5[Log Execution Audit]
```
