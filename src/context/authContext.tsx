"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient, useSession, signIn, signUp, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "student" | "mentor" | "admin" | "super_admin";
  status?: string;
  image?: string | null;
  avatarUrl?: string | null;
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
  university?: string;
  department?: string;
  studentId?: string;
  academicYear?: string;
  email: string;
  phone?: string;
  password: string;
  country?: string;
  city?: string;
  experience?: string;
  track?: string;
}

export interface RegisterMentorParams {
  fullName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  yearsOfExperience?: string;
  areaOfExpertise?: string;
  bio?: string;
  password?: string;
  photoFile?: any;
  cvFile?: any;
  documentsFile?: any;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  registerStudent: (params: RegisterStudentParams) => Promise<UserProfile>;
  registerMentor: (params: RegisterMentorParams) => Promise<{ user: UserProfile; needsApproval: boolean }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionData?.user) {
      const u = sessionData.user as any;
      setProfile({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role || "student",
        status: u.status || "active",
        image: u.image,
        avatarUrl: u.image,
        isVerified: !!u.emailVerified,
        isApproved: u.role === "mentor" ? false : true,
      });
      setHasLoadedInitially(true);
    } else if (!isPending) {
      authClient
        .getSession()
        .then((res) => {
          if (res.data?.user) {
            const u = res.data.user as any;
            setProfile({
              id: u.id,
              email: u.email,
              name: u.name,
              role: u.role || "student",
              status: u.status || "active",
              image: u.image,
              avatarUrl: u.image,
              isVerified: !!u.emailVerified,
              isApproved: u.role === "mentor" ? false : true,
            });
          } else {
            setProfile(null);
          }
          setHasLoadedInitially(true);
        })
        .catch(() => {
          setProfile(null);
          setHasLoadedInitially(true);
        });
    }
  }, [sessionData, isPending]);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const res = await signIn.email({
      email,
      password,
    });

    if (res.error) {
      throw new Error(res.error.message || "Invalid credentials. Please verify your email and password.");
    }

    const u = res.data?.user as any;
    const userProfile: UserProfile = {
      id: u?.id || "",
      email: u?.email || email,
      name: u?.name || "",
      role: u?.role || "student",
      status: u?.status || "active",
      image: u?.image,
      avatarUrl: u?.image,
      isVerified: !!u?.emailVerified,
      isApproved: true,
    };
    setProfile(userProfile);
    return userProfile;
  };

  const registerStudent = async (params: RegisterStudentParams): Promise<UserProfile> => {
    const fullName = `${params.firstName} ${params.lastName}`.trim();
    const res = await signUp.email({
      email: params.email,
      password: params.password,
      name: fullName,
    });

    if (res.error) {
      throw new Error(res.error.message || "Registration failed. Please check your information.");
    }

    // Call student onboarding/profile initialization
    try {
      await fetch("/api/student/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: params.university || "",
          department: params.department || "",
          studentId: params.studentId || "",
          academicYear: params.academicYear || "",
          experienceLevel: params.experience || "beginner",
          track: params.track || "Web & AI Engineering",
        }),
      });
    } catch (e) {
      // Non-blocking for signup
    }

    const u = res.data?.user as any;
    const userProfile: UserProfile = {
      id: u?.id || "",
      email: params.email,
      name: fullName,
      role: "student",
      isVerified: false,
      university: params.university,
      department: params.department,
      track: params.track,
    };
    setProfile(userProfile);
    return userProfile;
  };

  const registerMentor = async (params: RegisterMentorParams): Promise<{ user: UserProfile; needsApproval: boolean }> => {
    const res = await signUp.email({
      email: params.email,
      password: params.password || "MentorTempPass123!",
      name: params.fullName,
    });

    if (res.error) {
      throw new Error(res.error.message || "Mentor application submission failed.");
    }

    const u = res.data?.user as any;
    const userProfile: UserProfile = {
      id: u?.id || "",
      email: params.email,
      name: params.fullName,
      role: "mentor",
      isVerified: false,
      isApproved: false,
    };
    return { user: userProfile, needsApproval: true };
  };

  const logout = async () => {
    await signOut();
    setProfile(null);
    router.push("/login");
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...data });
    }
  };

  const refreshSession = async () => {
    // Better auth refresh
  };

  return (
    <AuthContext.Provider
      value={{
        user: profile,
        isLoading: isPending || !hasLoadedInitially,
        login,
        registerStudent,
        registerMentor,
        logout,
        updateUser,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
