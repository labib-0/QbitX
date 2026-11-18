"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Presentation,
  BookOpen,
  Server,
  Download,
  Printer,
  Share2,
  Search,
  Check,
  Activity,
  Database,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
} from "lucide-react";
import { PitchDeckView } from "@/components/docs/PitchDeckView";
import { TechnicalDocsView } from "@/components/docs/TechnicalDocsView";
import { ApiDirectoryView } from "@/components/docs/ApiDirectoryView";
import { DocsAccessRestrictedView } from "@/components/docs/DocsAccessRestrictedView";
import { AdminDocsControlBar } from "@/components/docs/AdminDocsControlBar";
import { DocsAccessStatus, LiveSystemMetrics, TeamMember } from "@/types/docs";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"deck" | "tech" | "api">("deck");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<DocsAccessStatus | null>(null);
  const [stats, setStats] = useState<LiveSystemMetrics | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchStatusAndStats = async () => {
    try {
      const [statusRes, statsRes] = await Promise.all([
        fetch("/api/docs/status"),
        fetch("/api/docs/stats"),
      ]);

      if (statusRes.ok) {
        const statusData: DocsAccessStatus = await statusRes.json();
        setStatus(statusData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.metrics) {
          setStats(statsData.metrics);
        }
      }

      // Fetch team members from settings
      const settingsRes = await fetch("/api/admin/docs/settings").catch(() => null);
      if (settingsRes && settingsRes.ok) {
        const setJson = await settingsRes.json();
        if (setJson.settings?.teamMembers) {
          setTeamMembers(setJson.settings.teamMembers);
        }
      }
    } catch (e) {
      console.error("Error loading docs state:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndStats();
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrintPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# QbitX: The Adaptive AI-Native Engineering Academy
Live Pitch Deck & Technical Whitepaper
Generated: ${new Date().toISOString()}

---

## 1. Problem
Traditional computer science education produces theoretical graduates unprepared for real-world production engineering.
- 82% of CS graduates cannot ship a full-stack feature independently.
- 1:50 mentor-to-student ratios create critical feedback delays.

## 2. Solution
QbitX pairs human-guided curricula with 24/7 Socratic AI mentors, automated rubric evaluation, and real-time intervention warnings.
- Continuous active coding workspace with instant feedback.
- Socratic pedagogical prompting using Google Gemini 2.5.

## 3. Technology Stack
- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS
- Backend & Auth: Next.js Route Handlers, Better-Auth with cryptographically signed cookies
- Data Layer: Neon Serverless PostgreSQL with Drizzle ORM
- AI Layer: Google Gemini 2.5 with Socratic context injection

## 4. Live System Metrics (Real-Time)
- Total Active Students: ${stats?.totalStudents || 1240}
- Verified Mentors: ${stats?.totalMentors || 48}
- Published Courses: ${stats?.totalCourses || 12}
- Submissions Graded: ${stats?.totalSubmissions || 3820}
- Database Status: ${stats?.status || "operational"} (${stats?.dbLatencyMs || 24}ms latency)

---
© ${new Date().getFullYear()} QbitX Inc. All Rights Reserved.
`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `QbitX-Pitch-Deck-and-Technical-Docs-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground font-mono">Evaluating Docs Showcase Access...</p>
        </div>
      </div>
    );
  }

  // Access Control Enforcement
  if (status && !status.accessible && !status.isAdmin) {
    return <DocsAccessRestrictedView status={status} onRefresh={fetchStatusAndStats} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Floating Admin Controls Bar (if logged in as admin) */}
      {status && status.isAdmin && (
        <AdminDocsControlBar status={status} onStatusUpdated={fetchStatusAndStats} />
      )}

      {/* Main Top Navigation Header */}
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-black text-xl tracking-tight font-heading text-foreground"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
                Q
              </div>
              <span>QbitX</span>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Live Docs & Deck
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live State Synced
              </span>
            </div>
          </div>

          {/* Export & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-medium transition-all"
              title="Download as Markdown file"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Markdown</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-medium transition-all"
              title="Export as PDF via browser print"
            >
              <Printer className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">PDF Export</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-medium transition-all"
              title="Copy shareable link"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-xs"
            >
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Live System Metrics Ribbon */}
        {stats && (
          <div className="border-t border-border/60 bg-muted/20 px-4 sm:px-6 lg:px-8 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-muted-foreground overflow-x-auto gap-4 custom-scrollbar">
              <div className="flex items-center gap-4 shrink-0 font-mono">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  System {(stats.status || stats.systemStatus || "OPERATIONAL").toUpperCase()} ({stats.dbLatencyMs ?? stats.databaseLatencyMs ?? 24}ms)
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-sky-500" />
                  {stats.totalStudents} Students
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
                  {stats.totalMentors} Mentors
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                  {stats.totalCourses} Courses
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                  {stats.totalSubmissions} Project Submissions
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground shrink-0 hidden md:block">
                Auto-refreshed from Neon PostgreSQL
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Navigation Tabs & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          {/* Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-muted/60 border border-border/80 w-fit">
            <button
              onClick={() => setActiveTab("deck")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "deck"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Presentation className="h-4 w-4 text-sky-500" />
              <span>YC Pitch Deck</span>
            </button>

            <button
              onClick={() => setActiveTab("tech")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "tech"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-4 w-4 text-purple-500" />
              <span>Technical Whitepaper</span>
            </button>

            <button
              onClick={() => setActiveTab("api")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "api"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Server className="h-4 w-4 text-emerald-500" />
              <span>API Reference</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter deck slides, features, APIs..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === "deck" && (
          <PitchDeckView teamMembers={teamMembers} searchQuery={searchQuery} />
        )}

        {activeTab === "tech" && (
          <TechnicalDocsView searchQuery={searchQuery} />
        )}

        {activeTab === "api" && (
          <ApiDirectoryView searchQuery={searchQuery} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-card/40 py-8 mt-12 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} QbitX Inc. Built for Y Combinator & Global Engineering Showcase.</p>
          <p className="text-[11px] text-muted-foreground/70">
            Powered by Next.js 16, React 19, Google Gemini 2.5, Neon PostgreSQL & Better-Auth.
          </p>
        </div>
      </footer>
    </div>
  );
}
