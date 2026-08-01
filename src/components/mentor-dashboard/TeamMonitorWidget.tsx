"use client";

import { MentorService } from "@/services/mentor/MentorService";
import { UserCheck, GitCommit, CheckCircle2, AlertTriangle, Users } from "lucide-react";

export function TeamMonitorWidget() {
  const teams = MentorService.getTeams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-purple-500" />
            <span>Capstone Project Teams Health Monitor</span>
          </h2>
          <p className="text-xs text-muted-foreground">Monitor sprint velocity, commit frequency, and collaboration health scores across student project groups.</p>
        </div>

        <span className="text-xs font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
          {teams.length} Active Teams
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block">
                  {team.membersCount} Members • {team.projectName}
                </span>
                <h3 className="font-extrabold text-lg text-foreground font-heading">{team.name}</h3>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                team.healthStatus === "healthy"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}>
                {team.healthStatus === "healthy" ? "Healthy Velocity" : "Needs Assistance"}
              </span>
            </div>

            {/* Sprint Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground">Sprint Completion</span>
                <span className="text-purple-500">{team.sprintProgressPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${team.sprintProgressPct}%` }}
                />
              </div>
            </div>

            {/* Commit Message & Stats */}
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 text-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1 font-mono text-[11px]"><GitCommit className="h-3.5 w-3.5 text-sky-500" /> {team.recentCommitsCount} Commits</span>
                <span className="font-bold text-foreground">Collab Index: {team.collaborationScore}/100</span>
              </div>
              <p className="font-mono text-[11px] text-foreground truncate bg-background p-2 rounded-xl border border-border">
                {team.lastCommitMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
