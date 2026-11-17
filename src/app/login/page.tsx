"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { useAuth } from "@/context/authContext";
import { Eye, EyeOff, RefreshCw, ArrowRight, ShieldCheck, UserCheck, GraduationCap } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginRole, setLoginRole] = useState<"student" | "mentor" | "admin">("student");

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (user.role === "admin" || user.role === "super_admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "mentor") {
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
          Enter your credentials to access your unified learning environment.
        </p>
      </div>

      {/* Role Indicator Pills */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl border border-border text-xs font-semibold">
        <button
          type="button"
          onClick={() => setLoginRole("student")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            loginRole === "student"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5 text-sky-500" />
          <span>Student</span>
        </button>
        <button
          type="button"
          onClick={() => setLoginRole("mentor")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            loginRole === "mentor"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="h-3.5 w-3.5 text-purple-500" />
          <span>Mentor</span>
        </button>
        <button
          type="button"
          onClick={() => setLoginRole("admin")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            loginRole === "admin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
          <span>Admin</span>
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={
              loginRole === "admin"
                ? "admin@qbitx.com"
                : loginRole === "mentor"
                ? "sarah.chen@qbitx.com"
                : "student@example.com"
            }
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-xs transition-all text-foreground"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-sky-500 hover:text-sky-400 font-medium hover:underline"
            >
              Forgot password?
            </Link>
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
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
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
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs font-bold text-muted-foreground">Loading Login Portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
