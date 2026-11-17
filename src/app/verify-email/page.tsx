"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Mail, CheckCircle2, RefreshCw, ArrowRight, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [isVerifying, setIsVerifying] = useState<boolean>(!!token);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resendStatus, setResendStatus] = useState<string>("");
  const [isResending, setIsResending] = useState<boolean>(false);

  const router = useRouter();
  const { data: session } = authClient.useSession();
  const activeEmail = emailParam || session?.user?.email || "your registered email";

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    async function verify() {
      setIsVerifying(true);
      setError("");
      try {
        const res = await authClient.verifyEmail({
          query: { token },
        });

        if (!isMounted) return;

        if (res.error) {
          setError(res.error.message || "Email verification token is invalid or expired.");
        } else {
          setIsVerified(true);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to verify email token. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    verify();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async () => {
    if (!activeEmail || activeEmail === "your registered email") {
      setError("Please log in or supply your email to request a new verification link.");
      return;
    }

    setIsResending(true);
    setResendStatus("");
    setError("");

    try {
      const res = await authClient.sendVerificationEmail({
        email: activeEmail,
        callbackURL: "/verify-email",
      });

      if (res.error) {
        setError(res.error.message || "Failed to send verification link.");
      } else {
        setResendStatus("A new verification link has been dispatched to your email address.");
      }
    } catch (err: any) {
      setError(err.message || "Error requesting verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email Address"
      subtitle={`We sent a verification link to ${activeEmail}. Please confirm your email to activate full platform features.`}
      role="student"
      showDemoAdminBanner={false}
    >
      {isVerifying ? (
        <div className="text-center py-8 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-xl">Verifying Token...</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please wait while we validate your email verification link against the database.
          </p>
        </div>
      ) : isVerified ? (
        <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h3 className="font-extrabold text-slate-900 dark:text-white text-2xl">Verification Success!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your email address has been verified in the database. You can now proceed to your student onboarding.
          </p>

          <button
            onClick={() => router.push("/onboarding")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-[1.01] transition-transform"
          >
            <span>Proceed to Student Onboarding</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="text-center py-6 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <Mail className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-xl">Check Your Email Inbox</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              Click the link inside the verification email to verify your account. If you did not receive the email, you can request a new one below.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50 text-left">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resendStatus && (
            <div className="p-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-left">
              {resendStatus}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors disabled:opacity-50"
            >
              {isResending ? (
                <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
              ) : (
                <RefreshCw className="h-4 w-4 text-sky-500" />
              )}
              <span>Resend Verification Email</span>
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2 font-medium">
        Need to change your email?{" "}
        <Link href="/register/student" className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
          Update Email
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-slate-500">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
