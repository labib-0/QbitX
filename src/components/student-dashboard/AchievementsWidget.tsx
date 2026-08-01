"use client";

import { Trophy, Star, Flame, BookOpen, CheckCircle2, Award, Zap, Target, Lock } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  earned: boolean;
  earnedDate?: string;
  xp: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "streak_14",
    title: "14-Day Streak 🔥",
    description: "Studied consistently for 14 days in a row.",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    earned: true,
    earnedDate: "Jul 28, 2026",
    xp: 250,
    rarity: "rare",
  },
  {
    id: "first_course",
    title: "First Completion",
    description: "Completed your first course on QbitX.",
    icon: BookOpen,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    earned: true,
    earnedDate: "May 10, 2026",
    xp: 100,
    rarity: "common",
  },
  {
    id: "level_10",
    title: "Level 10 Scholar",
    description: "Reached level 10 through dedicated learning.",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    earned: true,
    earnedDate: "Jun 15, 2026",
    xp: 500,
    rarity: "epic",
  },
  {
    id: "assignments_5",
    title: "Assignment Ace",
    description: "Submitted 5 assignments on time.",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    earned: true,
    earnedDate: "Jul 01, 2026",
    xp: 150,
    rarity: "common",
  },
  {
    id: "cert_2",
    title: "Dual Certified",
    description: "Earned 2 QbitX certificates.",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    earned: true,
    earnedDate: "Jun 20, 2026",
    xp: 300,
    rarity: "rare",
  },
  {
    id: "xp_5000",
    title: "XP Hoarder",
    description: "Accumulate 5,000 XP total.",
    icon: Zap,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    earned: false,
    xp: 500,
    rarity: "epic",
  },
  {
    id: "streak_30",
    title: "30-Day Streak Legend",
    description: "Study for 30 consecutive days.",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    earned: false,
    xp: 1000,
    rarity: "legendary",
  },
  {
    id: "complete_all",
    title: "Course Conqueror",
    description: "Complete all enrolled courses.",
    icon: Target,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    earned: false,
    xp: 750,
    rarity: "legendary",
  },
];

const RARITY_STYLES: Record<string, { label: string; badge: string }> = {
  common: { label: "Common", badge: "bg-slate-500/10 text-slate-500" },
  rare: { label: "Rare", badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  epic: { label: "Epic", badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  legendary: { label: "Legendary", badge: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
};

export function AchievementsWidget() {
  const earned = ACHIEVEMENTS.filter((a) => a.earned);
  const locked = ACHIEVEMENTS.filter((a) => !a.earned);
  const totalXP = earned.reduce((s, a) => s + a.xp, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-yellow-500/10">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-foreground">Achievements</h2>
            <p className="text-xs text-muted-foreground">Track your learning milestones</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-2xl bg-muted/40 border border-border/50">
            <p className="text-2xl font-black text-yellow-500">{earned.length}</p>
            <p className="text-[11px] font-semibold text-muted-foreground mt-1">Earned</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-muted/40 border border-border/50">
            <p className="text-2xl font-black text-sky-500">{ACHIEVEMENTS.length}</p>
            <p className="text-[11px] font-semibold text-muted-foreground mt-1">Total</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-muted/40 border border-border/50">
            <p className="text-2xl font-black text-purple-500">{totalXP.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-muted-foreground mt-1">XP Earned</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Overall Progress</span>
            <span className="text-xs font-bold text-foreground">{earned.length}/{ACHIEVEMENTS.length}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 transition-all duration-700"
              style={{ width: `${(earned.length / ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Earned Achievements */}
      <div>
        <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          ✅ Earned ({earned.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {earned.map((ach) => {
            const IconComp = ach.icon;
            const rarity = RARITY_STYLES[ach.rarity];
            return (
              <div
                key={ach.id}
                className="rounded-2xl border border-border bg-card p-4 hover:shadow-lg hover:border-sky-500/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${ach.bgColor} shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComp className={`h-5 w-5 ${ach.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-extrabold text-foreground">{ach.title}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${rarity.badge}`}>
                        {rarity.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{ach.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-emerald-500 font-bold">+{ach.xp} XP</span>
                      {ach.earnedDate && (
                        <span className="text-[10px] text-muted-foreground">{ach.earnedDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locked Achievements */}
      <div>
        <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          🔒 Locked ({locked.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {locked.map((ach) => {
            const rarity = RARITY_STYLES[ach.rarity];
            return (
              <div
                key={ach.id}
                className="rounded-2xl border border-border/50 bg-muted/20 p-4 opacity-70 hover:opacity-90 transition-opacity"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-muted shrink-0">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-bold text-muted-foreground">{ach.title}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${rarity.badge}`}>
                        {rarity.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70 mt-1 leading-relaxed">{ach.description}</p>
                    <span className="text-[10px] text-sky-500 font-bold mt-2 block">+{ach.xp} XP on unlock</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
