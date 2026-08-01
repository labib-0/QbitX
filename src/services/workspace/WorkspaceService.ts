/**
 * src/services/workspace/WorkspaceService.ts
 * Manages student notes, bookmarks, discussions, and position recovery
 */

import { StudentNote, Bookmark, DiscussionThread, WorkspaceSession } from "@/types/workspace";

// In-memory initial data store with localStorage backup
const NOTES_STORAGE_KEY = "qbitx_workspace_notes";
const BOOKMARKS_STORAGE_KEY = "qbitx_workspace_bookmarks";
const DISCUSSIONS_STORAGE_KEY = "qbitx_workspace_discussions";

export const INITIAL_NOTES: StudentNote[] = [
  {
    id: "note-1",
    userId: "usr-student-demo",
    courseId: "crs-1",
    lessonId: "les-1",
    timestampSeconds: 145,
    title: "Python Variable Scope & Mutability",
    content: "Remember: Primitive types in Python (int, float, str, bool) are immutable. Lists and dictionaries are mutable objects passed by reference.",
    tags: ["python", "variables", "memory"],
    isPinned: true,
    isShared: false,
    createdAt: "2026-07-28T14:00:00Z",
    updatedAt: "2026-07-28T14:00:00Z",
  },
  {
    id: "note-2",
    userId: "usr-student-demo",
    courseId: "crs-1",
    lessonId: "les-2",
    codeLineNumber: 12,
    title: "Binary Tree Traversal Inorder Logic",
    content: "Inorder traversal visit order: Left Subtree -> Root Node -> Right Subtree. Gives sorted keys in a Binary Search Tree!",
    tags: ["dsa", "trees", "inorder"],
    isPinned: false,
    isShared: false,
    createdAt: "2026-07-29T10:15:00Z",
    updatedAt: "2026-07-29T10:15:00Z",
  },
];

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: "bm-1",
    userId: "usr-student-demo",
    courseId: "crs-1",
    lessonId: "les-1",
    title: "Python Installation & Pip Package Manager",
    timestampSeconds: 320,
    note: "Great tip on setting up virtual environments using python -m venv env.",
    createdAt: "2026-07-28T14:20:00Z",
  },
  {
    id: "bm-2",
    userId: "usr-student-demo",
    courseId: "crs-1",
    lessonId: "les-2",
    title: "Binary Search Tree Code Template",
    codeSnippet: "def inorder_traversal(root):\n    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right) if root else []",
    createdAt: "2026-07-29T10:30:00Z",
  },
];

export const INITIAL_DISCUSSIONS: DiscussionThread[] = [
  {
    id: "disc-1",
    lessonId: "les-1",
    authorId: "usr-student-2",
    authorName: "Alex Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    authorRole: "student",
    title: "Difference between Python 3.11 and 3.12 GIL improvements?",
    content: "Is there any noticeable performance gain when running loops and recursion in Python 3.12 vs 3.11?",
    isPinned: true,
    isResolved: true,
    tags: ["python", "performance"],
    createdAt: "2026-07-25T09:00:00Z",
    updatedAt: "2026-07-25T11:00:00Z",
    comments: [
      {
        id: "comm-1",
        threadId: "disc-1",
        authorId: "usr-mentor-1",
        authorName: "Dr. Sarah Chen",
        authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
        authorRole: "mentor",
        content: "Great question! Python 3.12 introduces per-interpreter GIL and specialized adaptive bytecode instructions, giving 10-15% speedups on recursion loops.",
        upvotesCount: 14,
        isInstructorAnswer: true,
        createdAt: "2026-07-25T11:00:00Z",
      },
    ],
  },
];

export class WorkspaceService {
  // ── Notes Methods ─────────────────────────────────────────────────────────

  static getNotes(userId: string, lessonId?: string): StudentNote[] {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(NOTES_STORAGE_KEY);
        const notes: StudentNote[] = stored ? JSON.parse(stored) : INITIAL_NOTES;
        return notes.filter((n) => n.userId === userId && (!lessonId || n.lessonId === lessonId));
      } catch (e) {
        return INITIAL_NOTES;
      }
    }
    return INITIAL_NOTES;
  }

  static addNote(note: Omit<StudentNote, "id" | "createdAt" | "updatedAt">): StudentNote {
    const newNote: StudentNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = this.getNotes(note.userId);
    const updated = [newNote, ...existing];
    if (typeof window !== "undefined") {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    }
    return newNote;
  }

  static deleteNote(noteId: string, userId: string): boolean {
    const existing = this.getNotes(userId);
    const updated = existing.filter((n) => n.id !== noteId);
    if (typeof window !== "undefined") {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    }
    return true;
  }

  // ── Bookmarks Methods ──────────────────────────────────────────────────────

  static getBookmarks(userId: string, lessonId?: string): Bookmark[] {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
        const bookmarks: Bookmark[] = stored ? JSON.parse(stored) : INITIAL_BOOKMARKS;
        return bookmarks.filter((b) => b.userId === userId && (!lessonId || b.lessonId === lessonId));
      } catch (e) {
        return INITIAL_BOOKMARKS;
      }
    }
    return INITIAL_BOOKMARKS;
  }

  static addBookmark(bookmark: Omit<Bookmark, "id" | "createdAt">): Bookmark {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `bm-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const existing = this.getBookmarks(bookmark.userId);
    const updated = [newBookmark, ...existing];
    if (typeof window !== "undefined") {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    }
    return newBookmark;
  }

  static removeBookmark(bookmarkId: string, userId: string): boolean {
    const existing = this.getBookmarks(userId);
    const updated = existing.filter((b) => b.id !== bookmarkId);
    if (typeof window !== "undefined") {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    }
    return true;
  }

  // ── Discussions Methods ────────────────────────────────────────────────────

  static getDiscussions(lessonId: string): DiscussionThread[] {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(DISCUSSIONS_STORAGE_KEY);
        const threads: DiscussionThread[] = stored ? JSON.parse(stored) : INITIAL_DISCUSSIONS;
        return threads.filter((t) => t.lessonId === lessonId);
      } catch (e) {
        return INITIAL_DISCUSSIONS;
      }
    }
    return INITIAL_DISCUSSIONS;
  }

  static addDiscussion(thread: Omit<DiscussionThread, "id" | "comments" | "createdAt" | "updatedAt">): DiscussionThread {
    const newThread: DiscussionThread = {
      ...thread,
      id: `disc-${Date.now()}`,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existing = this.getDiscussions(thread.lessonId);
    const updated = [newThread, ...existing];
    if (typeof window !== "undefined") {
      localStorage.setItem(DISCUSSIONS_STORAGE_KEY, JSON.stringify(updated));
    }
    return newThread;
  }

  static addComment(threadId: string, lessonId: string, comment: { authorId: string; authorName: string; authorAvatar?: string; authorRole: "student" | "mentor" | "admin"; content: string }) {
    const threads = this.getDiscussions(lessonId);
    const threadIndex = threads.findIndex((t) => t.id === threadId);
    if (threadIndex >= 0) {
      const newComment = {
        id: `comm-${Date.now()}`,
        threadId,
        authorId: comment.authorId,
        authorName: comment.authorName,
        authorAvatar: comment.authorAvatar,
        authorRole: comment.authorRole,
        content: comment.content,
        upvotesCount: 0,
        createdAt: new Date().toISOString(),
      };
      threads[threadIndex].comments.push(newComment);
      if (typeof window !== "undefined") {
        localStorage.setItem(DISCUSSIONS_STORAGE_KEY, JSON.stringify(threads));
      }
      return newComment;
    }
    return null;
  }
}
