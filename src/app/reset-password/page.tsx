"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { SuccessModal } from "@/components/auth/SuccessModal";
import { ArrowRight, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(token ? "" : "Password reset token is missing or invalid. Please request a new link.");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Cannot reset password: token is missing. Please check your reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (res.error) {
        setError(res.error.message || "Failed to update password. Token may have expired.");
        return;
      }

      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    router.push("/login/student");
  };

  return (
    <>
      <ErrorAlert message={error} onDismiss={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showStrengthMeter
          label="New Password"
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirm New Password"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-[1.01] transition-transform disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Update Password</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <SuccessModal
        isOpen={showSuccessModal}
        title="Password Successfully Updated!"
        message="Your QbitX account password has been updated. You can now log in with your new password."
        buttonText="Proceed to Login"
        onConfirm={handleModalConfirm}
      />
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter your new secure password below to complete password recovery."
      role="student"
      showDemoAdminBanner={false}
    >
      <Suspense fallback={<div className="text-center py-6 text-sm text-slate-500">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
