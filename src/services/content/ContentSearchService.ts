/**
 * src/services/content/ContentSearchService.ts
 * Search engine across tracks, courses, modules, lessons, activities using metadata, tags, and AI objectives
 */

import { Difficulty, UserRole } from "@/types/content";
import {
  MOCK_TRACKS,
  MOCK_COURSES,
  MOCK_MODULES,
  MOCK_LESSONS,
  MOCK_ACTIVITIES,
} from "@/lib/contentData";
import { ContentPermissionService } from "./ContentPermissionService";

export interface SearchFilterOptions {
  query?: string;
  category?: string;
  difficulty?: Difficulty;
  tag?: string;
  aiSkill?: string;
  userRole?: UserRole;
  limit?: number;
}

export interface UnifiedSearchResultItem {
  id: string;
  type: "track" | "course" | "module" | "lesson" | "activity";
  title: string;
  subtitle?: string;
  description: string;
  slug: string;
  category: string;
  difficulty: Difficulty;
  tags: string[];
  thumbnail?: string;
  aiSkills?: string[];
  score: number; // Relevance score
}

export class ContentSearchService {
  /**
   * Search unified entities across all content levels
   */
  static search(options: SearchFilterOptions): UnifiedSearchResultItem[] {
    const q = (options.query || "").toLowerCase().trim();
    const role = options.userRole || "student";

    const results: UnifiedSearchResultItem[] = [];

    // Helper matcher
    const matchItem = (
      id: string,
      type: "track" | "course" | "module" | "lesson" | "activity",
      title: string,
      description: string,
      slug: string,
      category: string,
      difficulty: Difficulty,
      tags: string[],
      status: any,
      visibility: any,
      thumbnail?: string,
      aiSkills?: string[]
    ) => {
      // Permission check
      if (!ContentPermissionService.canUserAccessEntity(status, visibility, role)) {
        return;
      }

      // Filter checks
      if (options.category && category.toLowerCase() !== options.category.toLowerCase()) {
        return;
      }
      if (options.difficulty && difficulty !== options.difficulty) {
        return;
      }
      if (options.tag && !tags.some((t) => t.toLowerCase() === options.tag!.toLowerCase())) {
        return;
      }
      if (options.aiSkill && aiSkills && !aiSkills.some((s) => s.toLowerCase().includes(options.aiSkill!.toLowerCase()))) {
        return;
      }

      let score = 0;
      if (!q) {
        score = 1;
      } else {
        if (title.toLowerCase().includes(q)) score += 10;
        if (category.toLowerCase().includes(q)) score += 5;
        if (tags.some((t) => t.toLowerCase().includes(q))) score += 4;
        if (description.toLowerCase().includes(q)) score += 2;
        if (aiSkills && aiSkills.some((s) => s.toLowerCase().includes(q))) score += 3;
      }

      if (score > 0) {
        results.push({
          id,
          type,
          title,
          description,
          slug,
          category,
          difficulty,
          tags,
          thumbnail,
          aiSkills,
          score,
        });
      }
    };

    // 1. Search Tracks
    MOCK_TRACKS.forEach((t) => {
      matchItem(
        t.id,
        "track",
        t.metadata.title,
        t.metadata.description,
        t.metadata.slug,
        t.metadata.category,
        t.metadata.difficulty,
        t.metadata.tags,
        t.metadata.status,
        t.metadata.visibility,
        t.metadata.thumbnail,
        t.aiMetadata?.skillsTaught
      );
    });

    // 2. Search Courses
    MOCK_COURSES.forEach((c) => {
      matchItem(
        c.id,
        "course",
        c.metadata.title,
        c.metadata.description,
        c.metadata.slug,
        c.metadata.category,
        c.metadata.difficulty,
        c.metadata.tags,
        c.metadata.status,
        c.metadata.visibility,
        c.metadata.thumbnail,
        c.aiMetadata?.skillsTaught
      );
    });

    // 3. Search Modules
    MOCK_MODULES.forEach((m) => {
      matchItem(
        m.id,
        "module",
        m.metadata.title,
        m.metadata.description,
        m.metadata.slug,
        m.metadata.category,
        m.metadata.difficulty,
        m.metadata.tags,
        m.metadata.status,
        m.metadata.visibility,
        m.metadata.thumbnail
      );
    });

    // 4. Search Lessons
    MOCK_LESSONS.forEach((l) => {
      matchItem(
        l.id,
        "lesson",
        l.metadata.title,
        l.metadata.description,
        l.metadata.slug,
        l.metadata.category,
        l.metadata.difficulty,
        l.metadata.tags,
        l.metadata.status,
        l.metadata.visibility,
        l.metadata.thumbnail,
        l.aiMetadata?.skillsTaught
      );
    });

    // 5. Search Activities
    MOCK_ACTIVITIES.forEach((a) => {
      matchItem(
        a.id,
        "activity",
        a.metadata.title,
        a.metadata.description,
        a.metadata.slug,
        a.metadata.category,
        a.metadata.difficulty,
        a.metadata.tags,
        a.metadata.status,
        a.metadata.visibility,
        a.metadata.thumbnail
      );
    });

    // Sort by relevance score descending
    results.sort((a, b) => b.score - a.score);

    const limit = options.limit || 20;
    return results.slice(0, limit);
  }
}
