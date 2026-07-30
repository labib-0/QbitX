"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RoleSelector } from "@/components/auth/RoleSelector";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { useAuth } from "@/context/authContext";
import { Mail, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

export default function MentorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleFillDemo = () => {
    setEmail("mentor@qbitx.com");
    setPassword("password123");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password, "mentor");
      router.push("/dashboard/mentor");
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
      <RoleSelector currentRole="mentor" action="login" />

      {/* 1-Click Demo Fill Banner */}
      <div className="bg-purple-500/10 border border-purple-500/20 p-3.5 rounded-xl flex items-center justify-between gap-2 text-sm">
        <div className="text-purple-700 dark:text-purple-300 font-semibold">
          <strong>Demo Creds:</strong> <code className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-purple-300 px-2 py-0.5 rounded font-bold">mentor@qbitx.com</code>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-purple-500 transition-colors shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" /> Auto-Fill Demo
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Senior Mentor Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mentor@qbitx.com"
              required
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-purple-600 focus:ring-purple-500"
            />
            <span>Remember Me</span>
          </label>

          <Link href="/forgot-password" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:scale-[1.01] transition-transform disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Login to Senior Mentor Portal</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <SocialLoginButton role="mentor" />

      {/* Footer Link */}
      <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2 font-medium">
        Want to apply as a mentor?{" "}
        <Link href="/register/mentor" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
          Apply as Senior Mentor
        </Link>
      </p>
    </AuthLayout>
  );
}
