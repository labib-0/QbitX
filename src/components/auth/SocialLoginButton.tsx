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
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);
  const router = useRouter();

  const handleProviderLogin = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      const user = await loginWithProvider(provider, role);
      if (onSuccess) onSuccess();
      if (role === "student") {
        router.push("/onboarding");
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
      <div className="relative flex items-center justify-center my-5">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
        <span className="bg-white dark:bg-slate-900 px-3 text-xs uppercase font-bold text-slate-500 tracking-wider absolute">
          Or Continue With
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Google Demo Button */}
        <button
          type="button"
          onClick={() => handleProviderLogin("google")}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-3 px-4 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors disabled:opacity-50"
        >
          {loadingProvider === "google" ? (
            <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
          ) : (
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
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
          <span>Google (Demo)</span>
        </button>

        {/* GitHub Demo Button */}
        <button
          type="button"
          onClick={() => handleProviderLogin("github")}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-3 px-4 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors disabled:opacity-50"
        >
          {loadingProvider === "github" ? (
            <RefreshCw className="h-4 w-4 animate-spin text-purple-500" />
          ) : (
            <svg className="h-4.5 w-4.5 fill-current text-slate-900 dark:fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          )}
          <span>GitHub (Demo)</span>
        </button>
      </div>
    </div>
  );
}
