/**
 * src/services/career/CareerService.ts
 * Data aggregator service for Student Portfolios, Projects, Skill Matrix, Roadmaps, and Internships
 */

import { StudentPortfolio, CareerProject, SkillProficiency, CareerRoadmap, InternshipOpportunity, MentorRecommendation } from "@/types/career";

export const MOCK_PROJECTS: CareerProject[] = [
  {
    id: "proj-1",
    title: "QbitX AI Mentor & Learning Workspace Platform",
    description: "Full-stack educational workspace platform built with Next.js 16, React 19, TypeScript, and AI streaming.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Python"],
    teamMembers: ["Alex Rivera", "Sophia Lin", "Marcus Vance"],
    mentor: "Dr. Robert Vance",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    demoUrl: "https://qbitx.vercel.app",
    githubUrl: "https://github.com/labib-0/QbitX",
    role: "Lead Full-Stack Developer",
    isFeatured: true,
    completedAt: "2026-07-28",
  },
  {
    id: "proj-2",
    title: "Distributed High-Performance SQL Engine",
    description: "Custom lightweight query optimizer and B-Tree index engine written in Python & Rust.",
    technologies: ["Python", "SQL", "Rust", "Docker"],
    teamMembers: ["Alex Rivera"],
    mentor: "Labib Senior Mentor",
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600",
    githubUrl: "https://github.com/labib-0/sql-engine-demo",
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
    mentorName: "Dr. Robert Vance",
    mentorRole: "Professor of Computer Science (MIT)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    content: "Alex demonstrates exceptional analytical depth in software architecture. His capstone project on AI Mentorship showcased production-ready code quality and leadership.",
    endorsedSkills: ["System Architecture", "Next.js", "Python"],
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
    recommendedCourses: ["Full-Stack Next.js 16 Mastery", "Advanced Python & Algorithmic Design"],
    keySkills: ["Next.js", "TypeScript", "Python", "REST APIs"],
  },
  {
    id: "rdm-ai",
    title: "AI Systems & Machine Learning Engineer",
    description: "Build neural network architectures, vector indexing engines, and LLM agent pipelines.",
    iconName: "BrainCircuit",
    readinessScore: 84,
    recommendedCourses: ["AI Mentor Architecture & LLM Agents", "Distributed SQL Systems"],
    keySkills: ["Python", "PyTorch", "Vector DBs", "LLM APIs"],
  },
];

export const MOCK_INTERNSHIPS: InternshipOpportunity[] = [
  {
    id: "int-1",
    company: "OpenAI",
    role: "Frontend AI Systems Intern",
    location: "San Francisco / Remote",
    matchPercentage: 98,
    status: "applied",
    deadline: "2026-08-15",
  },
  {
    id: "int-2",
    company: "Vercel",
    role: "Next.js Full-Stack Engineer Intern",
    location: "Remote",
    matchPercentage: 95,
    status: "interviewing",
    deadline: "2026-08-20",
  },
  {
    id: "int-3",
    company: "Google",
    role: "Software Engineering Scholar",
    location: "Mountain View, CA",
    matchPercentage: 92,
    status: "saved",
    deadline: "2026-09-01",
  },
];

export class CareerService {
  static getPortfolio(studentId = "usr-student-demo"): StudentPortfolio {
    return {
      studentId,
      name: "Alex Rivera",
      title: "Full-Stack Software Engineer & AI Researcher",
      bio: "Computer Science student passionate about distributed web architectures, AI agents, and production software design.",
      university: "MIT Tech University",
      degree: "B.S. Computer Science",
      gpa: 3.92,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      readinessScore: 88,
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
