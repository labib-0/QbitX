"use client";

import Image from "next/image";
import { CareerProject } from "@/types/career";
import { ExternalLink, Github, Users, Award, Code2 } from "lucide-react";

export function ProjectShowcaseWidget({ projects }: { projects: CareerProject[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <Code2 className="h-6 w-6 text-purple-500" />
          <span>Automatic Capstone Project Showcase</span>
        </h2>
        <p className="text-xs text-muted-foreground">Every completed QbitX lab and capstone project automatically populates your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-muted">
                <Image src={proj.thumbnail} alt={proj.title} fill className="object-cover" />
                {proj.isFeatured && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                    Featured Project
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-foreground font-heading">{proj.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{proj.description}</p>
              </div>

              <div className="flex flex-wrap gap-1">
                {proj.technologies.map((tech, i) => (
                  <span key={i} className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-2.5 py-0.5 rounded-md border border-purple-500/20">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
                <p>Role: <strong>{proj.role}</strong></p>
                <p>Team: {proj.teamMembers.join(", ")} • Mentor: <strong>{proj.mentor}</strong></p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center gap-2">
              {proj.demoUrl && (
                <a
                  href={proj.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
              {proj.githubUrl && (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-extrabold text-center flex items-center justify-center gap-1.5 transition-colors border border-border"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub Repo</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
