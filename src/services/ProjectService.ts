/**
 * ProjectService.ts
 * Manages active student project workspaces, milestones, submissions, and status.
 */

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "In Progress" | "Review Pending" | "Completed";
  sprintProgress: number; // percentage
  nextDeadline: string;
  team: TeamMember[];
  githubRepoUrl: string;
  techStack: string[];
}

export class ProjectService {
  /**
   * Fetch active projects from database API
   */
  static async getActiveProjects(): Promise<Project[]> {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data)) {
        return [];
      }

      return json.data.map((p: any) => {
        let status: "In Progress" | "Review Pending" | "Completed" = "In Progress";
        let progress = 20;

        if (p.enrollment?.status === "completed") {
          status = "Completed";
          progress = 100;
        } else if (p.enrollment?.status === "submitted") {
          status = "Review Pending";
          progress = 85;
        } else if (p.enrollment?.currentMilestone) {
          progress = Math.min(
            80,
            Math.round((p.enrollment.currentMilestone / Math.max(1, p.milestonesCount)) * 100)
          );
        }

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          status,
          sprintProgress: progress,
          nextDeadline: status === "Completed" ? "Completed" : "Next Milestone Due Soon",
          githubRepoUrl: p.starterRepoUrl || "https://github.com/qbitx",
          techStack: p.technologies || [],
          team: [
            {
              id: "student-self",
              name: "Student (You)",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
              role: "Lead Engineer",
            },
          ],
        };
      });
    } catch (error) {
      console.error("ProjectService.getActiveProjects error:", error);
      return [];
    }
  }
}
