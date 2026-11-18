import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import fs from "fs";
import path from "path";

describe("Jeifer Gomes Student Account, Courses, Track Data, Assignments & Projects Integration Suite", () => {
  let client: PGlite;
  let db: any;

  const jeiferId = "usr-student-jeifer";
  const jeiferEmail = "jeifer.gomes@qbitx.com";
  const mentorId = "usr-mentor-tariqul";

  beforeAll(async () => {
    client = new PGlite();
    db = drizzle(client, { schema });

    // Execute migrations
    const migrationsDir = path.join(process.cwd(), "src/server/db/migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const sqlContent = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      const statements = sqlContent
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        try {
          await client.exec(statement);
        } catch {
          // Idempotent
        }
      }
    }
  });

  afterAll(async () => {
    await client.close();
  });

  // ==========================================
  // 1. ACCOUNT & PROFILE VERIFICATION
  // ==========================================
  describe("Jeifer Gomes Student Account & Profile", () => {
    it("persists student user account with role student and verified status", async () => {
      const [user] = await db
        .insert(schema.users)
        .values({
          id: jeiferId,
          name: "Jeifer Gomes",
          email: jeiferEmail,
          role: "student",
          status: "active",
          emailVerified: true,
        })
        .returning();

      expect(user).toBeDefined();
      expect(user.id).toBe(jeiferId);
      expect(user.name).toBe("Jeifer Gomes");
      expect(user.email).toBe(jeiferEmail);
      expect(user.role).toBe("student");
      expect(user.emailVerified).toBe(true);
    });

    it("persists student profile with university, track, and skill data", async () => {
      const [profile] = await db
        .insert(schema.studentProfiles)
        .values({
          id: "sprof-jeifer-test",
          userId: jeiferId,
          university: "Notre Dame University Bangladesh (NDUB)",
          department: "Computer Science & Engineering",
          academicYear: "3rd Year",
          experienceLevel: "intermediate",
          track: "Full-Stack Web & AI Engineering",
          bio: "3rd-year CSE undergraduate at Notre Dame University Bangladesh (NDUB). Specializing in Full-Stack Web & AI Engineering, cloud microservices, and distributed systems.",
          learningGoals: [
            "Master Next.js 16 App Router",
            "Architect Microservices",
            "Build Production AI Systems",
          ],
          selectedSkills: ["TypeScript", "Next.js", "Python", "PostgreSQL", "Google Gemini", "Docker"],
          skills: ["TypeScript", "Next.js", "Python", "PostgreSQL", "Google Gemini", "Docker", "Tailwind CSS"],
          githubUrl: "https://github.com/jeifer-gomes",
          linkedinUrl: "https://linkedin.com/in/jeifer-gomes",
          portfolioUrl: "https://jeifer-gomes.dev",
          onboardingCompleted: true,
          xp: 6450,
          level: 14,
        })
        .returning();

      expect(profile).toBeDefined();
      expect(profile.university).toContain("Notre Dame University Bangladesh");
      expect(profile.department).toBe("Computer Science & Engineering");
      expect(profile.track).toBe("Full-Stack Web & AI Engineering");
      expect(profile.level).toBe(14);
      expect(profile.xp).toBe(6450);
      expect(profile.skills).toContain("TypeScript");
      expect(profile.skills).toContain("Google Gemini");
    });
  });

  // ==========================================
  // 2. TRACKS & COURSE ENROLLMENT DATA
  // ==========================================
  describe("Tracks & Course Enrollments", () => {
    it("creates multiple career tracks and associates courses", async () => {
      // 1. Tracks
      await db.insert(schema.tracks).values([
        {
          id: "trk-web-ai-test",
          slug: "web-ai-engineering",
          title: "Full-Stack Web & AI Engineering",
          description: "Next.js, TypeScript, and Generative AI integrations",
          orderIndex: 1,
        },
        {
          id: "trk-cs-test",
          slug: "cs-fundamentals",
          title: "Computer Science & Systems",
          description: "Core algorithms, data structures, and systems",
          orderIndex: 2,
        },
      ]);

      // 2. Courses
      await db.insert(schema.courses).values([
        {
          id: "crs-ai-web-test",
          slug: "fullstack-ai-web-engineering",
          title: "Full-Stack AI Web Engineering with Next.js & Gemini",
          trackId: "trk-web-ai-test",
          category: "Web & AI Engineering",
          difficulty: "intermediate",
          isPublished: true,
        },
        {
          id: "crs-dsa-test",
          slug: "dsa-practical-mastery",
          title: "Practical Data Structures & Algorithms",
          trackId: "trk-cs-test",
          category: "Computer Science",
          difficulty: "beginner",
          isPublished: true,
        },
      ]);

      // 3. Modules & Lessons
      await db.insert(schema.modules).values({
        id: "mod-test-1",
        courseId: "crs-ai-web-test",
        title: "Module 1: Server Components",
        orderIndex: 1,
      });

      await db.insert(schema.lessons).values([
        {
          id: "les-test-1",
          moduleId: "mod-test-1",
          courseId: "crs-ai-web-test",
          title: "1.1 Next.js App Router Architecture",
          lessonType: "video",
          orderIndex: 1,
        },
        {
          id: "les-test-2",
          moduleId: "mod-test-1",
          courseId: "crs-ai-web-test",
          title: "1.2 Server Actions & RPC Mutations",
          lessonType: "reading",
          orderIndex: 2,
        },
      ]);

      const loadedTracks = await db.select().from(schema.tracks);
      expect(loadedTracks).toHaveLength(2);
    });

    it("enrolls Jeifer Gomes in courses with progress tracking", async () => {
      await db.insert(schema.enrollments).values([
        {
          id: "enr-jeifer-1",
          userId: jeiferId,
          courseId: "crs-ai-web-test",
          status: "active",
          progressPercent: 85,
        },
        {
          id: "enr-jeifer-2",
          userId: jeiferId,
          courseId: "crs-dsa-test",
          status: "active",
          progressPercent: 92,
        },
      ]);

      const enrollments = await db
        .select()
        .from(schema.enrollments)
        .where(eq(schema.enrollments.userId, jeiferId));

      expect(enrollments).toHaveLength(2);
      expect(enrollments.find((e: any) => e.courseId === "crs-ai-web-test")?.progressPercent).toBe(85);
      expect(enrollments.find((e: any) => e.courseId === "crs-dsa-test")?.progressPercent).toBe(92);
    });

    it("tracks lesson completions for Jeifer Gomes", async () => {
      await db.insert(schema.lessonProgress).values([
        {
          id: "lp-jeifer-1",
          userId: jeiferId,
          lessonId: "les-test-1",
          courseId: "crs-ai-web-test",
          isCompleted: true,
          watchTimeSeconds: 1080,
          completedAt: new Date(),
        },
        {
          id: "lp-jeifer-2",
          userId: jeiferId,
          lessonId: "les-test-2",
          courseId: "crs-ai-web-test",
          isCompleted: true,
          watchTimeSeconds: 1320,
          completedAt: new Date(),
        },
      ]);

      const completed = await db
        .select()
        .from(schema.lessonProgress)
        .where(
          and(
            eq(schema.lessonProgress.userId, jeiferId),
            eq(schema.lessonProgress.isCompleted, true)
          )
        );

      expect(completed).toHaveLength(2);
      expect(completed[0].isCompleted).toBe(true);
    });
  });

  // ==========================================
  // 3. ASSIGNMENTS & ASSESSMENT ATTEMPTS
  // ==========================================
  describe("Assignments & Assessments", () => {
    const assessmentId = "ass-test-dsa";

    beforeAll(async () => {
      await db.insert(schema.assessments).values({
        id: assessmentId,
        courseId: "crs-dsa-test",
        title: "DSA Lab #4 — Binary Trees & Graph Traversal Checkpoint",
        description: "Assess understanding of binary search trees, graph cycles, and Dijkstra's algorithm.",
        passingScore: 70,
      });

      await db.insert(schema.assessmentQuestions).values([
        {
          id: "q-test-1",
          assessmentId,
          questionText: "What is the worst-case search complexity of a balanced AVL tree?",
          options: [
            { id: 0, text: "O(1)" },
            { id: 1, text: "O(log n)" },
            { id: 2, text: "O(n)" },
            { id: 3, text: "O(n^2)" },
          ],
          correctOptionIndex: 1,
          explanation: "Balanced binary search trees maintain height O(log n).",
          orderIndex: 1,
        },
      ]);
    });

    it("records passed assessment attempt for Jeifer Gomes", async () => {
      const [attempt] = await db
        .insert(schema.assessmentAttempts)
        .values({
          id: "att-jeifer-1",
          assessmentId,
          userId: jeiferId,
          score: 95,
          passed: true,
          answers: { "0": 1 },
        })
        .returning();

      expect(attempt).toBeDefined();
      expect(attempt.userId).toBe(jeiferId);
      expect(attempt.score).toBe(95);
      expect(attempt.passed).toBe(true);
    });
  });

  // ==========================================
  // 4. PROJECTS, SUBMISSIONS & MENTOR REVIEWS
  // ==========================================
  describe("Project-Based Learning & Mentor Reviews", () => {
    const projectId = "proj-test-bkash";
    const submissionId = "sub-test-jeifer-bkash";

    beforeAll(async () => {
      // Seed mentor user
      await db.insert(schema.users).values({
        id: mentorId,
        name: "Dr. Tariqul Islam",
        email: "mentor@qbitx.com",
        role: "mentor",
        status: "active",
        emailVerified: true,
      });

      // Seed project
      await db.insert(schema.projects).values({
        id: projectId,
        slug: "bkash-nagad-payment-ledger",
        title: "bKash/Nagad Real-Time Payment Gateway & Ledger Simulator",
        description: "High-concurrency digital wallet ledger simulating instant mobile financial services.",
        difficulty: "intermediate",
        technologies: ["Next.js", "TypeScript", "Neon PostgreSQL", "ACID Transactions", "Webhooks"],
        isPublished: true,
      });

      await db.insert(schema.projectMilestones).values([
        {
          id: "ms-test-1",
          projectId,
          title: "Milestone 1: Double-Entry Ledger Schema & ACID Transactions",
          orderIndex: 1,
        },
        {
          id: "ms-test-2",
          projectId,
          title: "Milestone 2: Idempotent Webhook Processing Engine",
          orderIndex: 2,
        },
      ]);
    });

    it("enrolls Jeifer Gomes in the project across milestones", async () => {
      const [enrollment] = await db
        .insert(schema.projectEnrollments)
        .values({
          id: "penr-test-jeifer",
          userId: jeiferId,
          projectId,
          status: "submitted",
          currentMilestone: 2,
        })
        .returning();

      expect(enrollment.status).toBe("submitted");
      expect(enrollment.currentMilestone).toBe(2);
    });

    it("records Jeifer Gomes project submission with GitHub and demo links", async () => {
      const [submission] = await db
        .insert(schema.projectSubmissions)
        .values({
          id: submissionId,
          projectId,
          userId: jeiferId,
          githubRepoUrl: "https://github.com/jeifer-gomes/bkash-ledger-simulator",
          liveDemoUrl: "https://bkash-ledger-jeifer.vercel.app",
          notes: "Implemented double-entry accounting with row-level locks, HMAC webhook verification, and automated reconciliation reports.",
          status: "reviewed",
        })
        .returning();

      expect(submission.githubRepoUrl).toBe("https://github.com/jeifer-gomes/bkash-ledger-simulator");
      expect(submission.liveDemoUrl).toBe("https://bkash-ledger-jeifer.vercel.app");
      expect(submission.status).toBe("reviewed");
    });

    it("records mentor review with rubric score and feedback for Jeifer Gomes", async () => {
      const [review] = await db
        .insert(schema.projectReviews)
        .values({
          id: "rev-test-jeifer",
          submissionId,
          reviewerId: mentorId,
          score: 96,
          feedbackMarkdown: "### Outstanding Engineering Quality, Jeifer!\n- **Idempotency**: Robust webhook signature verification.\n- **ACID**: Row locks prevent race conditions.",
          criteriaScores: { "architecture": 38, "security": 29, "tests": 29 },
          status: "approved",
        })
        .returning();

      expect(review.score).toBe(96);
      expect(review.status).toBe("approved");
      expect(review.reviewerId).toBe(mentorId);
      expect(review.feedbackMarkdown).toContain("Jeifer");
    });
  });

  // ==========================================
  // 5. WORKSPACE NOTES, BOOKMARKS & DISCUSSIONS
  // ==========================================
  describe("Workspace Collaboration & Discussions", () => {
    it("creates workspace notes, bookmarks, and discussions for Jeifer Gomes", async () => {
      // 1. Note
      const [note] = await db
        .insert(schema.workspaceNotes)
        .values({
          id: "note-test-jeifer",
          userId: jeiferId,
          courseId: "crs-ai-web-test",
          lessonId: "les-test-1",
          title: "Next.js App Router Architecture & RSC Boundaries",
          content: "React Server Components execute strictly on the server and stream HTML over the wire.",
          tags: ["Next.js", "React 19"],
          isPinned: true,
        })
        .returning();

      expect(note.title).toContain("Next.js App Router");
      expect(note.isPinned).toBe(true);

      // 2. Bookmark
      const [bookmark] = await db
        .insert(schema.workspaceBookmarks)
        .values({
          id: "bmk-test-jeifer",
          userId: jeiferId,
          courseId: "crs-ai-web-test",
          lessonId: "les-test-1",
          title: "Server Actions vs Route Handlers",
          timestampSeconds: 320,
        })
        .returning();

      expect(bookmark.timestampSeconds).toBe(320);

      // 3. Discussion
      const [discussion] = await db
        .insert(schema.workspaceDiscussions)
        .values({
          id: "disc-test-jeifer",
          lessonId: "les-test-1",
          authorId: jeiferId,
          authorName: "Jeifer Gomes",
          title: "Preventing Race Conditions in High-Volume MFS Webhook Handlers",
          content: "When handling concurrent bKash callbacks, how should we structure row locks?",
          upvotes: 18,
        })
        .returning();

      expect(discussion.authorName).toBe("Jeifer Gomes");

      // 4. Mentor Reply
      const [reply] = await db
        .insert(schema.workspaceDiscussionReplies)
        .values({
          id: "rep-test-jeifer",
          discussionId: discussion.id,
          authorId: mentorId,
          authorName: "Dr. Tariqul Islam",
          content: "Use deterministic ordering of account IDs before SELECT FOR UPDATE.",
          upvotes: 12,
        })
        .returning();

      expect(reply.discussionId).toBe(discussion.id);
      expect(reply.authorName).toBe("Dr. Tariqul Islam");
    });
  });

  // ==========================================
  // 6. DATA ISOLATION & IDOR PROTECTION
  // ==========================================
  describe("Data Isolation & Authorization Boundaries", () => {
    it("ensures student records are strictly isolated from other students", async () => {
      const otherStudentId = "usr-student-other";
      await db.insert(schema.users).values({
        id: otherStudentId,
        name: "Other Student",
        email: "other@university.edu",
        role: "student",
        status: "active",
      });

      // Query Jeifer's notes using user filter
      const jeiferNotes = await db
        .select()
        .from(schema.workspaceNotes)
        .where(eq(schema.workspaceNotes.userId, jeiferId));

      const otherNotes = await db
        .select()
        .from(schema.workspaceNotes)
        .where(eq(schema.workspaceNotes.userId, otherStudentId));

      expect(jeiferNotes.length).toBeGreaterThan(0);
      expect(otherNotes).toHaveLength(0);
    });
  });
});
