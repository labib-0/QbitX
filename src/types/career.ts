/**
 * src/types/career.ts
 * Career Development & Portfolio Hub Models
 */

export interface SkillProficiency {
  skillName: string;
  category: "Languages" | "Frameworks" | "Databases" | "Tools" | "Soft Skills";
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  proficiencyScore: number; // 0 - 100
  source: "courses" | "labs" | "projects";
}

export interface CareerProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  teamMembers: string[];
  mentor: string;
  thumbnail: string;
  demoUrl?: string;
  githubUrl?: string;
  role: string;
  isFeatured: boolean;
  completedAt: string;
}

export interface MentorRecommendation {
  id: string;
  mentorName: string;
  mentorRole: string;
  avatar: string;
  content: string;
  endorsedSkills: string[];
  date: string;
}

export interface CareerRoadmap {
  id: string;
  title: string;
  description: string;
  iconName: string;
  readinessScore: number;
  recommendedCourses: string[];
  keySkills: string[];
}

export interface InternshipOpportunity {
  id: string;
  company: string;
  role: string;
  location: string;
  matchPercentage: number;
  status: "saved" | "applied" | "interviewing" | "offered";
  deadline: string;
  applyUrl?: string;
}

export interface StudentPortfolio {
  studentId: string;
  name: string;
  title: string;
  bio: string;
  university: string;
  degree: string;
  gpa: number;
  avatar: string;
  readinessScore: number;
  skills: SkillProficiency[];
  projects: CareerProject[];
  recommendations: MentorRecommendation[];
  roadmaps: CareerRoadmap[];
  internships: InternshipOpportunity[];
  privacySettings: {
    showEmail: boolean;
    showProjects: boolean;
    showCertificates: boolean;
    showRecommendations: boolean;
  };
}
