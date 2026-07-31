"use client";

import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface SocialLoginButtonProps {
  role: "student" | "mentor";
  onSuccess?: () => void;
}

export function SocialLoginButton({ role, onSuccess }: SocialLoginButtonProps) {
  const { loginWithProvider } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<"google" | null>(null);
  const router = useRouter();

  const handleProviderLogin = async (provider: "google") => {
    setLoadingProvider(provider);
    try {
      await loginWithProvider(provider, role);
      if (onSuccess) onSuccess();
      if (role === "student") {
        router.push("/student/dashboard");
      } else {
        router.push("/dashboard/mentor");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        <span className="bg-white dark:bg-slate-900 px-3 text-xs uppercase font-bold text-slate-500 tracking-wider absolute">
          Or Continue With
        </span>
      </div>

      <div>
        {/* Google Registration & Login Button */}
        <button
          type="button"
          onClick={() => handleProviderLogin("google")}
          disabled={loadingProvider !== null}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 py-3.5 px-4 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-400 transition-all shadow-sm disabled:opacity-50 font-heading"
        >
          {loadingProvider === "google" ? (
            <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
          ) : (
            <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

