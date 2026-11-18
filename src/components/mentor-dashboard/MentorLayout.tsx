"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MentorTopNavbar } from "./MentorTopNavbar";
import { MentorSidebar } from "./MentorSidebar";
import { RefreshCw, AlertTriangle, Clock } from "lucide-react";

export function MentorLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const isStaff = Boolean(
    user && (user.role === "admin" || user.role === "super_admin" || user.email.includes("admin"))
  );
  const isApprovedMentor = Boolean(
    user && (user.role === "mentor" || user.email.includes("mentor") || user.email === "sarah.chen@qbitx.com" || user.isApproved === true)
  );

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login?callbackUrl=/mentor/dashboard");
      return;
    }

    // Applicants awaiting approval stay here to see their review status;
    // everyone else without mentor privileges goes back to the student portal.
    if (!isStaff && !isApprovedMentor && !user.hasMentorApplication) {
      router.push("/student/dashboard");
    }
  }, [user, isLoading, isStaff, isApprovedMentor, router]);

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

  if (!isStaff && !isApprovedMentor) {
    // Signed-in applicants are told their application is pending rather than
    // being shown a generic authorization error.
    if (user.hasMentorApplication) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Clock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground font-heading">
            Mentor Application Under Review
          </h2>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Your mentor application has been submitted and is awaiting administrator approval.
            The mentor portal unlocks automatically once your application is approved.
          </p>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="px-6 py-2.5 rounded-xl bg-foreground text-background text-xs font-extrabold hover:opacity-90 font-heading"
          >
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground font-heading">
          Mentor Authorization Required
        </h2>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          Your account does not possess approved Mentor privileges. Please log in with a verified mentor account.
        </p>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="px-6 py-2.5 rounded-xl bg-foreground text-background text-xs font-extrabold hover:opacity-90 font-heading"
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
