"use client";

import { useState } from "react";
import Image from "next/image";
import { MentorService } from "@/services/mentor/MentorService";
import { AssignmentSubmissionItem } from "@/types/mentor";
import { FileCheck, ExternalLink, CheckCircle2, Clock, Award, MessageSquare, X } from "lucide-react";

export function AssignmentReviewWidget() {
  const [submissions, setSubmissions] = useState<AssignmentSubmissionItem[]>(MentorService.getSubmissions());
  const [selectedSub, setSelectedSub] = useState<AssignmentSubmissionItem | null>(null);
  const [givenScore, setGivenScore] = useState<number>(95);
  const [commentText, setCommentText] = useState("");
  const [gradedSuccess, setGradedSuccess] = useState(false);

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSub.id
          ? { ...s, status: "graded", provisionalScore: givenScore, mentorComment: commentText }
          : s
      )
    );
    setGradedSuccess(true);
    setTimeout(() => {
      setGradedSuccess(false);
      setSelectedSub(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-purple-500" />
            <span>Assignment Review Workspace</span>
          </h2>
          <p className="text-xs text-muted-foreground">Review student GitHub repository submissions, assign provisional scores, and leave feedback.</p>
        </div>

        <span className="text-xs font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-3.5 py-1.5 rounded-full border border-purple-500/20">
          {submissions.filter((s) => s.status === "pending_review").length} Awaiting Review
        </span>
      </div>

      {/* Submissions Table / Cards */}
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <Image
                src={sub.studentAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                alt={sub.studentName}
                width={44}
                height={44}
                className="rounded-2xl object-cover shrink-0"
              />
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-base text-foreground font-heading">{sub.assignmentTitle}</h3>
                <p className="text-xs text-muted-foreground">
                  Student: <strong className="text-foreground">{sub.studentName}</strong> • {sub.courseTitle}
                </p>
                <span className="text-[10px] font-mono text-muted-foreground block">{sub.submittedAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                sub.status === "graded"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}>
                {sub.status === "graded" ? `Graded: ${sub.provisionalScore}/100` : "Pending Evaluation"}
              </span>

              <button
                onClick={() => {
                  setSelectedSub(sub);
                  setGivenScore(sub.provisionalScore || 92);
                  setCommentText(sub.mentorComment || "");
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 transition-all"
              >
                {sub.status === "graded" ? "View Evaluation" : "Open Review Workspace"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedSub && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedSub(null); }}
        >
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block">Submission Review</span>
                <h3 className="font-extrabold text-lg text-foreground font-heading">{selectedSub.assignmentTitle}</h3>
              </div>
              <button onClick={() => setSelectedSub(null)} className="p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
              <p className="text-muted-foreground">Student: <strong className="text-foreground">{selectedSub.studentName}</strong></p>
              {selectedSub.repoUrl && (
                <a
                  href={selectedSub.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-sky-500 hover:underline"
                >
                  <span>Open Submission Repository: {selectedSub.repoUrl}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <label className="text-foreground">Provisional Score (0 - 100)</label>
                  <span className="text-purple-500">{givenScore} / 100</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={givenScore}
                  onChange={(e) => setGivenScore(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground block">Mentor Feedback Comment</label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Great implementation! Code formatting is clean, tests cover 90% of edge cases..."
                  required
                  className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {gradedSuccess ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-extrabold flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Provisional Grade Submitted Successfully!</span>
                </div>
              ) : (
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setSelectedSub(null)} className="px-5 py-2.5 rounded-xl bg-muted text-xs font-bold text-foreground">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20">
                    Submit Grade & Feedback
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
