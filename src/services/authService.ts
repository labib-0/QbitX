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

// In-memory + LocalStorage store for registered users
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

export const AuthService = {
  /**
   * Login student or mentor with email & password.
   * Requires registration!
   */
  async login(email: string, password: string, role: "student" | "mentor"): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 600));

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

    // Default demo user if email is student@qbitx.com
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
   * Register a new student
   */
  async registerStudent(params: RegisterStudentParams): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 800));

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
    await new Promise((resolve) => setTimeout(resolve, 900));

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

    return {
      user: newMentor,
      needsApproval: true,
    };
  },

  /**
   * Send Password Reset Link
   */
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  },

  /**
   * Demo Google / GitHub OAuth Login or Registration
   */
  async loginWithProvider(provider: "google" | "github", role: "student" | "mentor"): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const googleUser: UserProfile = {
      id: `usr_google_${Date.now()}`,
      email: `student_${provider}@gmail.com`,
      name: `Google Demo Student`,
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
};
