/**
 * ProjectService.ts
 * Manages active student project workspaces, team members, sprint progress, and deadlines.
 * 
 * TODO: Replace mock data with Supabase / Firebase / REST API integration.
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
   * Fetch active projects
   * TODO: API integration -> GET /api/student/projects
   */
  static async getActiveProjects(): Promise<Project[]> {
    return [
      {
        id: "proj-101",
        title: "QbitX Realtime AI Code Reviewer",
        description: "An automated AST & LLM code reviewing pipeline for university student submissions.",
        status: "In Progress",
        sprintProgress: 82,
        nextDeadline: "Friday, 11:59 PM",
        githubRepoUrl: "https://github.com/qbitx/ai-code-reviewer",
        techStack: ["Next.js", "TypeScript", "Tailwind", "Python", "FastAPI"],
        team: [
          {
            id: "m-1",
            name: "Labib (You)",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
            role: "Lead Frontend Engineer",
          },
          {
            id: "m-2",
            name: "Tariq Hasan",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
            role: "Backend Architect",
          },
          {
            id: "m-3",
            name: "Ayesha Malik",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
            role: "AI Model Specialist",
          },
        ],
      },
      {
        id: "proj-102",
        title: "Distributed KV Caching Engine",
        description: "A high-performance in-memory key-value store with Raft consensus protocol.",
        status: "In Progress",
        sprintProgress: 60,
        nextDeadline: "Aug 5, 2026",
        githubRepoUrl: "https://github.com/qbitx/raft-kv-store",
        techStack: ["Go", "gRPC", "Docker", "Raft Protocol"],
        team: [
          {
            id: "m-1",
            name: "Labib (You)",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
            role: "Systems Dev",
          },
          {
            id: "m-4",
            name: "David Kim",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
            role: "DevOps Engineer",
          },
        ],
      },
      {
        id: "proj-103",
        title: "PASS Session Scheduler Web App",
        description: "Intelligent slot matching algorithm for senior mentors and student study guilds.",
        status: "Completed",
        sprintProgress: 100,
        nextDeadline: "Completed",
        githubRepoUrl: "https://github.com/qbitx/pass-scheduler",
        techStack: ["React", "PostgreSQL", "Node.js"],
        team: [
          {
            id: "m-1",
            name: "Labib (You)",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
            role: "Full-Stack Dev",
          },
        ],
      },
    ];
  }
}
