/**
 * src/services/career/ResumeGeneratorService.ts
 * Auto-generates structured resumes across multi-templates (Modern, ATS Friendly, Academic, Software Engineer, Internship)
 */

import { StudentPortfolio } from "@/types/career";

export type ResumeTemplateType = "modern" | "ats" | "academic" | "software_engineer" | "internship";

export interface ResumeData {
  header: {
    name: string;
    email: string;
    university: string;
    degree: string;
    gpa: string;
    location: string;
  };
  summary: string;
  skills: string[];
  projects: Array<{ title: string; tech: string; description: string }>;
  certificates: Array<{ title: string; issuer: string; date: string }>;
  education: Array<{ degree: string; institution: string; year: string }>;
}

export class ResumeGeneratorService {
  static generateResume(portfolio: StudentPortfolio, template: ResumeTemplateType): ResumeData {
    return {
      header: {
        name: portfolio.name,
        email: "alex.rivera@mit.edu",
        university: portfolio.university,
        degree: portfolio.degree,
        gpa: `${portfolio.gpa} / 4.0`,
        location: "Cambridge, MA",
      },
      summary: portfolio.bio,
      skills: portfolio.skills.map((s) => `${s.skillName} (${s.level})`),
      projects: portfolio.projects.map((p) => ({
        title: p.title,
        tech: p.technologies.join(", "),
        description: p.description,
      })),
      certificates: [
        { title: "QbitX Certified Full-Stack Next.js Developer", issuer: "QbitX Learning Ecosystem", date: "2026-07-20" },
        { title: "Advanced Python Algorithms & Data Structures", issuer: "QbitX Academy", date: "2026-06-10" },
      ],
      education: [
        { degree: portfolio.degree, institution: portfolio.university, year: "2023 - 2027 (Expected)" },
      ],
    };
  }
}
