"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { useAuth } from "@/context/authContext";
import {
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

const DEMO_CONFIGS = {
  student: {
    email: "student@qbitx.com",
    password: "password123",
    name: "Jeifer Gomes",
    title: "Student Profile",
    redirectUrl: "/student/dashboard",
    color: "sky",
    badge: "NDUB CSE Scholar",
  },
  mentor: {
    email: "mentor@qbitx.com",
    password: "password123",
    name: "Dr. Kamal Hossain",
    title: "Senior Mentor",
    redirectUrl: "/mentor/dashboard",
    color: "purple",
    badge: "Principal AI Architect",
  },
  admin: {
    email: "admin@qbitx.com",
    password: "password123",
    name: "System Administrator",
    title: "Platform Admin",
    redirectUrl: "/admin/dashboard",
    color: "amber",
    badge: "Executive Super Admin",
  },
};

function LoginForm() {
  const [email, setEmail] = useState(DEMO_CONFIGS.student.email);
  const [password, setPassword] = useState(DEMO_CONFIGS.student.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [instantRole, setInstantRole] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loginRole, setLoginRole] = useState<"student" | "mentor" | "admin">("student");

  const { login, demoLogin, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // If already authenticated, redirect
  useEffect(() => {
    if (user) {
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (user.role === "admin" || user.role === "super_admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "mentor") {
        router.push("/mentor/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }
  }, [user, callbackUrl, router]);

  const selectRole = (role: "student" | "mentor" | "admin") => {
    setLoginRole(role);
    setEmail(DEMO_CONFIGS[role].email);
    setPassword(DEMO_CONFIGS[role].password);
    setError("");
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInstantLogin = async (role: "student" | "mentor" | "admin") => {
    setError("");
    setInstantRole(role);
    setLoading(true);

    try {
      const loggedInUser = await demoLogin(role);
      const targetUrl =
        callbackUrl ||
        (loggedInUser.role === "admin" || loggedInUser.role === "super_admin"
          ? "/admin/dashboard"
          : loggedInUser.role === "mentor"
          ? "/mentor/dashboard"
          : "/student/dashboard");
      router.push(targetUrl);
    } catch (err: any) {
      setError(err.message || "Failed to log in with demo credentials.");
    } finally {
      setLoading(false);
      setInstantRole(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (loggedInUser.role === "admin" || loggedInUser.role === "super_admin") {
        router.push("/admin/dashboard");
      } else if (loggedInUser.role === "mentor") {
        router.push("/mentor/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout illustrationType="login">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-heading">
          Sign In to QbitX
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter your credentials or choose a 1-click demo account below to explore all platform capabilities.
        </p>
      </div>

      {/* 1-Click Instant Demo Access Box for Judges */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-b from-sky-500/10 via-purple-500/5 to-transparent p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
            <span className="text-xs font-black tracking-wider uppercase text-foreground font-heading">
              1-Click Demo Portals (For Judges & Evaluators)
            </span>
          </div>
          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
            Pre-loaded Mock Data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {/* Student */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleInstantLogin("student")}
            className="flex flex-col items-start p-3 rounded-xl border border-sky-500/30 bg-card hover:bg-sky-500/10 hover:border-sky-500 transition-all text-left group shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="flex items-center gap-1.5 text-xs font-black text-sky-600 dark:text-sky-400 font-heading">
                <GraduationCap className="h-4 w-4" />
                <span>Student</span>
              </span>
              {instantRole === "student" && <RefreshCw className="h-3 w-3 animate-spin text-sky-500" />}
            </div>
            <p className="text-[11px] font-bold text-foreground">Jeifer Gomes</p>
            <p className="text-[10px] text-muted-foreground">student@qbitx.com</p>
            <div className="mt-2 text-[10px] font-bold text-sky-500 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Instant Enter</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Mentor */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleInstantLogin("mentor")}
            className="flex flex-col items-start p-3 rounded-xl border border-purple-500/30 bg-card hover:bg-purple-500/10 hover:border-purple-500 transition-all text-left group shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="flex items-center gap-1.5 text-xs font-black text-purple-600 dark:text-purple-400 font-heading">
                <UserCheck className="h-4 w-4" />
                <span>Mentor</span>
              </span>
              {instantRole === "mentor" && <RefreshCw className="h-3 w-3 animate-spin text-purple-500" />}
            </div>
            <p className="text-[11px] font-bold text-foreground">Dr. Kamal Hossain</p>
            <p className="text-[10px] text-muted-foreground">mentor@qbitx.com</p>
            <div className="mt-2 text-[10px] font-bold text-purple-500 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Instant Enter</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Admin */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleInstantLogin("admin")}
            className="flex flex-col items-start p-3 rounded-xl border border-amber-500/30 bg-card hover:bg-amber-500/10 hover:border-amber-500 transition-all text-left group shadow-sm disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 font-heading">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </span>
              {instantRole === "admin" && <RefreshCw className="h-3 w-3 animate-spin text-amber-500" />}
            </div>
            <p className="text-[11px] font-bold text-foreground">System Admin</p>
            <p className="text-[10px] text-muted-foreground">admin@qbitx.com</p>
            <div className="mt-2 text-[10px] font-bold text-amber-500 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Instant Enter</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        </div>
      </div>

      {/* Role Indicator Pills */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Select Role to Auto-Fill Credentials:
        </span>
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl border border-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => selectRole("student")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              loginRole === "student"
                ? "bg-background text-foreground shadow-sm font-bold border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 text-sky-500" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => selectRole("mentor")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              loginRole === "mentor"
                ? "bg-background text-foreground shadow-sm font-bold border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-purple-500" />
            <span>Mentor</span>
          </button>
          <button
            type="button"
            onClick={() => selectRole("admin")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              loginRole === "admin"
                ? "bg-background text-foreground shadow-sm font-bold border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
              Email Address
            </label>
            <button
              type="button"
              onClick={() => copyToClipboard(email, "email")}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              {copiedField === "email" ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={DEMO_CONFIGS[loginRole].email}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-xs transition-all text-foreground"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
              Password
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => copyToClipboard(password, "pwd")}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                {copiedField === "pwd" ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <Link
                href="/forgot-password"
                className="text-xs text-sky-500 hover:text-sky-400 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-xs transition-all text-foreground pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all font-heading"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Authenticating Session...</span>
            </>
          ) : (
            <>
              <span>Sign In with Selected Credentials</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register/student"
            className="text-sky-500 hover:text-sky-400 font-bold hover:underline font-heading"
          >
            Register as a Student
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-xs font-bold text-muted-foreground">
          Loading Login Portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
