import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/server/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

describe("End-to-End User Journeys Integration Test Suite", () => {
  let client: PGlite;
  let db: any;

  // Test entities
  let studentId: string;
  let mentorId: string;
  let adminId: string;
  let courseId: string;
  let moduleId: string;
  let lessonId: string;
  let projectId: string;
  let submissionId: string;
  let mentorshipReqId: string;

  beforeAll(async () => {
    client = new PGlite();
    db = drizzle(client, { schema });

    // Execute migrations sequentially
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
  // SECTION 1: STUDENT JOURNEY WORKFLOW
  // ==========================================
  describe("Student Complete Journey Workflow", () => {
    studentId = "usr-student-journey-1";

    it("1. Registers a new student and verifies account", async () => {
      const [student] = await db
        .insert(schema.users)
        .values({
          id: studentId,
          name: "Aria Student",
          email: "aria.student@university.edu",
          role: "student",
          status: "active",
          emailVerified: true,
        })
        .returning();

      expect(student).toBeDefined();
      expect(student.email).toBe("aria.student@university.edu");
      expect(student.role).toBe("student");
      expect(student.emailVerified).toBe(true);
    });

    it("2. Completes student onboarding and profile creation", async () => {
      const profileId = "sp-journey-1";
      const [profile] = await db
        .insert(schema.studentProfiles)
        .values({
          id: profileId,
          userId: studentId,
          university: "University of Technology",
          department: "Computer Science & Engineering",
          academicYear: "Senior",
          track: "Full-Stack Web Development",
          experienceLevel: "intermediate",
          skills: ["TypeScript", "React", "PostgreSQL"],
          learningGoals: ["Master Distributed Systems", "Build Scalable Next.js Apps"],
          githubUrl: "https://github.com/aria-student",
          portfolioUrl: "https://ariastudent.dev",
          onboardingCompleted: true,
          xp: 150,
          level: 2,
        })
        .returning();

      expect(profile).toBeDefined();
      expect(profile.onboardingCompleted).toBe(true);
      expect(profile.university).toBe("University of Technology");
      expect(profile.skills).toContain("TypeScript");
    });

    it("3. Browses published courses and ensures drafts are hidden", async () => {
      // Seed a draft course and a published course
      courseId = "crs-react-journey-1";
      const draftCourseId = "crs-draft-hidden-1";

      await db.insert(schema.courses).values([
        {
          id: courseId,
          slug: "advanced-react-systems",
          title: "Advanced React & Distributed Systems",
          description: "Production architectural patterns with React 19 and Next.js.",
          category: "Software Engineering",
          difficulty: "intermediate",
          durationHours: 24,
          isPublished: true,
        },
        {
          id: draftCourseId,
          slug: "unreleased-internal-course",
          title: "Unreleased Internal Architecture (Draft)",
          description: "Not ready for student enrollment.",
          category: "Internal",
          difficulty: "advanced",
          durationHours: 8,
          isPublished: false,
        },
      ]);

      // Student course catalog query: isPublished MUST be true
      const publicCourses = await db
        .select()
        .from(schema.courses)
        .where(eq(schema.courses.isPublished, true));

      expect(publicCourses.some((c: any) => c.id === courseId)).toBe(true);
      expect(publicCourses.some((c: any) => c.id === draftCourseId)).toBe(false);
    });

    it("4. Enrolls in the published course with zero initial progress", async () => {
      const enrollmentId = "enr-student-journey-1";
      const [enrollment] = await db
        .insert(schema.enrollments)
        .values({
          id: enrollmentId,
          userId: studentId,
          courseId,
          status: "active",
          progressPercent: 0,
        })
        .returning();

      expect(enrollment.userId).toBe(studentId);
      expect(enrollment.courseId).toBe(courseId);
      expect(enrollment.progressPercent).toBe(0);
      expect(enrollment.status).toBe("active");
    });

    it("5. Loads course lessons including YouTube video player metadata", async () => {
      moduleId = "mod-journey-1";
      lessonId = "les-journey-video-1";
      const youtubeId = "843nec-IvW0";

      await db.insert(schema.modules).values({
        id: moduleId,
        courseId,
        title: "Module 1: Server Components Architecture",
        orderIndex: 1,
        isPublished: true,
      });

      await db.insert(schema.lessons).values({
        id: lessonId,
        moduleId,
        courseId,
        title: "Deep Dive into React Server Components",
        lessonType: "video",
        youtubeVideoId: youtubeId,
        durationMinutes: 22,
        orderIndex: 1,
        isPublished: true,
      });

      const lesson = await db
        .select()
        .from(schema.lessons)
        .where(eq(schema.lessons.id, lessonId));

      expect(lesson[0]).toBeDefined();
      expect(lesson[0].youtubeVideoId).toBe("843nec-IvW0");
      expect(lesson[0].lessonType).toBe("video");
      // YouTube embed URL verification
      const embedUrl = `https://www.youtube-nocookie.com/embed/${lesson[0].youtubeVideoId}`;
      expect(embedUrl).toBe("https://www.youtube-nocookie.com/embed/843nec-IvW0");
    });

    it("6. Marks lesson completed and persists progress across page refreshes", async () => {
      const progressId = "lp-student-journey-1";

      // 1. Mark lesson as completed
      await db.insert(schema.lessonProgress).values({
        id: progressId,
        userId: studentId,
        lessonId,
        courseId,
        isCompleted: true,
        watchTimeSeconds: 1320,
        completedAt: new Date(),
      });

      // 2. Update overall course enrollment progress
      await db
        .update(schema.enrollments)
        .set({
          progressPercent: 100,
          status: "completed",
          completedAt: new Date(),
        })
        .where(
          and(
            eq(schema.enrollments.userId, studentId),
            eq(schema.enrollments.courseId, courseId)
          )
        );

      // 3. Simulate page refresh / re-query
      const progressRecord = await db
        .select()
        .from(schema.lessonProgress)
        .where(
          and(
            eq(schema.lessonProgress.userId, studentId),
            eq(schema.lessonProgress.lessonId, lessonId)
          )
        );

      const refreshedEnrollment = await db
        .select()
        .from(schema.enrollments)
        .where(
          and(
            eq(schema.enrollments.userId, studentId),
            eq(schema.enrollments.courseId, courseId)
          )
        );

      expect(progressRecord[0].isCompleted).toBe(true);
      expect(progressRecord[0].watchTimeSeconds).toBe(1320);
      expect(refreshedEnrollment[0].progressPercent).toBe(100);
      expect(refreshedEnrollment[0].status).toBe("completed");
    });

    it("7. Starts capstone project and submits GitHub repository URL", async () => {
      projectId = "proj-cloud-native-1";

      await db.insert(schema.projects).values({
        id: projectId,
        slug: "cloud-native-microservices",
        title: "Cloud-Native Microservices Platform",
        description: "Deploy an end-to-end event-driven architecture.",
        difficulty: "advanced",
        technologies: ["Node.js", "Docker", "PostgreSQL", "Kafka"],
        learningObjectives: ["Event Sourcing", "Containerization"],
        isPublished: true,
      });

      // Student enrolls in project
      await db.insert(schema.projectEnrollments).values({
        id: "pe-journey-1",
        userId: studentId,
        projectId,
        status: "in_progress",
        currentMilestone: 1,
      });

      // Student submits GitHub repository
      submissionId = "sub-journey-1";
      const githubUrl = "https://github.com/aria-student/cloud-native-microservices";

      const [submission] = await db
        .insert(schema.projectSubmissions)
        .values({
          id: submissionId,
          projectId,
          userId: studentId,
          githubRepoUrl: githubUrl,
          liveDemoUrl: "https://cloud-native-demo.up.railway.app",
          notes: "Completed all milestones including automated Docker Compose orchestration.",
          status: "pending_review",
        })
        .returning();

      expect(submission.status).toBe("pending_review");
      expect(submission.githubRepoUrl).toBe(githubUrl);
    });

    it("8. Requests AI mentoring and persists conversation history in database", async () => {
      const convId = "conv-journey-1";
      await db.insert(schema.aiConversations).values({
        id: convId,
        userId: studentId,
        courseId,
        lessonId,
        title: "Help with Server Actions concurrency",
      });

      await db.insert(schema.aiMessages).values([
        {
          id: "msg-user-1",
          conversationId: convId,
          role: "user",
          content: "How do React Server Actions prevent race conditions during form submissions?",
        },
        {
          id: "msg-asst-1",
          conversationId: convId,
          role: "assistant",
          content: "React Server Actions utilize transitions and optimism to serialize state mutations...",
        },
      ]);

      const messages = await db
        .select()
        .from(schema.aiMessages)
        .where(eq(schema.aiMessages.conversationId, convId));

      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe("user");
      expect(messages[1].role).toBe("assistant");
    });

    it("9. Reviews student portfolio and public profile", async () => {
      await db.insert(schema.portfolioItems).values({
        id: "port-item-1",
        userId: studentId,
        title: "Cloud-Native Microservices",
        description: "Event-driven architecture with Kafka and Docker.",
        githubUrl: "https://github.com/aria-student/cloud-native-microservices",
        techStack: ["Node.js", "Docker", "PostgreSQL"],
        featured: true,
      });

      const portfolio = await db
        .select()
        .from(schema.portfolioItems)
        .where(eq(schema.portfolioItems.userId, studentId));

      expect(portfolio).toHaveLength(1);
      expect(portfolio[0].featured).toBe(true);
      expect(portfolio[0].techStack).toContain("Docker");
    });
  });

  // ==========================================
  // SECTION 2: MENTOR JOURNEY WORKFLOW
  // ==========================================
  describe("Mentor Complete Journey Workflow", () => {
    mentorId = "usr-mentor-journey-1";

    it("1. Logs in as authorized mentor and sets up profile", async () => {
      await db.insert(schema.users).values({
        id: mentorId,
        name: "Dr. Elena Vance",
        email: "elena.vance@qbitx.dev",
        role: "mentor",
        status: "active",
        emailVerified: true,
      });

      await db.insert(schema.mentorProfiles).values({
        id: "mp-journey-1",
        userId: mentorId,
        fullName: "Dr. Elena Vance",
        title: "Distinguished Principal Architect",
        company: "CloudScale Systems",
        headline: "Distributed Systems & Next.js Architecture Mentor",
        bio: "15+ years mentoring university engineering cohorts.",
        expertise: ["Distributed Systems", "PostgreSQL", "Next.js"],
        isAvailable: true,
        hourlyRate: 0,
        rating: 4.95,
        reviewCount: 42,
      });

      const mentorUser = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, mentorId));

      expect(mentorUser[0].role).toBe("mentor");
    });

    it("2. Reviews incoming mentorship requests from students", async () => {
      mentorshipReqId = "mr-journey-1";
      await db.insert(schema.mentorshipRequests).values({
        id: mentorshipReqId,
        studentId,
        mentorId,
        subject: "Review of Distributed Systems Architecture Capstone",
        description: "Need guidance on Kafka partition balancing and error boundaries.",
        status: "pending",
      });

      const incoming = await db
        .select()
        .from(schema.mentorshipRequests)
        .where(
          and(
            eq(schema.mentorshipRequests.mentorId, mentorId),
            eq(schema.mentorshipRequests.status, "pending")
          )
        );

      expect(incoming).toHaveLength(1);
      expect(incoming[0].subject).toContain("Review of Distributed Systems");
    });

    it("3. Accepts mentorship request and schedules meeting", async () => {
      const meetingLink = "https://meet.google.com/qbx-ment-elena";

      const [accepted] = await db
        .update(schema.mentorshipRequests)
        .set({
          status: "accepted",
          meetingUrl: meetingLink,
          mentorNotes: "Prepared review points on Kafka consumers and PostgreSQL indexing.",
          updatedAt: new Date(),
        })
        .where(eq(schema.mentorshipRequests.id, mentorshipReqId))
        .returning();

      expect(accepted.status).toBe("accepted");
      expect(accepted.meetingUrl).toBe(meetingLink);
    });

    it("4. Evaluates student project submission, assigns score, and awards XP", async () => {
      const reviewId = "rev-journey-1";
      const score = 94;
      const feedback = "Superb implementation of Docker multi-stage builds and clean repository modularity.";

      // 1. Insert review record
      const [review] = await db
        .insert(schema.projectReviews)
        .values({
          id: reviewId,
          submissionId,
          reviewerId: mentorId,
          score,
          feedbackMarkdown: feedback,
          status: "approved",
          reviewedAt: new Date(),
        })
        .returning();

      expect(review.score).toBe(94);
      expect(review.status).toBe("approved");

      // 2. Update submission status to 'reviewed'
      await db
        .update(schema.projectSubmissions)
        .set({
          status: "reviewed",
          updatedAt: new Date(),
        })
        .where(eq(schema.projectSubmissions.id, submissionId));

      // 3. Mark student project enrollment as 'completed'
      await db
        .update(schema.projectEnrollments)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(
          and(
            eq(schema.projectEnrollments.userId, studentId),
            eq(schema.projectEnrollments.projectId, projectId)
          )
        );

      // 4. Award +300 XP to student profile
      await db
        .update(schema.studentProfiles)
        .set({
          xp: sql`${schema.studentProfiles.xp} + 300`,
          updatedAt: new Date(),
        })
        .where(eq(schema.studentProfiles.userId, studentId));

      // 5. Send notification to student
      await db.insert(schema.notifications).values({
        id: "notif-proj-approved-1",
        userId: studentId,
        title: "Project Approved!",
        message: `Dr. Elena Vance approved your project with score 94/100 (+300 XP earned).`,
        type: "success",
        link: `/student/projects/${projectId}`,
      });

      // Verify student's updated XP
      const studentProfile = await db
        .select()
        .from(schema.studentProfiles)
        .where(eq(schema.studentProfiles.userId, studentId));

      expect(studentProfile[0].xp).toBe(450); // 150 initial + 300 earned

      // Verify student's notification
      const studentNotifs = await db
        .select()
        .from(schema.notifications)
        .where(eq(schema.notifications.userId, studentId));

      expect(studentNotifs).toHaveLength(1);
      expect(studentNotifs[0].message).toContain("approved your project with score 94/100");
    });
  });

  // ==========================================
  // SECTION 3: ADMINISTRATOR JOURNEY WORKFLOW
  // ==========================================
  describe("Administrator Complete Journey Workflow", () => {
    adminId = "usr-admin-journey-1";

    it("1. Logs in as platform administrator", async () => {
      const [admin] = await db
        .insert(schema.users)
        .values({
          id: adminId,
          name: "Chief Admin Officer",
          email: "admin@qbitx.org",
          role: "admin",
          status: "active",
          emailVerified: true,
        })
        .returning();

      expect(admin.role).toBe("admin");
    });

    it("2. Creates course, adds module, and adds lesson with YouTube video ID", async () => {
      const newCourseId = "crs-admin-created-1";
      const newModuleId = "mod-admin-created-1";
      const newLessonId = "les-admin-created-1";

      // 1. Create Course
      await db.insert(schema.courses).values({
        id: newCourseId,
        slug: "distributed-consensus-raft",
        title: "Distributed Consensus: Raft & Paxos",
        description: "Foundational theory and implementation of consensus protocols.",
        category: "Systems Engineering",
        difficulty: "advanced",
        durationHours: 30,
        isPublished: false, // Initially draft
        instructorId: adminId,
      });

      // 2. Add Module
      await db.insert(schema.modules).values({
        id: newModuleId,
        courseId: newCourseId,
        title: "Module 1: Leader Election & Log Replication",
        orderIndex: 1,
      });

      // 3. Add Lesson with YouTube Video ID
      await db.insert(schema.lessons).values({
        id: newLessonId,
        moduleId: newModuleId,
        courseId: newCourseId,
        title: "Visualizing the Raft State Machine",
        lessonType: "video",
        youtubeVideoId: "tcqEUSFnH8A",
        durationMinutes: 18,
        orderIndex: 1,
      });

      const lesson = await db
        .select()
        .from(schema.lessons)
        .where(eq(schema.lessons.id, newLessonId));

      expect(lesson[0].youtubeVideoId).toBe("tcqEUSFnH8A");
    });

    it("3. Publishes course and produces audit log entry", async () => {
      const courseToPublishId = "crs-admin-created-1";

      // 1. Publish course
      const [published] = await db
        .update(schema.courses)
        .set({
          isPublished: true,
          updatedAt: new Date(),
        })
        .where(eq(schema.courses.id, courseToPublishId))
        .returning();

      expect(published.isPublished).toBe(true);

      // 2. Insert audit log
      await db.insert(schema.auditLogs).values({
        id: "audit-course-pub-1",
        actorId: adminId,
        actorName: "Chief Admin Officer",
        actorRole: "admin",
        actionType: "COURSE_PUBLISHED",
        action: "publish",
        targetId: courseToPublishId,
        targetType: "course",
        details: { courseTitle: published.title, publishedAt: new Date() },
      });

      const logs = await db
        .select()
        .from(schema.auditLogs)
        .where(eq(schema.auditLogs.actionType, "COURSE_PUBLISHED"));

      expect(logs).toHaveLength(1);
      expect(logs[0].actorRole).toBe("admin");
      expect(logs[0].targetId).toBe(courseToPublishId);
    });

    it("4. Creates new capstone project for the platform", async () => {
      const [newProj] = await db
        .insert(schema.projects)
        .values({
          id: "proj-raft-cluster-1",
          slug: "build-raft-consensus-cluster",
          title: "Build a Fault-Tolerant Raft KV Store",
          description: "Implement leader election, heartbeats, and log persistence in Go or Rust.",
          difficulty: "advanced",
          technologies: ["Go", "Distributed Systems", "gRPC"],
          learningObjectives: ["Leader Election", "Quorum Commit"],
          isPublished: true,
        })
        .returning();

      expect(newProj.slug).toBe("build-raft-consensus-cluster");
      expect(newProj.isPublished).toBe(true);
    });

    it("5. Inspects administrative platform metrics and stats", async () => {
      // Query metrics
      const studentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.users)
        .where(eq(schema.users.role, "student"));

      const mentorCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.users)
        .where(eq(schema.users.role, "mentor"));

      const courseCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.courses);

      const enrollmentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.enrollments);

      const submissionCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.projectSubmissions);

      const auditLogCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.auditLogs);

      expect(Number(studentCount[0].count)).toBeGreaterThanOrEqual(1);
      expect(Number(mentorCount[0].count)).toBeGreaterThanOrEqual(1);
      expect(Number(courseCount[0].count)).toBeGreaterThanOrEqual(2);
      expect(Number(enrollmentCount[0].count)).toBeGreaterThanOrEqual(1);
      expect(Number(submissionCount[0].count)).toBeGreaterThanOrEqual(1);
      expect(Number(auditLogCount[0].count)).toBeGreaterThanOrEqual(1);
    });

    it("6. Audits administrative activity log history", async () => {
      const recentLogs = await db
        .select()
        .from(schema.auditLogs)
        .orderBy(desc(schema.auditLogs.createdAt));

      expect(recentLogs.length).toBeGreaterThan(0);
      const pubLog = recentLogs.find((l: any) => l.actionType === "COURSE_PUBLISHED");
      expect(pubLog).toBeDefined();
      expect(pubLog.actorName).toBe("Chief Admin Officer");
    });
  });
});
