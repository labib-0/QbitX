"use client";

import { useState } from "react";
import { FolderCheck, CheckCircle2, Code2, ExternalLink, Sparkles } from "lucide-react";
import { LearningAnalytics } from "@/services/workspace/LearningAnalytics";

interface ProjectViewerProps {
  title: string;
  lessonId: string;
  courseId: string;
  userId: string;
  onCompleteLesson?: () => void;
}

export function ProjectViewer({
  title,
  lessonId,
  courseId,
  userId,
  onCompleteLesson,
}: ProjectViewerProps) {
  const [completed, setCompleted] = useState(false);

  const handleFinishProject = () => {
    setCompleted(true);
    LearningAnalytics.logEvent({
      userId,
      courseId,
      lessonId,
      eventType: "lesson_completed",
      payload: { lessonType: "project" },
    });
    if (onCompleteLesson) onCompleteLesson();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full w-fit">
          <FolderCheck className="h-3.5 w-3.5" />
          <span>Capstone Project Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">{title}</h1>
        <p className="text-xs text-muted-foreground">Build a production-ready software project to demonstrate your portfolio skills.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm text-xs text-muted-foreground leading-relaxed">
        <h3 className="font-extrabold text-sm text-foreground font-heading uppercase tracking-wider">Project System Requirements</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>FastAPI or Next.js 16 backend API handling vector embeddings query.</li>
          <li>Supabase Vector or PostgreSQL pgvector store with 1536-dim OpenAI embeddings.</li>
          <li>Docker Compose file specifying database, API server, and web frontend services.</li>
        </ul>

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <a
            href="https://github.com/qbitx-labs/rag-capstone-spec"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs"
          >
            <Code2 className="h-4 w-4" />
            <span>Fork Capstone Template Repository</span>
            <ExternalLink className="h-3 w-3 ml-1 text-slate-400" />
          </a>

          <button
            onClick={handleFinishProject}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl font-extrabold text-xs text-white shadow-md ${
              completed ? "bg-emerald-500 shadow-emerald-500/20" : "bg-sky-500 hover:bg-sky-600 shadow-sky-500/20"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{completed ? "Capstone Verified!" : "Mark Capstone Complete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
