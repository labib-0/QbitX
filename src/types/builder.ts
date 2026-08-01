/**
 * src/types/builder.ts
 * Mentor Course Builder & Content Management Studio Types
 */

export type MediaAssetType =
  | "image"
  | "video"
  | "pdf"
  | "document"
  | "zip"
  | "dataset"
  | "audio"
  | "presentation";

export interface MediaAsset {
  id: string;
  name: string;
  type: MediaAssetType;
  url: string;
  sizeBytes: number;
  mimeType: string;
  tags: string[];
  category: string;
  usedInCount: number;
  createdBy: string;
  createdAt: string;
}

export interface PublishingChecklistIssue {
  id: string;
  severity: "error" | "warning" | "info";
  message: string;
  component: "course" | "module" | "lesson" | "assessment" | "resource";
  entityId?: string;
  fixActionHint?: string;
}

export interface PublishingValidationResult {
  isValid: boolean;
  canPublish: boolean;
  errorsCount: number;
  warningsCount: number;
  issues: PublishingChecklistIssue[];
}

export interface QuizQuestionBuilder {
  id: string;
  type: "mcq" | "multi_select" | "true_false" | "fill_blank" | "coding" | "short_answer";
  questionText: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  points: number;
}

export interface AssignmentRubricCriterionBuilder {
  id: string;
  criterion: string;
  maxPoints: number;
  description: string;
}
