"use client";

import { FileCode, Sparkles, Trophy, ExternalLink, CheckCircle2, TrendingUp } from "lucide-react";

export function PortfolioWidget() {
  const portfolioData = {
    portfolioScore: 92,
    resumeScore: 94,
    profileCompletion: 88,
    projectsFeatured: 3,
    topSkills: ["Next.js 16", "TypeScript", "Python", "FastAPI", "Go", "Docker", "RAG / LLMs"],
    featuredProjects: [
      { name: "QbitX Realtime AI Code Reviewer", stars: 42, role: "Lead Engineer" },
      { name: "Distributed KV Caching Engine", stars: 18, role: "Systems Dev" },
      { name: "PASS Session Scheduler Web App", stars: 26, role: "Full-Stack" },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <FileCode className="h-5 w-5 text-sky-500" />
            <span>Developer Portfolio Builder</span>
          </h2>
          <p className="text-xs text-muted-foreground">Auto-generated software engineering portfolio powered by your QbitX projects.</p>
        </div>
      </div>

      {/* Gauges Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Portfolio Strength</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-sky-600 dark:text-sky-400 font-heading">{portfolioData.portfolioScore}/100</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">Top 3%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${portfolioData.portfolioScore}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">AI Resume Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-heading">{portfolioData.resumeScore}/100</span>
            <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2.5 py-0.5 rounded-full">ATS Ready</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${portfolioData.resumeScore}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Profile Completion</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-heading">{portfolioData.profileCompletion}%</span>
            <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full">Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${portfolioData.profileCompletion}%` }} />
          </div>
        </div>

      </div>

      {/* Featured Projects Showcase */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-base text-foreground font-heading">Featured Portfolio Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolioData.featuredProjects.map((fp, i) => (
            <div key={i} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-500 uppercase">{fp.role}</span>
                <span className="text-xs font-bold text-amber-500">★ {fp.stars}</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{fp.name}</h4>
              <button className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 pt-1">
                <span>View Live Portfolio Card</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
