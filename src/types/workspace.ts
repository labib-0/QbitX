/**
 * src/types/workspace.ts
 * Learning Workspace (Course Player) Data Types
 */

export interface StudentNote {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  timestampSeconds?: number;
  codeLineNumber?: number;
  title: string;
  content: string; // Supports markdown
  tags: string[];
  isPinned: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  title: string;
  timestampSeconds?: number;
  codeSnippet?: string;
  resourceId?: string;
  note?: string;
  createdAt: string;
}

export interface DiscussionComment {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: "student" | "mentor" | "admin";
  content: string;
  upvotesCount: number;
  userHasUpvoted?: boolean;
  isInstructorAnswer?: boolean;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  lessonId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: "student" | "mentor" | "admin";
  title: string;
  content: string;
  isPinned: boolean;
  isResolved: boolean;
  comments: DiscussionComment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type LearningEventType =
  | "lesson_started"
  | "lesson_completed"
  | "video_played"
  | "video_paused"
  | "video_seek"
  | "reading_scrolled"
  | "note_created"
  | "bookmark_added"
  | "quiz_started"
  | "quiz_submitted"
  | "code_executed"
  | "solution_revealed"
  | "resource_downloaded"
  | "discussion_posted";

export interface LearningEvent {
  id: string;
  userId: string;
  courseId: string;
  lessonId?: string;
  eventType: LearningEventType;
  payload?: Record<string, unknown>;
  timestamp: string;
  offlineQueued?: boolean;
}

export interface WorkspaceSession {
  courseId: string;
  currentLessonId: string;
  lastVideoTimestampSeconds: number;
  lastReadingScrollPositionPct: number;
  activePanel: "navigator" | "notes" | "bookmarks" | "discussions" | "resources" | "ai" | null;
  playbackSpeed: number;
}
