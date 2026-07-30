"use client";

import { StudentOverview } from "@/services/DashboardService";
import { Sparkles, Trophy, Flame, Clock, Award, FolderCheck, TrendingUp, Zap } from "lucide-react";

interface WelcomeHeaderProps {
  overview: StudentOverview | null;
  onOpenAIAssistant: () => void;
}

export function WelcomeHeader({ overview, onOpenAIAssistant }: WelcomeHeaderProps) {
  const stats = overview?.stats || {
    level: 12,
    xp: 8450,
    xpToNextLevel: 10000,
    skillScore: 92,
    weeklyProgress: 78,
    overallProgress: 64,
    learningStreak: 14,
    studyTimeHours: 42.5,
    projectsCompleted: 6,
    certificatesEarned: 4,
    leaderboardRank: 4,
  };

  const name = overview?.name || "Labib";
  const xpProgress = Math.min(100, Math.round((stats.xp / stats.xpToNextLevel) * 100));

  return (
    <div className="space-y-6">
      
      {/* Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-600 dark:text-sky-300 border border-sky-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Level {stats.level} Student Engineer</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-heading">
              Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500">Hello {name} 👋</span>
            </h1>

            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed font-medium">
              You are making stellar progress this week! You have completed <strong>78%</strong> of your weekly goals. Ready to continue your RAG Pipeline module?
            </p>

            {/* XP Progress Bar */}
            <div className="pt-2 space-y-1.5 max-w-md">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  XP Progress to Level {stats.level + 1}
                </span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">{stats.xp} / {stats.xpToNextLevel} XP ({xpProgress}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick AI Trigger & Rank Pill */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 items-start sm:items-center md:items-end justify-center">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-card/80 border border-border shadow-sm">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold block uppercase">Leaderboard</span>
                <span className="text-sm font-extrabold text-foreground">Rank #{stats.leaderboardRank} <span className="text-xs text-emerald-500 font-bold">(Top 1%)</span></span>
              </div>
            </div>

            <button
              onClick={onOpenAIAssistant}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-105 transition-all w-full sm:w-auto justify-center"
            >
              <Sparkles className="h-4 w-4" />
              <span>Ask AI Tutor Anything</span>
            </button>
          </div>

        </div>

        {/* Ambient Gradient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Skill Score", value: `${stats.skillScore}/100`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Weekly Progress", value: `${stats.weeklyProgress}%`, icon: Zap, color: "text-sky-500", bg: "bg-sky-500/10" },
          { label: "Learning Streak", value: `${stats.learningStreak} Days`, icon: Flame, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Study Time", value: `${stats.studyTimeHours}h`, icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Projects Completed", value: stats.projectsCompleted, icon: FolderCheck, color: "text-cyan-500", bg: "bg-cyan-500/10" },
          { label: "Certificates Earned", value: stats.certificatesEarned, icon: Award, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-card border border-border/60 hover:border-border transition-all space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">{item.label}</span>
                <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
                  <IconComp className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-xl font-extrabold text-foreground tracking-tight font-heading">{item.value}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
