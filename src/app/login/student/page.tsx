"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { useAuth } from "@/context/authContext";
import { Eye, EyeOff, Sparkles, RefreshCw, ArrowRight } from "lucide-react";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleFillDemo = () => {
    setEmail("student@qbitx.com");
    setPassword("password123");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password, "student");
      router.push("/student/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Try student@qbitx.com / password123.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout illustrationType="login">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-heading">
          Welcome Back
        </h2>
        <p className="text-xs text-muted-foreground">Log in to access your student dashboard & courses.</p>
      </div>

      {/* Demo Creds Banner */}
      <div className="bg-sky-500/10 border border-sky-500/20 p-3 rounded-2xl flex items-center justify-between gap-2 text-xs">
        <span className="text-sky-700 dark:text-sky-300 font-semibold">
          Demo: <strong>student@qbitx.com</strong>
        </span>
        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center gap-1 bg-sky-500 text-white px-3 py-1 rounded-xl font-bold text-xs hover:bg-sky-600 transition-colors shadow-sm font-heading"
        >
          <Sparkles className="h-3.5 w-3.5" /> Auto-Fill
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
            placeholder="Email"
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Remember Me & Forgot password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-800 text-sky-500 focus:ring-sky-500"
            />
            <span>Remember Me</span>
          </label>

          <Link href="/forgot-password" className="text-sky-600 dark:text-sky-400 font-extrabold hover:underline font-heading">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-500 hover:bg-sky-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-heading"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Log in</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-xs text-slate-600 dark:text-slate-400 pt-2 font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/register/student" className="text-sky-600 dark:text-sky-400 font-extrabold hover:underline font-heading">
          Register now
        </Link>
      </p>
    </AuthLayout>
  );
}
