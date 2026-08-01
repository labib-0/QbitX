/**
 * src/types/content.ts
 * Unified Learning Content Architecture — Future-Proof Data Models
 */

// ─── Enums & Literals ────────────────────────────────────────────────────────

export type PublicationStatus = "draft" | "review" | "published" | "archived";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type Visibility = "public" | "enrolled_only" | "mentor_only" | "private";

export type BloomsTaxonomyLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export type ActivityType =
  | "video"
  | "reading"
  | "interactive_slides"
  | "quiz"
  | "assignment"
  | "coding_lab"
  | "project"
  | "discussion"
  | "resource"
  | "live_session";

export type ResourceType =
  | "pdf"
  | "video"
  | "external_link"
  | "github_repo"
  | "image"
  | "slides"
  | "zip"
  | "template"
  | "dataset";

export type AssessmentType =
  | "quiz"
  | "coding_challenge"
  | "assignment"
  | "peer_review"
  | "reflection";

export type GradingMethod = "auto" | "mentor" | "peer" | "completion";

export type CompletionRuleType =
  | "complete_all_lessons"
  | "pass_all_quizzes"
  | "finish_project"
  | "submit_assignment"
  | "mentor_approval"
  | "min_watch_pct"
  | "custom_combo";

export type ProgressStatus =
  | "enrolled"
  | "started"
  | "in_progress"
  | "paused"
  | "completed"
  | "verified";

export type UserRole = "student" | "mentor" | "admin";

// ─── Base Content Metadata ───────────────────────────────────────────────────

export interface ContentMetadata {
  id: string; // UUID
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  coverImage?: string;
  icon?: string;
  tags: string[];
  category: string;
  difficulty: Difficulty;
  estimatedDurationMinutes: number;
  language: string;
  visibility: Visibility;
  status: PublicationStatus;
  version: string; // e.g. "1.0.0"
  createdBy: string; // User ID
  updatedBy: string; // User ID
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

// ─── AI Metadata ─────────────────────────────────────────────────────────────

export interface AIMetadata {
  learningObjectives: string[];
  skillsTaught: string[];
  prerequisites: string[];
  keywords: string[];
  difficultyScore: number; // 1-100 scale
  bloomsTaxonomyLevel: BloomsTaxonomyLevel;
  estimatedLearningMinutes: number;
  relatedLessonIds: string[];
  suggestedNextLessonIds: string[];
}

// ─── Content Permissions ────────────────────────────────────────────────────

export interface ContentPermissions {
  ownerId: string;
  editorIds: string[];
  reviewerIds: string[];
  mentorAccess: boolean;
  studentAccess: boolean;
  adminAccess: boolean;
}

// ─── Learning Resource / Attachment ─────────────────────────────────────────

export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  fileSizeBytes?: number;
  mimeType?: string;
  metadata?: Record<string, unknown>;
  isDownloadable: boolean;
  createdBy: string;
  createdAt: string;
}

// ─── Assessment Foundation ───────────────────────────────────────────────────

export interface RubricCriterion {
  id: string;
  criterion: string;
  maxPoints: number;
  description?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  maxAttempts?: number;
  gradingMethod: GradingMethod;
  passingScorePercentage: number;
  deadline?: string;
  rubric?: RubricCriterion[];
  instructions: string;
  questionsPayload?: Record<string, unknown>; // JSON payload for quizzes/coding labs
}

// ─── Completion Rules ────────────────────────────────────────────────────────

export interface CompletionRule {
  id: string;
  type: CompletionRuleType;
  title: string;
  description: string;
  minWatchPercentage?: number;
  requiredAssessmentIds?: string[];
  requiredLessonIds?: string[];
  customRuleExpression?: string;
  requiresMentorApproval: boolean;
}

// ─── Learning Hierarchy Entities ─────────────────────────────────────────────

export interface Activity {
  id: string; // Activity ID
  lessonId: string; // Relational link
  orderIndex: number;
  type: ActivityType;
  metadata: ContentMetadata;
  contentPayload: {
    videoUrl?: string;
    readingMarkdown?: string;
    slideEmbedUrl?: string;
    quizData?: Record<string, unknown>;
    starterCode?: string;
    solutionCode?: string;
    projectInstructions?: string;
    discussionPrompt?: string;
    liveSessionUrl?: string;
    liveSessionStartTime?: string;
  };
  assessmentId?: string;
  resourceIds: string[]; // Relational IDs
}

export interface Lesson {
  id: string;
  moduleId: string; // Relational link
  orderIndex: number;
  metadata: ContentMetadata;
  aiMetadata: AIMetadata;
  permissions: ContentPermissions;
  activityIds: string[]; // Relational IDs
  resourceIds: string[]; // Relational IDs
  assessmentIds: string[]; // Relational IDs
}

export interface Module {
  id: string;
  courseId: string; // Relational link
  orderIndex: number;
  metadata: ContentMetadata;
  lessonIds: string[]; // Relational IDs
  completionRules: CompletionRule[];
}

export interface Course {
  id: string;
  trackId?: string; // Relational link
  metadata: ContentMetadata;
  aiMetadata: AIMetadata;
  permissions: ContentPermissions;
  moduleIds: string[]; // Relational IDs
  certificateTemplateId?: string;
  completionRules: CompletionRule[];
}

export interface Track {
  id: string;
  metadata: ContentMetadata;
  aiMetadata: AIMetadata;
  courseIds: string[]; // Relational IDs
  targetRoles: string[];
}

// ─── Decoupled Student Learning Progress Model ───────────────────────────────

export interface LearningProgress {
  id: string;
  userId: string;
  entityId: string; // Track, Course, Module, Lesson, or Activity ID
  entityType: "track" | "course" | "module" | "lesson" | "activity";
  status: ProgressStatus;
  scorePercentage?: number;
  timeSpentSeconds: number;
  watchPercentage?: number;
  attemptsCount?: number;
  lastAccessedAt: string;
  startedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string; // Mentor User ID
  metadata?: Record<string, unknown>;
}

export interface StudentProgressSummary {
  userId: string;
  overallProgressPercentage: number;
  enrolledTracksCount: number;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  completedLessonsCount: number;
  completedActivitiesCount: number;
  totalTimeSpentSeconds: number;
  activeStreakDays: number;
  lastActiveDate: string;
}
