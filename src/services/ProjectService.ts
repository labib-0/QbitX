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

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "proj-bkash-ledger",
    title: "bKash/Nagad Real-Time Payment Gateway & Ledger Simulator",
    description: "High-concurrency digital wallet ledger simulating instant mobile financial services, idempotent webhook callbacks, and double-entry reconciliation.",
    status: "Review Pending",
    sprintProgress: 85,
    nextDeadline: "Mentor Code Review In Progress",
    githubRepoUrl: "https://github.com/tanvir-ahmed-buet/bkash-ledger-simulator",
    techStack: ["Next.js", "TypeScript", "Neon PostgreSQL", "ACID Transactions", "Webhooks"],
    team: [
      {
        id: "student-self",
        name: "Tanvir Ahmed (You)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        role: "Lead Systems Architect",
      },
      {
        id: "student-peer-1",
        name: "Anika Tabassum",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        role: "Frontend Engineer",
      },
      {
        id: "student-peer-2",
        name: "Nafis Fuad",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        role: "Security Engineer",
      },
    ],
  },
  {
    id: "proj-dhaka-traffic",
    title: "Dhaka Smart Traffic Flow Optimizer & Route Planning Engine",
    description: "Real-time traffic congestion analysis and shortest-path routing optimization engine modeled on Dhaka's arterial road networks and flyovers.",
    status: "In Progress",
    sprintProgress: 60,
    nextDeadline: "Milestone 2 Due Friday",
    githubRepoUrl: "https://github.com/tanvir-ahmed-buet/dhaka-traffic-optimizer",
    techStack: ["Python", "FastAPI", "Graph Theory", "A* Search", "Next.js"],
    team: [
      {
        id: "student-self",
        name: "Tanvir Ahmed (You)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        role: "Graph Algorithm Engineer",
      },
      {
        id: "student-peer-3",
        name: "Sumaiya Rahman",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        role: "Full-Stack Engineer",
      },
    ],
  },
];

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
      if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
        return FALLBACK_PROJECTS;
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
              name: "Tanvir Ahmed (You)",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
              role: "Lead Engineer",
            },
          ],
        };
      });
    } catch (error) {
      console.warn("ProjectService.getActiveProjects using fallback:", error);
      return FALLBACK_PROJECTS;
    }
  }
}
