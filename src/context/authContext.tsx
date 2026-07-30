"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  AuthService,
  RegisterStudentParams,
  RegisterMentorParams,
} from "@/services/authService";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  adminApprovedToggle: boolean; // Demo toggle for admin approval testing
  setAdminApprovedToggle: (approved: boolean) => void;
  login: (email: string, password: string, role: "student" | "mentor") => Promise<UserProfile>;
  loginWithProvider: (provider: "google" | "github", role: "student" | "mentor") => Promise<UserProfile>;
  registerStudent: (params: RegisterStudentParams) => Promise<UserProfile>;
  registerMentor: (params: RegisterMentorParams) => Promise<{ user: UserProfile; needsApproval: boolean }>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "qbitx_auth_user";
const ADMIN_TOGGLE_KEY = "qbitx_admin_approved_toggle";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminApprovedToggle, setAdminApprovedToggleState] = useState<boolean>(true);

  useEffect(() => {
    // Load stored session & demo admin toggle state
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedToggle = localStorage.getItem(ADMIN_TOGGLE_KEY);
      if (storedToggle !== null) {
        setAdminApprovedToggleState(storedToggle === "true");
      }
    } catch (e) {
      console.error("Failed to parse auth storage:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const setAdminApprovedToggle = (approved: boolean) => {
    setAdminApprovedToggleState(approved);
    localStorage.setItem(ADMIN_TOGGLE_KEY, approved ? "true" : "false");
    if (user && user.role === "mentor") {
      const updated = { ...user, isApproved: approved };
      saveUserSession(updated);
    }
  };

  const login = async (email: string, password: string, role: "student" | "mentor") => {
    const loggedInUser = await AuthService.login(email, password, role);
    
    // Check if mentor requires admin approval override by toggle
    if (role === "mentor") {
      loggedInUser.isApproved = adminApprovedToggle;
      if (!adminApprovedToggle) {
        throw new Error("Your mentor application is pending admin review. Toggle 'Admin Approved' in top banner to test.");
      }
    }

    saveUserSession(loggedInUser);
    return loggedInUser;
  };

  const loginWithProvider = async (provider: "google" | "github", role: "student" | "mentor") => {
    const socialUser = await AuthService.loginWithProvider(provider, role);
    saveUserSession(socialUser);
    return socialUser;
  };

  const registerStudent = async (params: RegisterStudentParams) => {
    const newStudent = await AuthService.registerStudent(params);
    saveUserSession(newStudent);
    return newStudent;
  };

  const registerMentor = async (params: RegisterMentorParams) => {
    const res = await AuthService.registerMentor(params);
    if (adminApprovedToggle) {
      res.user.isApproved = true;
      saveUserSession(res.user);
    }
    return res;
  };

  const logout = () => {
    saveUserSession(null);
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...data };
      saveUserSession(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        adminApprovedToggle,
        setAdminApprovedToggle,
        login,
        loginWithProvider,
        registerStudent,
        registerMentor,
        logout,
        updateUser,
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
