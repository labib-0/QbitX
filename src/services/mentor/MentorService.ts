/**
 * src/services/mentor/MentorService.ts
 * Mentor portal data manager consuming unified content data and student progress
 */

import {
  MentorStats,
  StudentProfileSummary,
  AssignmentSubmissionItem,
  TeamMonitorItem,
  ClassAnalyticsSummary,
} from "@/types/mentor";

export const MOCK_MENTOR_STATS: MentorStats = {
  totalStudents: 142,
  activeCourses: 4,
  activeTeams: 12,
  pendingAssignmentsCount: 18,
  pendingGradingCount: 9,
  averageCompletionRatePct: 84,
  studentSatisfactionRating: 4.9,
  totalHoursMentored: 124,
};

export const MOCK_STUDENTS_LIST: StudentProfileSummary[] = [
  {
    id: "usr-student-demo",
    name: "Alex Rivera",
    email: "student@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    track: "Software Engineering & AI",
    department: "Computer Science",
    university: "Stanford / Tech University",
    enrolledCoursesCount: 4,
    completedLessonsCount: 18,
    streakDays: 14,
    averageGrade: "A+ (98%)",
    certificatesCount: 2,
    healthStatus: "exceeding",
    lastActive: "10 mins ago",
  },
  {
    id: "usr-student-2",
    name: "Sarah Jenkins",
    email: "sarah.j@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    track: "Full-Stack Web Engineering",
    department: "Computer Science",
    university: "MIT / Tech University",
    enrolledCoursesCount: 3,
    completedLessonsCount: 12,
    streakDays: 8,
    averageGrade: "A (92%)",
    certificatesCount: 1,
    healthStatus: "on_track",
    lastActive: "2 hours ago",
  },
  {
    id: "usr-student-3",
    name: "Michael Chen",
    email: "m.chen@qbitx.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    track: "Software Engineering & AI",
    department: "Electrical Engineering",
    university: "Tech University",
    enrolledCoursesCount: 2,
    completedLessonsCount: 4,
    streakDays: 2,
    averageGrade: "C+ (74%)",
    certificatesCount: 0,
    healthStatus: "at_risk",
    lastActive: "3 days ago",
  },
];

export const MOCK_SUBMISSIONS: AssignmentSubmissionItem[] = [
  {
    id: "sub-1",
    studentId: "usr-student-demo",
    studentName: "Alex Rivera",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    assignmentTitle: "RAG Pipeline Architecture Capstone",
    courseTitle: "Full-Stack AI Web Engineering",
    submittedAt: "Today, 10:15 AM",
    status: "pending_review",
    repoUrl: "https://github.com/alex-rivera/qbitx-rag-pipeline",
    maxScore: 100,
  },
  {
    id: "sub-2",
    studentId: "usr-student-2",
    studentName: "Sarah Jenkins",
    studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    assignmentTitle: "Binary Search Tree Traversal Lab",
    courseTitle: "Introduction to Programming Language",
    submittedAt: "Yesterday, 4:30 PM",
    status: "pending_review",
    repoUrl: "https://github.com/sarah-j/bst-traversal",
    maxScore: 100,
  },
  {
    id: "sub-3",
    studentId: "usr-student-3",
    studentName: "Michael Chen",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    assignmentTitle: "SQL Joins & Normalization Quiz",
    courseTitle: "CS Fundamentals",
    submittedAt: "3 days ago",
    status: "needs_attention",
    maxScore: 100,
  },
];

export const MOCK_TEAMS: TeamMonitorItem[] = [
  {
    id: "team-1",
    name: "Team VectorDevs",
    projectName: "AI Code Reviewer SaaS",
    membersCount: 4,
    sprintProgressPct: 85,
    recentCommitsCount: 24,
    collaborationScore: 96,
    healthStatus: "healthy",
    lastCommitMessage: "feat(rag): connect Supabase vector embeddings store",
  },
  {
    id: "team-2",
    name: "Team CyberQ",
    projectName: "Distributed KV Store in Go",
    membersCount: 3,
    sprintProgressPct: 40,
    recentCommitsCount: 6,
    collaborationScore: 68,
    healthStatus: "needs_help",
    lastCommitMessage: "fix(raft): resolve deadlock in leader election",
  },
];

export class MentorService {
  static getStats(): MentorStats {
    return MOCK_MENTOR_STATS;
  }

  static getStudents(query?: string): StudentProfileSummary[] {
    if (!query) return MOCK_STUDENTS_LIST;
    const q = query.toLowerCase();
    return MOCK_STUDENTS_LIST.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.track.toLowerCase().includes(q)
    );
  }

  static getSubmissions(): AssignmentSubmissionItem[] {
    return MOCK_SUBMISSIONS;
  }

  static getTeams(): TeamMonitorItem[] {
    return MOCK_TEAMS;
  }
}
