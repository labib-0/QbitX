"use client";

import { useState } from "react";
import { Project } from "@/services/ProjectService";
import { Code2, Users, ArrowRight, ExternalLink, Plus, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface ActiveProjectsProps {
  projects: Project[];
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Code2 className="h-5 w-5 text-sky-500" />
            <span>Active Project Workspaces</span>
          </h2>
          <p className="text-xs text-muted-foreground">Collaborative repositories and agile sprints with team members.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-400 hover:text-white border border-sky-500/20 px-3.5 py-2 text-xs font-bold transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm hover:border-sky-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                  proj.status === "In Progress"
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                }`}>
                  {proj.status}
                </span>

                <a
                  href={proj.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 font-semibold"
                >
                  <GithubIcon className="h-4 w-4" />
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <h3 className="font-extrabold text-base text-foreground font-heading">{proj.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{proj.description}</p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.techStack.map((tech, idx) => (
                  <span key={idx} className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Sprint Progress & Team Avatars */}
            <div className="space-y-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-purple-500" />
                  Sprint Progress
                </span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{proj.sprintProgress}%</span>
              </div>

              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"
                  style={{ width: `${proj.sprintProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center -space-x-2">
                  {proj.team.map((member) => (
                    <div
                      key={member.id}
                      className="relative h-7 w-7 rounded-full ring-2 ring-background overflow-hidden"
                      title={`${member.name} (${member.role})`}
                    >
                      <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => alert(`Opening workspace for ${proj.title}`)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disabled/Placeholder Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4 text-center">
            <h3 className="font-extrabold text-lg text-foreground">Create New Project</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              New project workspace creation is reserved for PASS Senior Mentors & Guild Captains. You can submit project proposals in your <strong>Learning Family</strong> or join existing Guild repositories.
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full rounded-xl bg-sky-500 py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
