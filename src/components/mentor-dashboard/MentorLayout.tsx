"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MentorTopNavbar } from "./MentorTopNavbar";
import { MentorSidebar } from "./MentorSidebar";
import { RefreshCw, AlertTriangle } from "lucide-react";

export function MentorLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading, adminApprovedToggle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login/mentor");
      } else if (user.role !== "mentor" && (user.role as string) !== "admin") {
        router.push("/student/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
          Authenticating Senior Mentor Portal Access...
        </p>
      </div>
    );
  }

  const isApproved = user.isApproved ?? adminApprovedToggle;

  if (!isApproved && (user.role as string) !== "admin") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground font-heading">Senior Mentor Application Under Review</h2>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          Your senior mentor profile is currently being reviewed by the QbitX Admin team. Mentors cannot access operational modules until approved.
        </p>
        <div className="p-3 rounded-2xl bg-muted border border-border text-xs text-foreground font-medium">
          💡 <strong>Demo Tip:</strong> Toggle <em>&quot;Admin Approved State&quot;</em> to Approved in the header banner to test access.
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/login/mentor");
          }}
          className="px-6 py-2.5 rounded-xl bg-foreground text-background text-xs font-extrabold hover:opacity-90"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <MentorTopNavbar />
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <MentorSidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
