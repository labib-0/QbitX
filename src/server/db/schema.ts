import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. BETTER AUTH TABLES (PostgreSQL Core)
// ==========================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("student"), // 'student' | 'mentor' | 'admin' | 'super_admin'
  status: text("status").notNull().default("active"), // 'active' | 'suspended'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==========================================
// 2. USER PROFILES
// ==========================================

export const studentProfiles = pgTable("student_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  university: text("university"),
  department: text("department"),
  studentId: text("student_id"),
  academicYear: text("academic_year"),
  experienceLevel: text("experience_level").default("beginner"),
  track: text("track").default("Web & AI Engineering"),
  learningGoals: jsonb("learning_goals").$type<string[]>().default([]),
  selectedSkills: jsonb("selected_skills").$type<string[]>().default([]),
  careerInterests: jsonb("career_interests").$type<string[]>().default([]),
  weeklyHours: text("weekly_hours").default("10"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  bio: text("bio"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  portfolioUrl: text("portfolio_url"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  skills: jsonb("skills").$type<string[]>().default([]),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mentorProfiles = pgTable("mentor_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  headline: text("headline"),
  expertise: jsonb("expertise").$type<string[]>().default([]),
  skills: jsonb("skills").$type<string[]>().default([]),
  technologies: jsonb("technologies").$type<string[]>().default([]),
  yearsOfExperience: integer("years_of_experience").default(1),
  bio: text("bio"),
  company: text("company"),
  companyOrUniversity: text("company_or_university"),
  hourlyRate: integer("hourly_rate").default(0),
  rating: text("rating").default("5.0"),
  reviewCount: integer("review_count").default(0),
  isApproved: boolean("is_approved").notNull().default(false),
  availabilityStatus: text("availability_status").default("available"), // 'available' | 'busy' | 'offline'
  meetingLink: text("meeting_link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==========================================
// 3. LEARNING MANAGEMENT (Tracks, Courses, Modules, Lessons)
// ==========================================

export const tracks = pgTable("tracks", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").default("Code"),
  orderIndex: integer("order_index").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("Software Engineering"),
  difficulty: text("difficulty").notNull().default("beginner"), // 'beginner' | 'intermediate' | 'advanced'
  trackId: text("track_id").references(() => tracks.id, { onDelete: "set null" }),
  thumbnailUrl: text("thumbnail_url"),
  instructorId: text("instructor_id").references(() => users.id, { onDelete: "set null" }),
  instructorName: text("instructor_name").default("Senior Faculty"),
  durationHours: integer("duration_hours").default(10),
  prerequisites: jsonb("prerequisites").$type<string[]>().default([]),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>().default([]),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const modules = pgTable("modules", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  moduleId: text("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  lessonType: text("lesson_type").notNull().default("video"), // 'video' | 'reading' | 'quiz' | 'coding_lab'
  youtubeVideoId: text("youtube_video_id"),
  durationMinutes: integer("duration_minutes").default(15),
  orderIndex: integer("order_index").notNull().default(0),
  contentMarkdown: text("content_markdown"),
  starterCode: text("starter_code"),
  solutionCode: text("solution_code"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const learningResources = pgTable("learning_resources", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  resourceType: text("resource_type").default("documentation"), // 'documentation' | 'github' | 'slides'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("active"), // 'active' | 'completed' | 'dropped'
  progressPercent: integer("progress_percent").notNull().default(0),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  uniqueIndex("user_course_enrollment_idx").on(table.userId, table.courseId),
]);

export const lessonProgress = pgTable("lesson_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  isCompleted: boolean("is_completed").notNull().default(false),
  watchTimeSeconds: integer("watch_time_seconds").default(0),
  completedAt: timestamp("completed_at"),
}, (table) => [
  uniqueIndex("user_lesson_progress_idx").on(table.userId, table.lessonId),
]);

// ==========================================
// 4. ASSESSMENTS & QUIZZES
// ==========================================

export const assessments = pgTable("assessments", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
  courseId: text("course_id").references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  passingScore: integer("passing_score").default(70),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assessmentQuestions = pgTable("assessment_questions", {
  id: text("id").primaryKey(),
  assessmentId: text("assessment_id").notNull().references(() => assessments.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  options: jsonb("options").$type<{ id: number; text: string }[]>().notNull(),
  correctOptionIndex: integer("correct_option_index").notNull(),
  explanation: text("explanation"),
  orderIndex: integer("order_index").notNull().default(0),
});

export const assessmentAttempts = pgTable("assessment_attempts", {
  id: text("id").primaryKey(),
  assessmentId: text("assessment_id").notNull().references(() => assessments.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  passed: boolean("passed").notNull(),
  answers: jsonb("answers").$type<Record<string, number>>(),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

// ==========================================
// 5. PROJECT-BASED LEARNING
// ==========================================

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull().default("intermediate"), // 'beginner' | 'intermediate' | 'advanced'
  technologies: jsonb("technologies").$type<string[]>().default([]),
  learningObjectives: jsonb("learning_outcomes").$type<string[]>().default([]),
  instructionsMarkdown: text("instructions_markdown"),
  starterRepoUrl: text("starter_repo_url"),
  estimatedHours: integer("estimated_hours").default(20),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectMilestones = pgTable("project_milestones", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(0),
  requirements: jsonb("requirements").$type<string[]>().default([]),
});

export const projectEnrollments = pgTable("project_enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("in_progress"), // 'in_progress' | 'submitted' | 'completed'
  currentMilestone: integer("current_milestone").notNull().default(1),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  uniqueIndex("user_project_enrollment_idx").on(table.userId, table.projectId),
]);

export const projectSubmissions = pgTable("project_submissions", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  githubRepoUrl: text("github_repo_url").notNull(),
  liveDemoUrl: text("live_demo_url"),
  notes: text("notes"),
  status: text("status").notNull().default("pending_review"), // 'pending_review' | 'reviewed' | 'needs_changes'
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectReviews = pgTable("project_reviews", {
  id: text("id").primaryKey(),
  submissionId: text("submission_id").notNull().references(() => projectSubmissions.id, { onDelete: "cascade" }),
  reviewerId: text("reviewer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  score: integer("score").notNull(), // 0-100
  feedbackMarkdown: text("feedback_markdown").notNull(),
  criteriaScores: jsonb("criteria_scores").$type<Record<string, number>>(),
  status: text("status").notNull().default("approved"), // 'approved' | 'changes_requested'
  reviewedAt: timestamp("reviewed_at").notNull().defaultNow(),
});

// ==========================================
// 6. AI CONVERSATIONS & REVIEWS
// ==========================================

export const aiConversations = pgTable("ai_conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("New Conversation"),
  courseId: text("course_id").references(() => courses.id, { onDelete: "set null" }),
  lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const aiMessages = pgTable("ai_messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => aiConversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiCodeReviews = pgTable("ai_code_reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  language: text("language").notNull().default("typescript"),
  codeSnippet: text("code_snippet").notNull(),
  summary: text("summary").notNull(),
  findings: jsonb("findings").$type<{ category: string; severity: "info" | "warning" | "critical"; message: string }[]>().default([]),
  suggestions: jsonb("suggestions").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// 7. MENTORSHIP WORKFLOW
// ==========================================

export const mentorshipRequests = pgTable("mentorship_requests", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mentorId: text("mentor_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
  scheduledAt: timestamp("scheduled_at"),
  meetingUrl: text("meeting_url"),
  mentorNotes: text("mentor_notes"),
  studentFeedback: text("student_feedback"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ==========================================
// 8. CAREER & PORTFOLIO
// ==========================================

export const portfolioItems = pgTable("portfolio_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  techStack: jsonb("tech_stack").$type<string[]>().default([]),
  featured: boolean("featured").notNull().default(false),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// 9. AUDIT LOGS & NOTIFICATIONS
// ==========================================

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
  actorName: text("actor_name").default("System"),
  actorRole: text("actor_role").default("admin"),
  actionType: text("action_type").notNull(), // 'USER_SUSPENDED' | 'MENTOR_APPROVED' | 'COURSE_PUBLISHED' | etc.
  action: text("action"),
  targetId: text("target_id"),
  targetType: text("target_type"),
  details: jsonb("details").$type<any>(),
  ipAddress: text("ip_address"),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // 'info' | 'success' | 'warning' | 'alert'
  linkUrl: text("link_url"),
  link: text("link"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ==========================================
// 10. RELATIONS DEFINITIONS
// ==========================================

export const usersRelations = relations(users, ({ one, many }) => ({
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  mentorProfile: one(mentorProfiles, {
    fields: [users.id],
    references: [mentorProfiles.userId],
  }),
  enrollments: many(enrollments),
  lessonProgress: many(lessonProgress),
  projectSubmissions: many(projectSubmissions),
  notifications: many(notifications),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  track: one(tracks, {
    fields: [courses.trackId],
    references: [tracks.id],
  }),
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  modules: many(modules),
  lessons: many(lessons),
  enrollments: many(enrollments),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  resources: many(learningResources),
  progress: many(lessonProgress),
  assessments: many(assessments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [lessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  milestones: many(projectMilestones),
  enrollments: many(projectEnrollments),
  submissions: many(projectSubmissions),
}));
