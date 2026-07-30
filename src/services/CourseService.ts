/**
 * CourseService.ts
 * Manages active courses, learning roadmaps, and course progress.
 * 
 * TODO: Replace mock data with Supabase / Firebase / REST API integration.
 */

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  thumbnail: string;
  progress: number; // 0-100
  totalModules: number;
  completedModules: number;
  estimatedTimeLeft: string;
  lastAccessed: string;
  nextTopic: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "locked";
  iconName: string;
  skillsAcquired: string[];
}

export class CourseService {
  /**
   * Fetch active student courses
   * TODO: API integration -> GET /api/student/courses/active
   */
  static async getActiveCourses(): Promise<Course[]> {
    return [
      {
        id: "cs-101",
        title: "Full-Stack AI Web Engineering",
        category: "Web & AI Track",
        instructor: "Dr. Sarah Chen",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
        progress: 74,
        totalModules: 12,
        completedModules: 9,
        estimatedTimeLeft: "3h 45m left",
        lastAccessed: "2 hours ago",
        nextTopic: "Building RAG Pipeline with LangChain & Next.js",
      },
      {
        id: "dsa-201",
        title: "Advanced Data Structures & Algorithms",
        category: "Core Computer Science",
        instructor: "Prof. Alex Rivera",
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
        progress: 88,
        totalModules: 10,
        completedModules: 8,
        estimatedTimeLeft: "1h 30m left",
        lastAccessed: "Yesterday",
        nextTopic: "Graph Algorithms: Dijkstra & A* Search",
      },
      {
        id: "sys-301",
        title: "Cloud Infrastructure & DevOps Mastery",
        category: "Cloud & Systems",
        instructor: "Elena Rostova",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
        progress: 45,
        totalModules: 8,
        completedModules: 3,
        estimatedTimeLeft: "6h 10m left",
        lastAccessed: "3 days ago",
        nextTopic: "Kubernetes Cluster Configuration & Helm Charts",
      },
    ];
  }

  /**
   * Fetch learning roadmap stages
   * TODO: API integration -> GET /api/student/roadmap
   */
  static async getRoadmap(): Promise<RoadmapStep[]> {
    return [
      {
        id: "step-1",
        title: "CS Foundation",
        description: "Logic, Discrete Math, Computational Thinking",
        status: "completed",
        iconName: "Binary",
        skillsAcquired: ["Logic Gates", "Boolean Algebra", "Problem Decomposition"],
      },
      {
        id: "step-2",
        title: "Programming Essentials",
        description: "Python, C++, Memory Management, OOP",
        status: "completed",
        iconName: "Code",
        skillsAcquired: ["OOP", "Pointers", "File I/O"],
      },
      {
        id: "step-3",
        title: "Data Structures & Algorithms",
        description: "Trees, Graphs, Dynamic Programming, Complexity Analysis",
        status: "completed",
        iconName: "Cpu",
        skillsAcquired: ["Big-O Notation", "Trees", "Sorting"],
      },
      {
        id: "step-4",
        title: "Git & Collaborative Dev",
        description: "Version Control, GitHub Flow, Code Reviews, CI/CD",
        status: "completed",
        iconName: "GitBranch",
        skillsAcquired: ["Git Rebase", "Pull Requests", "GitHub Actions"],
      },
      {
        id: "step-5",
        title: "Databases & Systems",
        description: "PostgreSQL, Redis, Schema Design, ORMs",
        status: "current",
        iconName: "Database",
        skillsAcquired: ["SQL Joins", "Indexing", "Caching Strategies"],
      },
      {
        id: "step-6",
        title: "Modern Web Engineering",
        description: "TypeScript, React, Next.js, Tailwind CSS",
        status: "current",
        iconName: "Globe",
        skillsAcquired: ["SSR / SSG", "State Management", "Tailwind CSS"],
      },
      {
        id: "step-7",
        title: "Backend & Cloud Services",
        description: "REST & GraphQL APIs, Node.js, Docker, AWS",
        status: "locked",
        iconName: "Server",
        skillsAcquired: ["Microservices", "Docker Containers", "JWT Auth"],
      },
      {
        id: "step-8",
        title: "Production Projects",
        description: "Building Real-World SaaS with PASS Mentors",
        status: "locked",
        iconName: "Layers",
        skillsAcquired: ["Agile/Scrum", "Deployment", "Telemetry"],
      },
      {
        id: "step-9",
        title: "AI Research & RAG Systems",
        description: "LLMs, Vector Embeddings, PyTorch, Fine-Tuning",
        status: "locked",
        iconName: "Sparkles",
        skillsAcquired: ["Vector DBs", "Prompt Engineering", "RAG"],
      },
      {
        id: "step-10",
        title: "Career & Senior Engineer Placement",
        description: "Technical Interview Mastery, Resume & Portfolio Launch",
        status: "locked",
        iconName: "Briefcase",
        skillsAcquired: ["System Design", "Mock Interviews", "Salary Negotiation"],
      },
    ];
  }
}
