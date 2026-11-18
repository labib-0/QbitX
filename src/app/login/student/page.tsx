"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { useAuth } from "@/context/authContext";
import { Eye, EyeOff, RefreshCw, ArrowRight, Sparkles, GraduationCap } from "lucide-react";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("student@qbitx.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login, demoLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "super_admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "mentor") {
        router.push("/mentor/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }
  }, [user, router]);

  const handleInstantDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await demoLogin("student");
      router.push("/student/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in with student demo credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === "admin" || loggedInUser.role === "super_admin") {
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
          Student Portal Sign In
        </h2>
        <p className="text-xs text-muted-foreground">
          Log in to access your student dashboard, capstone projects & AI mentor.
        </p>
      </div>

      {/* 1-Click Demo Box for Judges */}
      <div className="bg-sky-500/10 border border-sky-500/20 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-sky-700 dark:text-sky-300">
            <GraduationCap className="h-4 w-4" />
            <span>Demo Student: Jeifer Gomes (NDUB CSE)</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            student@qbitx.com • password123
          </div>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={handleInstantDemoLogin}
          className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>1-Click Student Login</span>
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@qbitx.com"
            required
            className="w-full rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
          />
        </div>

        {/* Password with Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-3.5 pr-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white px-4 py-3.5 text-sm font-bold shadow-lg shadow-sky-500/25 transition-all font-heading"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In as Student</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to General Login */}
      <div className="text-center pt-2 space-y-1">
        <p className="text-xs text-muted-foreground">
          Need Mentor or Admin access?{" "}
          <Link href="/login" className="text-sky-500 hover:underline font-bold">
            Switch Portal
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
