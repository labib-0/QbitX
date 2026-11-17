import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Validation Test Suite", () => {
  const githubRepoRegex = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/;

  describe("GitHub Repository URL Validation", () => {
    it("should accept valid standard GitHub repository URLs", () => {
      const validUrls = [
        "https://github.com/facebook/react",
        "https://github.com/vercel/next.js",
        "https://github.com/qbitx-labs/capstone-project",
        "https://www.github.com/user_123/repo-name/",
      ];

      for (const url of validUrls) {
        expect(githubRepoRegex.test(url)).toBe(true);
      }
    });

    it("should reject non-GitHub or malformed URLs", () => {
      const invalidUrls = [
        "http://github.com/facebook/react", // Insecure HTTP
        "https://gitlab.com/facebook/react", // Non-GitHub
        "https://github.com/single-part", // Missing repo name
        "https://github.com/user/repo/extra/nested/path", // Path too deep
        "javascript:alert(1)", // XSS attempt
        "", // Empty
        "not-a-url",
      ];

      for (const url of invalidUrls) {
        expect(githubRepoRegex.test(url)).toBe(false);
      }
    });
  });

  describe("Project Submission Schema", () => {
    const submissionSchema = z.object({
      githubRepoUrl: z.string().regex(githubRepoRegex),
      liveDemoUrl: z.string().url().optional().or(z.literal("")),
      notes: z.string().max(2000).optional(),
    });

    it("should validate a complete valid project submission", () => {
      const result = submissionSchema.safeParse({
        githubRepoUrl: "https://github.com/student/my-capstone",
        liveDemoUrl: "https://my-capstone.vercel.app",
        notes: "Completed all 3 milestones and added unit tests.",
      });

      expect(result.success).toBe(true);
    });

    it("should reject submission with missing or invalid githubRepoUrl", () => {
      const result = submissionSchema.safeParse({
        githubRepoUrl: "https://random-site.com/code",
        notes: "Here is my code",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Course Data Schema", () => {
    const courseSchema = z.object({
      title: z.string().min(3).max(150),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      durationHours: z.number().int().min(1),
    });

    it("should validate valid course inputs", () => {
      const valid = courseSchema.safeParse({
        title: "Distributed Systems & Raft Consensus",
        difficulty: "advanced",
        durationHours: 35,
      });

      expect(valid.success).toBe(true);
    });

    it("should reject invalid difficulty levels", () => {
      const invalid = courseSchema.safeParse({
        title: "Test Course",
        difficulty: "expert", // Not in enum
        durationHours: 10,
      });

      expect(invalid.success).toBe(false);
    });
  });
});
