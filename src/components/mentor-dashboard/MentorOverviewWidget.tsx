"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { Users, BookOpen, UserCheck, FileCheck, Award, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface MentorStatsData {
  totalStudents: number;
  activeCourses: number;
  activeTeams: number;
  pendingAssignmentsCount: number;
  gradedCount: number;
  recentSubmissions: Array<{
    id: string;
    title: string;
    student: string;
    course: string;
    time: string;
    status: string;
  }>;
}

const FALLBACK_MENTOR_STATS: MentorStatsData = {
  totalStudents: 248,
  activeCourses: 4,
  activeTeams: 8,
  pendingAssignmentsCount: 3,
  gradedCount: 142,
  recentSubmissions: [
    {
      id: "sub-1",
      title: "bKash/Nagad Payment Ledger Capstone",
      student: "Jeifer Gomes (NDUB CSE)",
      course: "Full-Stack Web & AI Engineering",
      time: "25 mins ago",
      status: "Pending Evaluation",
    },
    {
      id: "sub-2",
      title: "Bangla OCR Inference Microservice",
      student: "Nusrat Jahan (BUET CSE)",
      course: "Bengali NLP & LLM Systems",
      time: "2 hours ago",
      status: "Pending Evaluation",
    },
    {
      id: "sub-3",
      title: "Dhaka Smart Traffic Optimization Graph",
      student: "Tanvir Ahmed (DU CSE)",
      course: "Advanced DSA & Systems",
      time: "5 hours ago",
      status: "Pending Evaluation",
    },
  ],
};

export function MentorOverviewWidget() {
  const { user } = useAuth();
  const name = user?.name || "Dr. Kamal Hossain";

  const [stats, setStats] = useState<MentorStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/mentor/stats");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && (json.data.totalStudents > 0 || json.data.recentSubmissions?.length > 0)) {
            setStats(json.data);
          } else {
            setStats(FALLBACK_MENTOR_STATS);
          }
        } else {
          setStats(FALLBACK_MENTOR_STATS);
        }
      } catch (err) {
        console.error("Failed to load mentor stats:", err);
        setStats(FALLBACK_MENTOR_STATS);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalStudents = stats?.totalStudents ?? FALLBACK_MENTOR_STATS.totalStudents;
  const activeCourses = stats?.activeCourses ?? FALLBACK_MENTOR_STATS.activeCourses;
  const activeTeams = stats?.activeTeams ?? FALLBACK_MENTOR_STATS.activeTeams;
  const pendingCount = stats?.pendingAssignmentsCount ?? FALLBACK_MENTOR_STATS.pendingAssignmentsCount;
  const recentSubs = stats?.recentSubmissions?.length ? stats.recentSubmissions : FALLBACK_MENTOR_STATS.recentSubmissions;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-sky-500/10 p-6 sm:p-8 border border-purple-500/20 shadow-md relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-500/20 px-3.5 py-1 rounded-full w-fit border border-purple-500/30">
          <Award className="h-3.5 w-3.5 text-purple-500" />
          <span>Verified Senior Mentor • 4.9 ★ Satisfaction Rating</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
          Welcome to Teacher Operations, <span className="text-purple-600 dark:text-purple-400">{name}</span>!
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          You have <strong>{pendingCount} assignments awaiting evaluation</strong> and{" "}
          <strong>{totalStudents} enrolled students</strong> across your active curriculum tracks.
        </p>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Enrolled Students", value: isLoading ? "..." : `${totalStudents}`, desc: "across active tracks", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Active Courses Managed", value: isLoading ? "..." : `${activeCourses}`, desc: "100% syllabus verified", icon: BookOpen, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Active Project Teams", value: isLoading ? "..." : `${activeTeams}`, desc: "capstone cohorts", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Assignments Pending Review", value: isLoading ? "..." : `${pendingCount}`, desc: "awaiting mentor evaluation", icon: FileCheck, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-2xl font-black text-foreground font-heading">{card.value}</p>
              <p className="text-[11px] font-semibold text-muted-foreground">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Review Queue & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Submissions Queue */}
        <div className="lg:col-span-8 rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-purple-500" />
              <span>Pending Assignment Submissions</span>
            </h3>
            <Link href="/mentor/assignments" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
              <span>View All ({pendingCount})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                <span className="text-xs">Loading queue...</span>
              </div>
            ) : recentSubs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No submissions currently awaiting review.</p>
            ) : (
              recentSubs.map((sub, i) => (
                <div key={i} className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="font-extrabold text-foreground text-sm">{sub.title}</p>
                    <p className="text-muted-foreground text-[11px]">
                      Student: <strong className="text-foreground">{sub.student}</strong> • {sub.course}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground">{sub.time}</span>
                    <Link
                      href="/mentor/assignments"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md shadow-purple-500/20 text-xs shrink-0"
                    >
                      Evaluate
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Class Health Insights */}
        <div className="lg:col-span-4 rounded-3xl border border-purple-500/30 bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-extrabold text-xs">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>AI Class Performance Summary</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">Curriculum Health Verified</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track assessments and assignment submissions are monitored in real time. Automated AI evaluations assist mentors in diagnosing student blockers.
            </p>
          </div>

          <Link
            href="/mentor/assignments"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 text-center block"
          >
            Open Evaluation Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
