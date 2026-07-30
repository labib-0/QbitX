/**
 * GitHubService.ts
 * Manages GitHub integration, repositories, contribution graph, and recent commits.
 * 
 * TODO: Replace with GitHub REST/GraphQL API integration.
 */

export interface GitHubRepo {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
  isPrivate: boolean;
}

export interface CommitItem {
  id: string;
  repo: string;
  message: string;
  hash: string;
  timeAgo: string;
}

export class GitHubService {
  static async getGitHubData() {
    return {
      username: "labib-dev",
      connected: true,
      profileUrl: "https://github.com/labib-dev",
      totalCommitsThisYear: 648,
      streakDays: 24,
      languages: [
        { name: "TypeScript", percentage: 48, color: "#3178c6" },
        { name: "Python", percentage: 26, color: "#3572A5" },
        { name: "Go", percentage: 14, color: "#00ADD8" },
        { name: "CSS / HTML", percentage: 12, color: "#563d7c" },
      ],
      repos: [
        {
          id: "r1",
          name: "qbitx-ai-reviewer",
          description: "Realtime AST & AI code analysis tool built with Next.js & FastAPI",
          stars: 42,
          forks: 9,
          language: "TypeScript",
          updatedAt: "2 hours ago",
          isPrivate: false,
        },
        {
          id: "r2",
          name: "raft-consensus-go",
          description: "Distributed consensus algorithm implementation in Golang",
          stars: 18,
          forks: 3,
          language: "Go",
          updatedAt: "3 days ago",
          isPrivate: false,
        },
        {
          id: "r3",
          name: "dsa-competitive-python",
          description: "250+ Solved LeetCode & Codeforces problems with explanations",
          stars: 87,
          forks: 21,
          language: "Python",
          updatedAt: "5 days ago",
          isPrivate: false,
        },
      ] as GitHubRepo[],
      recentCommits: [
        {
          id: "c1",
          repo: "qbitx-ai-reviewer",
          message: "feat: add AST parser for Python 3.12 syntax check",
          hash: "a9f81d3",
          timeAgo: "2 hours ago",
        },
        {
          id: "c2",
          repo: "qbitx-ai-reviewer",
          message: "fix: solve hydration mismatch in navbar component",
          hash: "7e23b01",
          timeAgo: "5 hours ago",
        },
        {
          id: "c3",
          repo: "raft-consensus-go",
          message: "refactor: add leader heartbeat interval timer",
          hash: "b34c902",
          timeAgo: "Yesterday",
        },
      ] as CommitItem[],
    };
  }
}
