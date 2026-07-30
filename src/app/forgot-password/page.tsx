"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { AuthService } from "@/services/authService";
import { Mail, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await AuthService.sendPasswordResetEmail(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your account email address and we'll send you a password reset link."
      role="student"
      showDemoAdminBanner={false}
    >
      <ErrorAlert message={error} onDismiss={() => setError("")} />

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Account Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                required
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 pl-10 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-[1.01] transition-transform disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Send Password Reset Link</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-xl">Reset Link Sent!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We sent a password reset link to <strong className="text-sky-600 dark:text-sky-400">{email}</strong>. Please check your inbox and click the link to reset your password.
          </p>
          <div className="pt-2">
            <Link
              href="/reset-password"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Demo: Proceed to Reset Password Page <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2 font-medium">
        Remembered your password?{" "}
        <Link href="/login/student" className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
          Return to Login
        </Link>
      </p>
    </AuthLayout>
  );
}
