/**
 * AnalyticsService.ts
 * Provides charts, performance metrics, and heatmap data for student learning analytics.
 * 
 * TODO: Replace with real analytics API.
 */

export class AnalyticsService {
  static async getAnalyticsData() {
    return {
      weeklyHours: [
        { day: "Mon", hours: 4.5 },
        { day: "Tue", hours: 6.2 },
        { day: "Wed", hours: 5.0 },
        { day: "Thu", hours: 7.8 },
        { day: "Fri", hours: 6.5 },
        { day: "Sat", hours: 8.2 },
        { day: "Sun", hours: 4.3 },
      ],
      skillRadar: [
        { skill: "Programming", score: 95 },
        { skill: "Problem Solving", score: 90 },
        { skill: "Git & GitHub", score: 88 },
        { skill: "Communication", score: 84 },
        { skill: "Presentation", score: 80 },
        { skill: "Leadership", score: 82 },
        { skill: "Teamwork", score: 92 },
        { skill: "AI Usage", score: 96 },
        { skill: "Research", score: 85 },
      ],
      xpBreakdown: [
        { category: "Code Reviews", xp: 3200 },
        { category: "Assignments", xp: 2400 },
        { category: "PASS Meetings", xp: 1650 },
        { category: "Guild Projects", xp: 1200 },
      ],
    };
  }
}
