"use client";

import { useEffect, useState } from "react";
import { GitHubService } from "@/services/GitHubService";
import { GitCommit, Star, GitFork, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function GitHubWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GitHubService.getGitHubData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
        <span>Loading GitHub contribution matrix...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <GithubIcon className="h-5 w-5 text-foreground" />
            <span>GitHub Sync & Repository Matrix</span>
          </h2>
          <p className="text-xs text-muted-foreground">Connected account: <strong className="text-sky-600 dark:text-sky-400">@{data.username}</strong></p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" /> Realtime Sync Active
        </span>
      </div>

      {/* GitHub Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Commits This Year</span>
          <p className="text-2xl font-black text-foreground font-heading">{data.totalCommitsThisYear}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">GitHub Commit Streak</span>
          <p className="text-2xl font-black text-amber-500 font-heading">{data.streakDays} Days 🔥</p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Connected Repos</span>
          <p className="text-2xl font-black text-sky-500 font-heading">{data.repos.length} Repos</p>
        </div>
      </div>

      {/* Contribution Heatmap Simulated Grid */}
      <div className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-foreground flex items-center gap-1.5">
            <GitCommit className="h-4 w-4 text-sky-500" />
            <span>2026 Commit Activity Heatmap</span>
          </span>
          <span className="text-muted-foreground text-[11px] font-mono">648 Total Contributions</span>
        </div>

        {/* Heatmap Squares */}
        <div className="grid grid-cols-16 sm:grid-cols-24 gap-1 pt-1 overflow-x-auto">
          {Array.from({ length: 96 }).map((_, idx) => {
            const intensity = (idx * 7) % 5;
            const bgClass =
              intensity === 4
                ? "bg-emerald-500"
                : intensity === 3
                ? "bg-emerald-600"
                : intensity === 2
                ? "bg-emerald-800"
                : intensity === 1
                ? "bg-emerald-950"
                : "bg-muted";
            return <div key={idx} className={`h-3 w-3 rounded-sm ${bgClass}`} title={`Day ${idx + 1}`} />;
          })}
        </div>
      </div>

      {/* Repositories & Commits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Repositories */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <h3 className="font-extrabold text-sm text-foreground font-heading">Active GitHub Repositories</h3>
          <div className="space-y-2.5">
            {data.repos.map((r: any) => (
              <div key={r.id} className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-sky-600 dark:text-sky-400">{r.name}</span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-amber-500" /> {r.stars}</span>
                    <span className="flex items-center gap-0.5"><GitFork className="h-3 w-3 text-sky-500" /> {r.forks}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Commits */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
          <h3 className="font-extrabold text-sm text-foreground font-heading">Recent GitHub Commits</h3>
          <div className="space-y-2.5 text-xs">
            {data.recentCommits.map((c: any) => (
              <div key={c.id} className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">{c.hash}</span>
                  <span className="text-[10px] text-muted-foreground">{c.timeAgo}</span>
                </div>
                <p className="font-semibold text-foreground text-xs leading-snug">{c.message}</p>
                <span className="text-[10px] text-sky-500 font-mono block">{c.repo}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
