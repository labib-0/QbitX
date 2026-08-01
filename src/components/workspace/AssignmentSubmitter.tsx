"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, Award, Clock } from "lucide-react";
import { LearningAnalytics } from "@/services/workspace/LearningAnalytics";

interface AssignmentSubmitterProps {
  title: string;
  lessonId: string;
  courseId: string;
  userId: string;
  onCompleteLesson?: () => void;
}

export function AssignmentSubmitter({
  title,
  lessonId,
  courseId,
  userId,
  onCompleteLesson,
}: AssignmentSubmitterProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    LearningAnalytics.logEvent({
      userId,
      courseId,
      lessonId,
      eventType: "quiz_submitted",
      payload: { repoUrl, assignmentType: "github_submission" },
    });
    if (onCompleteLesson) onCompleteLesson();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="rounded-3xl border border-border bg-card p-6 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full w-fit">
          <FileText className="h-3.5 w-3.5" />
          <span>Assignment & Lab Submission</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground font-heading">{title}</h1>
        <p className="text-xs text-muted-foreground">Due: <strong>August 15, 2026</strong> • Grading Method: <strong>Mentor Review</strong></p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider">Grading Rubric Criteria</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {[
            { label: "Code Architecture", points: "40 pts" },
            { label: "RAG Retrieval Speed", points: "30 pts" },
            { label: "Documentation & Setup", points: "30 pts" },
          ].map((r, i) => (
            <div key={i} className="p-3 rounded-2xl bg-muted/40 border border-border/50">
              <span className="text-sky-500 font-extrabold block">{r.points}</span>
              <span className="text-foreground font-bold">{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <label className="text-xs font-bold text-foreground block">GitHub Repository URL</label>
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/your-username/qbitx-rag-pipeline"
            required
            className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-foreground block">Comments for Mentor (Optional)</label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Notes about docker-compose environment or test coverage..."
            className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Assignment submitted successfully! Sent to Senior Mentor for review.</span>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>Submit Assignment to Mentor</span>
          </button>
        )}
      </form>
    </div>
  );
}
