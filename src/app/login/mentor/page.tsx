"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { useAuth } from "@/context/authContext";
import { Mail, ArrowRight, Sparkles, RefreshCw, UserCheck } from "lucide-react";

export default function MentorLoginPage() {
  const [email, setEmail] = useState("mentor@qbitx.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const router = useRouter();

  const handleInstantDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await demoLogin("mentor");
      router.push("/mentor/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in with mentor demo credentials.");
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
      if (loggedInUser.role === "admin" || loggedInUser.role === "super_admin" || loggedInUser.email.includes("admin")) {
        router.push("/admin/dashboard");
      } else if (loggedInUser.role === "mentor" || loggedInUser.email.includes("mentor") || loggedInUser.email === "sarah.chen@qbitx.com") {
        router.push("/mentor/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Try mentor@qbitx.com / password123.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Senior Mentor Portal Login"
      subtitle="Access mentee code submissions, review queues, and PASS session schedules."
      role="mentor"
    >
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-heading">
          Welcome Back, Mentor
        </h2>
        <p className="text-xs text-muted-foreground">
          Log in to access your review queue and mentee submissions.
        </p>
      </div>

      <RoleSelector currentRole="mentor" action="login" />

      {/* 1-Click Demo Login Box for Judges */}
      <div className="bg-purple-500/10 border border-purple-500/20 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-300">
            <UserCheck className="h-4 w-4" />
            <span>Senior Mentor: Dr. Kamal Hossain</span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            mentor@qbitx.com • password123
          </div>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={handleInstantDemoLogin}
          className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl font-bold text-xs transition-colors shadow-sm whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>1-Click Mentor Login</span>
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
            Institutional or Corporate Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="mentor@qbitx.com"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs transition-all text-foreground pl-10"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
              Secure Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-purple-500 hover:text-purple-400 font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all font-heading"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Verifying Mentor Access...</span>
            </>
          ) : (
            <>
              <span>Sign In to Mentor Portal</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to General Login */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Need Student or Admin portal?{" "}
          <Link href="/login" className="text-purple-500 hover:underline font-bold">
            All Portals
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
