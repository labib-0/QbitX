/**
 * DashboardService.ts
 * Manages student dashboard stats, streak, level, and overview data.
 * 
 * TODO: Replace mock data with real Supabase / Firebase / REST API endpoints.
 */

export interface StudentStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  skillScore: number; // 0-100
  weeklyProgress: number; // percentage
  overallProgress: number; // percentage
  learningStreak: number; // days
  studyTimeHours: number;
  projectsCompleted: number;
  certificatesEarned: number;
  leaderboardRank: number;
  totalStudents: number;
}

export interface StudentOverview {
  name: string;
  avatar: string;
  role: string;
  university: string;
  department: string;
  stats: StudentStats;
}

export class DashboardService {
  /**
   * Fetch main student overview stats
   * TODO: API integration -> GET /api/student/overview
   */
  static async getOverview(): Promise<StudentOverview> {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      name: "Labib",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      role: "Student Software Engineer",
      university: "Stanford University",
      department: "Computer Science & Engineering",
      stats: {
        level: 12,
        xp: 8450,
        xpToNextLevel: 10000,
        skillScore: 92,
        weeklyProgress: 78,
        overallProgress: 64,
        learningStreak: 14,
        studyTimeHours: 42.5,
        projectsCompleted: 6,
        certificatesEarned: 4,
        leaderboardRank: 4,
        totalStudents: 1250,
      },
    };
  }

  /**
   * Update student learning streak
   * TODO: API integration -> POST /api/student/streak/check-in
   */
  static async checkInStreak(): Promise<{ streak: number }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { streak: 15 };
  }
}
