"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Bot, Sparkles, Trophy, BookOpen, Layers } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface WorkspaceHeaderProps {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  overallProgressPct: number;
  activePanel: string | null;
  onTogglePanel: (panel: string) => void;
}

export function WorkspaceHeader({
  courseTitle,
  moduleTitle,
  lessonTitle,
  overallProgressPct,
  activePanel,
  onTogglePanel,
}: WorkspaceHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 w-full mx-auto">
        {/* Left: Exit Link + Brand Logo + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/student/dashboard"
            className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            title="Return to Student Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <Link href="/student/dashboard" className="hidden sm:flex items-center gap-2 shrink-0">
            <Image
              src="/logo_transparent_low_res.png"
              alt="QbitX Logo"
              width={110}
              height={34}
              className="object-contain"
            />
          </Link>

          <div className="h-4 w-px bg-border/60 hidden md:block shrink-0" />

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground truncate">
            <span className="hover:text-foreground transition-colors truncate max-w-[140px]">{courseTitle}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="hover:text-foreground transition-colors truncate max-w-[120px]">{moduleTitle}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="text-foreground font-bold truncate max-w-[160px]">{lessonTitle}</span>
          </div>
        </div>

        {/* Right: Progress Badge, Action Drawers, Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Course Progress Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-bold text-sky-600 dark:text-sky-400">
            <Trophy className="h-3.5 w-3.5 text-sky-500" />
            <span>{overallProgressPct}% Course Done</span>
          </div>

          <ThemeToggle />

          {/* Panel Toggle Triggers */}
          <button
            onClick={() => onTogglePanel("notes")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activePanel === "notes"
                ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                : "border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Notes
          </button>

          <button
            onClick={() => onTogglePanel("discussions")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activePanel === "discussions"
                ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                : "border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Discussions
          </button>

          <button
            onClick={() => onTogglePanel("ai")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              activePanel === "ai"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-500 shadow-md shadow-sky-500/20"
                : "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10 hover:bg-sky-500/20"
            }`}
          >
            <Bot className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>
        </div>
      </div>
    </header>
  );
}
