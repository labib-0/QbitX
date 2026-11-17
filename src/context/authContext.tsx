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
  hasMentorApplication?: boolean;
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
  designation?: string;
  organization?: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  yearsOfExperience?: string;
  areaOfExpertise?: string;
  bio?: string;
  password: string;
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

function mapSessionUser(u: any): UserProfile {
  const role = (u?.role || "student") as UserProfile["role"];
  return {
    id: u?.id || "",
    email: u?.email || "",
    name: u?.name || "",
    role,
    status: u?.status || "active",
    image: u?.image ?? null,
    avatarUrl: u?.image ?? null,
    isVerified: !!u?.emailVerified,
    // Mentor approval is resolved server-side in withMentorStatus().
    isApproved: role === "admin" || role === "super_admin",
    hasMentorApplication: false,
  };
}

/**
 * Resolve mentor application/approval state from the server so the mentor
 * portal cannot be unlocked by client-side state.
 */
async function withMentorStatus(base: UserProfile): Promise<UserProfile> {
  if (base.role === "admin" || base.role === "super_admin") {
    return { ...base, isApproved: true, hasMentorApplication: false };
  }

  try {
    const res = await fetch("/api/mentors/me", { cache: "no-store" });
    if (!res.ok) {
      // A transient failure must not lock an already-approved mentor out;
      // the mentor role is only granted after administrative approval.
      return { ...base, isApproved: base.role === "mentor" };
    }

    const json = await res.json();
    const profile = json?.data;
    if (!profile) {
      return { ...base, isApproved: false, hasMentorApplication: false };
    }

    return {
      ...base,
      isApproved: !!profile.isApproved,
      hasMentorApplication: true,
    };
  } catch {
    return { ...base, isApproved: base.role === "mentor" };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      let base: UserProfile | null = null;

      if (sessionData?.user) {
        base = mapSessionUser(sessionData.user);
      } else if (!isPending) {
        try {
          const res = await authClient.getSession();
          base = res.data?.user ? mapSessionUser(res.data.user) : null;
        } catch {
          base = null;
        }
      } else {
        // Session is still resolving; keep isLoading true.
        return;
      }

      const resolved = base ? await withMentorStatus(base) : null;
      if (cancelled) return;
      setProfile(resolved);
      setHasLoadedInitially(true);
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [sessionData, isPending]);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    const res = await signIn.email({
      email,
      password,
    });

    if (res.error) {
      throw new Error(res.error.message || "Invalid credentials. Please verify your email and password.");
    }

    const userProfile = await withMentorStatus(
      mapSessionUser({ ...(res.data?.user || {}), email: res.data?.user?.email || email })
    );
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

    const userProfile: UserProfile = {
      ...mapSessionUser({ ...(res.data?.user || {}), email: params.email, name: fullName }),
      role: "student",
      isVerified: false,
      isApproved: false,
      hasMentorApplication: false,
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
      password: params.password,
      name: params.fullName,
    });

    if (res.error) {
      throw new Error(res.error.message || "Mentor application submission failed.");
    }

    // Persist the application as a mentor_profiles row. Without this the
    // applicant exists as a bare user account and an admin has nothing to
    // review or approve.
    const profileRes = await fetch("/api/mentors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline: `${params.areaOfExpertise || "Engineering"} Mentor${
          params.designation ? ` · ${params.designation}` : ""
        }`.slice(0, 120),
        bio: params.bio || "Mentor application submitted via QbitX mentor registration.",
        expertise: [params.areaOfExpertise, params.designation].filter(
          (value): value is string => !!value
        ),
        company: params.organization || "",
        yearsOfExperience: parseInt(params.yearsOfExperience || "1", 10) || 1,
        hourlyRate: 0,
      }),
    });

    if (!profileRes.ok) {
      const errorBody = await profileRes.json().catch(() => null);
      throw new Error(
        errorBody?.error ||
          "Your account was created, but the mentor application could not be saved. Please contact support@qbitx.com."
      );
    }

    const userProfile: UserProfile = {
      ...mapSessionUser({ ...(res.data?.user || {}), email: params.email, name: params.fullName }),
      // The mentor role is granted only by an administrator after approval.
      role: "student",
      isVerified: false,
      isApproved: false,
      hasMentorApplication: true,
    };
    setProfile(userProfile);
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
