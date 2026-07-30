"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Users, Award, ShieldCheck, Clock, CheckCircle2, LogOut, Code, DollarSign, Calendar, AlertTriangle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MentorDashboardPage() {
  const { user, logout, isLoading, adminApprovedToggle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login/mentor");
      } else if (user.role !== "mentor") {
        router.push("/dashboard/student");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs">
        Loading QbitX Senior Mentor Portal...
      </div>
    );
  }

  const isApproved = user.isApproved ?? adminApprovedToggle;

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Application Under Review</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
          Your senior mentor application is currently being reviewed by the QbitX Admin team. Mentors cannot access the portal until approved.
        </p>
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          💡 <strong>Demo Tip:</strong> Toggle <em>"Admin Approved State"</em> to Approved in the top banner to test access.
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/login/mentor");
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-xs font-bold text-white hover:bg-slate-800"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50/80 to-purple-50/20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 font-extrabold text-white text-base shadow-sm">
              Q
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">Qbit<span className="text-purple-600 dark:text-purple-400">X</span></span>
          </Link>
          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Senior Mentor Portal
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-2 text-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 font-bold text-white shadow-xs">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Verified Senior Mentor</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login/mentor");
            }}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-1">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-50/80 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/80 p-6 sm:p-8 border border-purple-100 dark:border-purple-500/20 shadow-md relative overflow-hidden">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Award className="h-3.5 w-3.5" /> Certified Senior Mentor • 5.0 ★ Rating
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-purple-600 dark:text-purple-400">{user.name}</span>!
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              You have <strong>2 student code reviews</strong> awaiting sign-off and <strong>1 upcoming PASS session</strong> scheduled for Thursday.
            </p>
          </div>
        </div>

        {/* Mentor Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span>Mentees Guided</span>
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">48 Students</div>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">across 3 departments</p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span>Hours Mentored</span>
              <Clock className="h-4 w-4 text-sky-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">124 Hours</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">This semester</p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span>Pending Code Reviews</span>
              <Code className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">2 In Queue</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Avg response &lt; 15 mins</p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span>Stipend / Course Credit</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">$640 USD</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+3 Academic Credits</p>
          </div>
        </div>

        {/* Action Queue */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Pending Student Reviews & Sessions</h3>
          <div className="space-y-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 dark:text-white">Binary Search Tree Off-by-One Logic Bug</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Submitted by: Alex Rivera • CS101 Track</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors shadow-xs">
                Review Code
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 dark:text-white">1-on-1 PASS Study Group Session</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Scheduled: Thursday @ 4:30 PM • Johnson Hall Lab</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>

      </main>

      <footer className="py-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        QbitX Senior Mentor Portal • Authenticated as {user.email}
      </footer>
    </div>
  );
}
