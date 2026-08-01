/**
 * src/types/mentor.ts
 * Mentor Dashboard (Teacher Portal) Data Types
 */

export interface MentorStats {
  totalStudents: number;
  activeCourses: number;
  activeTeams: number;
  pendingAssignmentsCount: number;
  pendingGradingCount: number;
  averageCompletionRatePct: number;
  studentSatisfactionRating: number;
  totalHoursMentored: number;
}

export interface StudentProfileSummary {
  id: string;
  name: string;
  email: string;
  avatar: string;
  track: string;
  department: string;
  university: string;
  enrolledCoursesCount: number;
  completedLessonsCount: number;
  streakDays: number;
  averageGrade: string;
  certificatesCount: number;
  healthStatus: "on_track" | "at_risk" | "exceeding";
  lastActive: string;
}

export interface AssignmentSubmissionItem {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  assignmentTitle: string;
  courseTitle: string;
  submittedAt: string;
  status: "pending_review" | "graded" | "late" | "needs_attention";
  repoUrl?: string;
  provisionalScore?: number;
  maxScore: number;
  mentorComment?: string;
}

export interface TeamMonitorItem {
  id: string;
  name: string;
  projectName: string;
  membersCount: number;
  sprintProgressPct: number;
  recentCommitsCount: number;
  collaborationScore: number;
  healthStatus: "healthy" | "needs_help" | "behind_schedule";
  lastCommitMessage: string;
}

export interface ClassAnalyticsSummary {
  weeklyActiveLearners: number[];
  assignmentCompletionRates: Record<string, number>;
  gradeDistribution: Record<string, number>; // "A": 45, "B": 35, etc.
}
