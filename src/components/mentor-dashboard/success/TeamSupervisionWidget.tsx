"use client";

import { MentorService } from "@/services/mentor/MentorService";
import { UserCheck, GitCommit, CheckCircle2, Columns, Users } from "lucide-react";

export function TeamSupervisionWidget() {
  const teams = MentorService.getTeams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-purple-500" />
            <span>Capstone Project Teams Supervision & Kanban</span>
          </h2>
          <p className="text-xs text-muted-foreground">Monitor team sprint progress, Kanban board task completion, and GitHub commit velocity.</p>
        </div>

        <span className="text-xs font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-3.5 py-1.5 rounded-full border border-purple-500/20">
          {teams.length} Active Capstone Teams
        </span>
      </div>

      {/* Kanban Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block">
                  {team.projectName}
                </span>
                <h3 className="font-extrabold text-lg text-foreground font-heading">{team.name}</h3>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                team.healthStatus === "healthy" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}>
                Collab Score: {team.collaborationScore}/100
              </span>
            </div>

            {/* Kanban Columns Visualizer */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
              <div className="p-2.5 rounded-2xl bg-muted/40 border border-border">
                <span className="text-muted-foreground block mb-0.5">To Do</span>
                <span className="text-foreground text-xs font-black">2 Tasks</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
                <span className="block mb-0.5">In Progress</span>
                <span className="text-xs font-black">4 Tasks</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="block mb-0.5">Done</span>
                <span className="text-xs font-black">12 Tasks</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-xs font-mono">
              <span className="text-[10px] text-muted-foreground block mb-1">Latest Commit:</span>
              <p className="text-foreground text-[11px] truncate">{team.lastCommitMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
