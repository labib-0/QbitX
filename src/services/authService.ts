import { supabase } from "@/lib/supabaseClient";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "student" | "mentor";
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
  photoFile?: File | null;
  cvFile?: File | null;
  documentsFile?: File | null;
}

// In-memory + LocalStorage store for fallback/demo
const REGISTERED_USERS_KEY = "qbitx_registered_users";

function getStoredUsers(): UserProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveUserToStorage(user: UserProfile) {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredUsers();
    const updated = [user, ...existing.filter(u => u.email.toLowerCase() !== user.email.toLowerCase())];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
  );
};

export const AuthService = {
  /**
   * Login student or mentor with email & password via Supabase Auth
   */
  async login(email: string, password: string, role: "student" | "mentor"): Promise<UserProfile> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        const metadata = data.user.user_metadata || {};
        const profile: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: metadata.full_name || metadata.name || email.split("@")[0],
          role: metadata.role || role,
          university: metadata.university || "Tech University",
          department: metadata.department || "Computer Science",
          studentId: metadata.studentId || `CS-${data.user.id.slice(-4)}`,
          experienceLevel: metadata.experienceLevel || "Intermediate",
          track: metadata.track || "Web Development",
          isVerified: !!data.user.email_confirmed_at,
          onboardingCompleted: true,
        };
        saveUserToStorage(profile);
        return profile;
      }
    }

    // Fallback local storage auth for testing without keys
    await new Promise((resolve) => setTimeout(resolve, 500));
    const storedUsers = getStoredUsers();
    const foundUser = storedUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );

    if (foundUser) {
      if (role === "mentor" && !foundUser.isApproved) {
        throw new Error("Your mentor application is currently under review by QbitX Admin.");
      }
      return foundUser;
    }

    if (email.toLowerCase() === "student@qbitx.com") {
      return {
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
      };
    }

    throw new Error("No registered account found with this email. Please register first!");
  },

  /**
   * Register a new student with Supabase Auth
   */
  async registerStudent(params: RegisterStudentParams): Promise<UserProfile> {
    if (isSupabaseConfigured()) {
      const fullName = `${params.firstName} ${params.lastName}`.trim();
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: fullName,
            firstName: params.firstName,
            lastName: params.lastName,
            role: "student",
            university: params.university,
            department: params.department,
            studentId: params.studentId,
            experience: params.experience,
            track: params.track,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const userId = data.user?.id || `usr_std_${Date.now()}`;
      const newUser: UserProfile = {
        id: userId,
        email: params.email,
        name: fullName,
        role: "student",
        university: params.university || "Tech University",
        department: params.department || "Computer Science",
        studentId: params.studentId || `CS-${Date.now().toString().slice(-4)}`,
        experienceLevel: params.experience || "Beginner",
        track: params.track || "Web Development",
        isVerified: true,
        onboardingCompleted: true,
      };
      saveUserToStorage(newUser);
      return newUser;
    }

    // Fallback local registration
    await new Promise((resolve) => setTimeout(resolve, 600));
    const storedUsers = getStoredUsers();
    const existing = storedUsers.find((u) => u.email.toLowerCase() === params.email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email address already exists. Please login instead.");
    }

    const newUser: UserProfile = {
      id: `usr_std_${Date.now()}`,
      email: params.email,
      name: `${params.firstName} ${params.lastName}`.trim(),
      role: "student",
      university: params.university || "Tech University",
      department: params.department || "Computer Science",
      studentId: params.studentId || `CS-${Date.now().toString().slice(-4)}`,
      experienceLevel: params.experience || "Beginner",
      track: params.track || "Web Development",
      isVerified: true,
      onboardingCompleted: true,
    };

    saveUserToStorage(newUser);
    return newUser;
  },

  /**
   * Register a new mentor application
   */
  async registerMentor(params: RegisterMentorParams): Promise<{ user: UserProfile; needsApproval: boolean }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: "TempPassword123!",
        options: {
          data: {
            full_name: params.fullName,
            role: "mentor",
            areaOfExpertise: params.areaOfExpertise,
            isApproved: false,
          },
        },
      });

      if (error) throw new Error(error.message);

      const newMentor: UserProfile = {
        id: data.user?.id || `usr_mnt_${Date.now()}`,
        email: params.email,
        name: params.fullName,
        role: "mentor",
        department: params.areaOfExpertise,
        isVerified: true,
        isApproved: false,
        onboardingCompleted: true,
      };

      saveUserToStorage(newMentor);
      return { user: newMentor, needsApproval: true };
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    const newMentor: UserProfile = {
      id: `usr_mnt_${Date.now()}`,
      email: params.email,
      name: params.fullName,
      role: "mentor",
      department: params.areaOfExpertise,
      isVerified: true,
      isApproved: false,
      onboardingCompleted: true,
    };

    saveUserToStorage(newMentor);
    return { user: newMentor, needsApproval: true };
  },

  /**
   * Send Password Reset Link via Supabase Auth
   */
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw new Error(error.message);
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    return true;
  },

  /**
   * Google OAuth Sign-in & Sign-up via Supabase Auth
   */
  async loginWithProvider(provider: "google", role: "student" | "mentor"): Promise<UserProfile> {
    if (isSupabaseConfigured()) {
      const redirectTo = typeof window !== "undefined"
        ? `${window.location.origin}/student/dashboard`
        : "https://qbitx.vercel.app/student/dashboard";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // signInWithOAuth redirects the browser window directly to Google OAuth consent page.
      // Do NOT execute demo fallback code!
      return new Promise<UserProfile>(() => {});
    }

    // Only fallback if Supabase environment keys are completely unconfigured
    await new Promise((resolve) => setTimeout(resolve, 500));
    const googleUser: UserProfile = {
      id: `usr_google_${Date.now()}`,
      email: `student_google@gmail.com`,
      name: `Google Student`,
      role,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      university: "Stanford / Tech University",
      department: "Computer Science & AI",
      studentId: `GOOGLE-${Date.now().toString().slice(-4)}`,
      experienceLevel: "Intermediate",
      track: "Full Stack Web Development",
      isVerified: true,
      isApproved: true,
      onboardingCompleted: true,
    };

    saveUserToStorage(googleUser);
    return googleUser;
  },

  /**
   * Sign out from Supabase Session
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("qbitx_auth_user");
    }
  },
};
