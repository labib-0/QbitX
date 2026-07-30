/**
 * AuthService — Future-ready authentication service wrapper.
 * Currently uses mock/demo data and local state.
 * 
 * TODO: Integrate Supabase or Firebase Auth here:
 * - import { supabase } from '@/lib/supabase'
 * - supabase.auth.signUp(...)
 * - supabase.auth.signInWithPassword(...)
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "student" | "mentor" | "admin";
  avatarUrl?: string;
  isVerified?: boolean;
  isApproved?: boolean; // For mentors
  university?: string;
  department?: string;
  studentId?: string;
  experienceLevel?: string;
  track?: string;
  onboardingCompleted?: boolean;
}

export interface RegisterStudentParams {
  firstName: string;
  lastName: string;
  university: string;
  department: string;
  studentId: string;
  academicYear: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  city: string;
  linkedin?: string;
  github?: string;
  experience: string;
  track: string;
}

export interface RegisterMentorParams {
  fullName: string;
  designation: string;
  organization: string;
  university: string;
  email: string;
  phone: string;
  linkedin: string;
  github?: string;
  portfolio?: string;
  yearsOfExperience: string;
  areaOfExpertise: string;
  bio: string;
  photoFile?: File | null;
  cvFile?: File | null;
  documentsFile?: File | null;
}

const MOCK_USERS: UserProfile[] = [
  {
    id: "usr_student_demo",
    email: "student@qbitx.com",
    name: "Alex Rivera",
    role: "student",
    university: "MIT / Tech University",
    department: "Computer Science",
    studentId: "CS2026-881",
    experienceLevel: "Intermediate",
    track: "Web Development",
    isVerified: true,
    onboardingCompleted: true,
  },
  {
    id: "usr_mentor_demo",
    email: "mentor@qbitx.com",
    name: "Sarah Chen",
    role: "mentor",
    university: "Stanford University",
    department: "AI & Data Science",
    isVerified: true,
    isApproved: true,
    onboardingCompleted: true,
  },
];

export const AuthService = {
  /**
   * Login student or mentor with email & password
   */
  async login(email: string, password: string, role: "student" | "mentor"): Promise<UserProfile> {
    // TODO: Replace with Supabase `supabase.auth.signInWithPassword({ email, password })`
    // or Firebase `signInWithEmailAndPassword(auth, email, password)`
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Demo check
    const existing = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );

    if (existing) {
      if (role === "mentor" && !existing.isApproved) {
        throw new Error("Your mentor application is currently under review by QbitX Admin.");
      }
      return existing;
    }

    // Default fallback demo user creation if logging in with custom email
    return {
      id: `usr_${Date.now()}`,
      email,
      name: email.split("@")[0],
      role,
      isVerified: true,
      isApproved: role === "student" ? true : false,
      onboardingCompleted: false,
    };
  },

  /**
   * Register a new student
   */
  async registerStudent(params: RegisterStudentParams): Promise<UserProfile> {
    // TODO: Replace with Supabase `supabase.auth.signUp(...)` and insert into `profiles` table
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (params.email.toLowerCase() === "duplicate@qbitx.com") {
      throw new Error("An account with this email address already exists.");
    }

    return {
      id: `usr_std_${Date.now()}`,
      email: params.email,
      name: `${params.firstName} ${params.lastName}`,
      role: "student",
      university: params.university,
      department: params.department,
      studentId: params.studentId,
      experienceLevel: params.experience,
      track: params.track,
      isVerified: false,
      onboardingCompleted: false,
    };
  },

  /**
   * Register a new mentor application
   */
  async registerMentor(params: RegisterMentorParams): Promise<{ user: UserProfile; needsApproval: boolean }> {
    // TODO: Replace with Supabase storage upload for CV/Docs + Supabase Auth insert
    await new Promise((resolve) => setTimeout(resolve, 900));

    const newMentor: UserProfile = {
      id: `usr_mnt_${Date.now()}`,
      email: params.email,
      name: params.fullName,
      role: "mentor",
      university: params.university,
      department: params.areaOfExpertise,
      isVerified: true,
      isApproved: false, // Default under review
      onboardingCompleted: true,
    };

    return {
      user: newMentor,
      needsApproval: true,
    };
  },

  /**
   * Send Password Reset Link
   */
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    // TODO: Replace with Supabase `supabase.auth.resetPasswordForEmail(email)`
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  },

  /**
   * Social OAuth Login (Google / GitHub)
   */
  async loginWithProvider(provider: "google" | "github", role: "student" | "mentor"): Promise<UserProfile> {
    // TODO: Replace with Supabase `supabase.auth.signInWithOAuth({ provider })`
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      id: `usr_social_${Date.now()}`,
      email: `user_${provider}@example.com`,
      name: `${provider.toUpperCase()} Demo User`,
      role,
      isVerified: true,
      isApproved: true,
      onboardingCompleted: false,
    };
  },
};
