"use client";

import { StudentPortfolio } from "@/types/career";
import { Target, Award, CheckCircle2, TrendingUp } from "lucide-react";

export function SkillMatrixWidget({ portfolio }: { portfolio: StudentPortfolio }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <Target className="h-6 w-6 text-purple-500" />
          <span>Skill Matrix & Career Readiness Gauge</span>
        </h2>
        <p className="text-xs text-muted-foreground">Proficiency scores calculated automatically from completed coding labs, assessments, and capstone projects.</p>
      </div>

      {/* Overall Readiness Score Banner */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-sky-500/10 p-6 sm:p-8 space-y-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-purple-600 dark:text-purple-300 uppercase tracking-widest block">AI Career Placement Score</span>
          <h3 className="text-3xl font-black text-foreground font-heading">
            {portfolio.readinessScore} <span className="text-xl text-muted-foreground font-normal">/ 100 Readiness</span>
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl">
            You are ready for <strong>Full-Stack Software Engineer & Frontend AI Internships</strong>. High proficiency in Python and Next.js.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1 text-center shrink-0">
          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            LeetCode & System Design Ready
          </span>
          <p className="text-[11px] text-muted-foreground pt-1">98% match for OpenAI & Vercel</p>
        </div>
      </div>

      {/* Skill Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolio.skills.map((skill, idx) => (
          <div key={idx} className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider">{skill.category}</span>
              <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {skill.level}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <h4 className="font-extrabold text-lg text-foreground font-heading">{skill.skillName}</h4>
              <span className="font-black text-xl text-foreground font-heading">{skill.proficiencyScore}%</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 rounded-full"
                style={{ width: `${skill.proficiencyScore}%` }}
              />
            </div>

            <p className="text-[11px] text-muted-foreground">Source: Verified from QbitX {skill.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
