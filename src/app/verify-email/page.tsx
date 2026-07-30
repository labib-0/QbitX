"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Mail, CheckCircle2, RefreshCw, ArrowRight, Clock, Sparkles } from "lucide-react";
import { EmailVerificationService } from "@/services/emailVerificationService";

export default function VerifyEmailPage() {
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    let interval: any = null;
    if (timer > 0 && !isVerified) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, isVerified]);

  const handleResend = async () => {
    if (!canResend) return;
    setIsResending(true);
    try {
      await EmailVerificationService.resendVerificationEmail("student@qbitx.com");
      setTimer(60);
      setCanResend(false);
    } finally {
      setIsResending(false);
    }
  };

  const handleSimulateVerification = () => {
    setIsVerified(true);
  };

  return (
    <AuthLayout
      title="Verify Your Email Address"
      subtitle="We sent a verification link to student@qbitx.com. Please confirm your email to activate full platform features."
      role="student"
      showDemoAdminBanner={false}
    >
      {!isVerified ? (
        <div className="text-center py-6 space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <Mail className="h-8 w-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-xl">Check Your Email Inbox</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Click the verification link inside the email we sent to <strong className="text-sky-600 dark:text-sky-400">student@qbitx.com</strong>.
            </p>
          </div>

          {/* Countdown & Resend */}
          <div className="pt-2 flex flex-col items-center gap-3">
            {!canResend ? (
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <Clock className="h-4 w-4 text-sky-500" />
                <span>Resend link available in <strong className="text-sky-600 dark:text-sky-400 font-mono">{timer}s</strong></span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-5 py-2.5 text-sm font-bold text-sky-600 dark:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {isResending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" /> Resend Verification Email
                  </>
                )}
              </button>
            )}

            {/* Demo Trigger Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 w-full">
              <button
                type="button"
                onClick={handleSimulateVerification}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-transform"
              >
                <Sparkles className="h-4 w-4" /> Demo: Simulate Email Verification Success
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h3 className="font-extrabold text-slate-900 dark:text-white text-2xl">Verification Success!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your email address has been verified. You can now complete your onboarding profile.
          </p>

          <button
            onClick={() => router.push("/onboarding")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-[1.01] transition-transform"
          >
            <span>Proceed to Student Onboarding</span>
            <ArrowRight className="h-4 w-4" />
          </button>
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
