/**
 * authService.ts
 * Unified authentication facade bridging to Better Auth Client & User Profiles
 */

import { authClient } from "@/lib/auth-client";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "student" | "mentor" | "admin" | "super_admin";
  avatarUrl?: string;
  university?: string;
  department?: string;
  studentId?: string;
  experienceLevel?: string;
  track?: string;
  isVerified?: boolean;
  isApproved?: boolean;
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
  experience: string;
  track: string;
}

export interface RegisterMentorParams {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github?: string;
  portfolio?: string;
  yearsOfExperience: string;
  areaOfExpertise: string;
  bio: string;
  password: string;
  photoFile?: any;
  cvFile?: any;
  documentsFile?: any;
}

export class AuthService {
  static async loginWithPassword(email: string, password: string): Promise<UserProfile> {
    const res = await authClient.signIn.email({
      email,
      password,
    });

    if (res.error) {
      throw new Error(res.error.message || "Invalid email or password");
    }

    const session = await authClient.getSession();
    const user = session?.data?.user;

    return {
      id: user?.id || `usr-${Date.now()}`,
      email,
      name: user?.name || email.split("@")[0],
      role: ((user as any)?.role as any) || "student",
      isVerified: true,
      onboardingCompleted: true,
    };
  }

  static async registerStudent(params: RegisterStudentParams): Promise<UserProfile> {
    const fullName = `${params.firstName} ${params.lastName}`.trim();
    const res = await authClient.signUp.email({
      email: params.email,
      password: params.password,
      name: fullName,
    });

    if (res.error) {
      throw new Error(res.error.message || "Registration failed");
    }

    // Call onboarding API to save student profile
    try {
      await fetch("/api/student/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: params.university,
          department: params.department,
          studentId: params.studentId,
          academicYear: params.academicYear,
          experienceLevel: params.experience || "beginner",
          track: params.track || "Web & AI Engineering",
          learningGoals: [],
          selectedSkills: [],
          careerInterests: [],
          weeklyHours: "10",
        }),
      });
    } catch (e) {
      console.warn("Could not immediately trigger onboarding API:", e);
    }

    return {
      id: res.data?.user?.id || `usr-${Date.now()}`,
      email: params.email,
      name: fullName,
      role: "student",
      university: params.university,
      department: params.department,
      studentId: params.studentId,
      experienceLevel: params.experience,
      track: params.track,
      isVerified: true,
      onboardingCompleted: true,
    };
  }

  static async registerMentor(params: RegisterMentorParams): Promise<UserProfile> {
    const res = await authClient.signUp.email({
      email: params.email,
      password: params.password,
      name: params.fullName,
    });

    if (res.error) {
      throw new Error(res.error.message || "Mentor registration failed");
    }

    // Submit mentor application
    try {
      await fetch("/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: `Expert in ${params.areaOfExpertise}`,
          bio: params.bio,
          expertise: [params.areaOfExpertise],
          company: "",
          yearsOfExperience: parseInt(params.yearsOfExperience) || 1,
          hourlyRate: 0,
        }),
      });
    } catch (e) {
      console.warn("Could not immediately create mentor application profile:", e);
    }

    return {
      id: res.data?.user?.id || `usr-${Date.now()}`,
      email: params.email,
      name: params.fullName,
      role: "mentor",
      isApproved: false,
    };
  }

  static async resetPassword(email: string): Promise<void> {
    const res = await (authClient as any).requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    if (res?.error) {
      throw new Error(res.error.message || "Failed to send reset link.");
    }
  }

  static async logout(): Promise<void> {
    await authClient.signOut();
  }
}
