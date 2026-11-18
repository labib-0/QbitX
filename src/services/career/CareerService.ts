/**
 * src/services/career/CareerService.ts
 * Data aggregator service for Student Portfolios, Projects, Skill Matrix, Roadmaps, and Internships
 */

import { StudentPortfolio, CareerProject, SkillProficiency, CareerRoadmap, InternshipOpportunity, MentorRecommendation } from "@/types/career";

export const MOCK_PROJECTS: CareerProject[] = [
  {
    id: "proj-1",
    title: "bKash/Nagad Real-Time Payment Gateway & Ledger Simulator",
    description: "High-concurrency digital wallet ledger simulating instant mobile financial services (MFS), idempotent webhook callbacks, and double-entry accounting reconciliation.",
    technologies: ["Next.js", "TypeScript", "Neon PostgreSQL", "ACID Transactions", "Webhooks"],
    teamMembers: ["Jeifer Gomes", "Anika Tabassum", "Nafis Fuad"],
    mentor: "Dr. Tariqul Islam (BUET)",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    demoUrl: "https://bkash-ledger-jeifer.vercel.app",
    githubUrl: "https://github.com/jeifer-gomes/bkash-ledger-simulator",
    role: "Lead Full-Stack Developer",
    isFeatured: true,
    completedAt: "2026-07-28",
  },
  {
    id: "proj-2",
    title: "Dhaka Smart Traffic Flow Optimizer & Route Planning Engine",
    description: "Real-time traffic congestion analysis and shortest-path routing optimization engine modeled on Dhaka's arterial road networks, flyovers, and elevated expressways.",
    technologies: ["Python", "FastAPI", "Graph Theory", "A* Search", "Next.js"],
    teamMembers: ["Jeifer Gomes", "Sumaiya Rahman"],
    mentor: "Eng. Mahbubur Rahman",
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600",
    githubUrl: "https://github.com/jeifer-gomes/dhaka-traffic-optimizer",
    role: "Systems Developer",
    isFeatured: true,
    completedAt: "2026-06-15",
  },
];

export const MOCK_SKILLS: SkillProficiency[] = [
  { skillName: "Python", category: "Languages", level: "Expert", proficiencyScore: 94, source: "labs" },
  { skillName: "Next.js / React", category: "Frameworks", level: "Advanced", proficiencyScore: 90, source: "projects" },
  { skillName: "TypeScript", category: "Languages", level: "Advanced", proficiencyScore: 88, source: "courses" },
  { skillName: "SQL & Relational DBs", category: "Databases", level: "Advanced", proficiencyScore: 85, source: "labs" },
  { skillName: "Docker & Cloud", category: "Tools", level: "Intermediate", proficiencyScore: 78, source: "projects" },
  { skillName: "System Architecture", category: "Soft Skills", level: "Advanced", proficiencyScore: 86, source: "labs" },
];

export const MOCK_RECOMMENDATIONS: MentorRecommendation[] = [
  {
    id: "rec-1",
    mentorName: "Dr. Tariqul Islam",
    mentorRole: "Associate Professor of CSE, BUET",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    content: "Jeifer demonstrates exceptional analytical depth in software architecture and algorithms. His capstone project on the bKash Payment Ledger showcased production-ready code quality and leadership.",
    endorsedSkills: ["System Architecture", "Next.js", "Python", "SQL & Relational DBs"],
    date: "2026-07-29",
  },
];

export const MOCK_ROADMAPS: CareerRoadmap[] = [
  {
    id: "rdm-fullstack",
    title: "Full-Stack AI & Web Engineer",
    description: "Master modern web frameworks, API integration, and LLM-powered backend workflows.",
    iconName: "Code2",
    readinessScore: 92,
    recommendedCourses: ["Full-Stack AI Web Engineering with Next.js", "Practical Data Structures & Algorithms"],
    keySkills: ["Next.js", "TypeScript", "Python", "REST APIs"],
  },
  {
    id: "rdm-ai",
    title: "AI Systems & Machine Learning Engineer",
    description: "Build neural network architectures, vector indexing engines, and LLM agent pipelines.",
    iconName: "BrainCircuit",
    readinessScore: 84,
    recommendedCourses: ["Machine Learning & Bengali NLP Foundations", "Cloud Backend & Microservices Architecture"],
    keySkills: ["Python", "PyTorch", "Vector DBs", "LLM APIs"],
  },
];

export const MOCK_INTERNSHIPS: InternshipOpportunity[] = [
  {
    id: "int-1",
    company: "bKash Limited",
    role: "FinTech Software Engineering Intern",
    location: "Dhaka (Shadhinata Tower) / Hybrid",
    matchPercentage: 98,
    status: "applied",
    deadline: "2026-08-15",
  },
  {
    id: "int-2",
    company: "Brain Station 23",
    role: "Full-Stack Cloud & AI Intern",
    location: "Mohakhali, Dhaka",
    matchPercentage: 95,
    status: "interviewing",
    deadline: "2026-08-20",
  },
  {
    id: "int-3",
    company: "ShopUp / Chaldal",
    role: "Backend Logistics Engineering Intern",
    location: "Banani, Dhaka",
    matchPercentage: 92,
    status: "saved",
    deadline: "2026-09-01",
  },
];

export class CareerService {
  static getPortfolio(studentId = "usr-student-demo"): StudentPortfolio {
    return {
      studentId,
      name: "Jeifer Gomes",
      title: "Full-Stack Software Engineer & AI Researcher",
      bio: "3rd-year CSE undergraduate at Notre Dame University Bangladesh (NDUB). Specializing in Full-Stack Web & AI Engineering, cloud microservices, and distributed systems.",
      university: "Notre Dame University Bangladesh (NDUB)",
      degree: "B.Sc. in Computer Science & Engineering (3rd Year)",
      gpa: 3.92,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      readinessScore: 92,
      skills: MOCK_SKILLS,
      projects: MOCK_PROJECTS,
      recommendations: MOCK_RECOMMENDATIONS,
      roadmaps: MOCK_ROADMAPS,
      internships: MOCK_INTERNSHIPS,
      privacySettings: {
        showEmail: true,
        showProjects: true,
        showCertificates: true,
        showRecommendations: true,
      },
    };
  }
}
