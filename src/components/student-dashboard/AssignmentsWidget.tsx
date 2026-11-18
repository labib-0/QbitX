"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckSquare, Upload, ExternalLink, CheckCircle2, Clock, AlertCircle, RefreshCw, GitBranch, MessageSquare, Star } from "lucide-react";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  technologies: string[];
  estimatedHours: number;
  isEnrolled: boolean;
  enrollmentStatus?: string;
  submissionsCount?: number;
}

interface ProjectDetail extends ProjectItem {
  submissions: Array<{
    id: string;
    githubRepoUrl: string;
    liveDemoUrl?: string | null;
    notes?: string | null;
    status: string;
    submittedAt: string;
    reviews?: Array<{
      id: string;
      reviewerName?: string | null;
      score: number;
      feedbackMarkdown: string;
      status: string;
      reviewedAt: string;
    }>;
  }>;
}

const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: "prj-bkash-ledger",
    slug: "bkash-nagad-ledger",
    title: "bKash & Nagad Payment Ledger Engine",
    description: "Build an idempotent fintech microservice for mobile financial services (MFS) reconciliation in Bangladesh.",
    difficulty: "Advanced",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    estimatedHours: 40,
    isEnrolled: true,
    enrollmentStatus: "in_progress",
    submissionsCount: 1,
  },
  {
    id: "prj-bangla-ocr",
    slug: "bangla-ocr-pipeline",
    title: "Autonomous Bangla OCR & Document Digitizer",
    description: "Deep learning vision pipeline fine-tuned on Bengali handwritten documents and national ID cards.",
    difficulty: "Advanced",
    technologies: ["Python", "PyTorch", "FastAPI", "OpenCV"],
    estimatedHours: 35,
    isEnrolled: true,
    enrollmentStatus: "submitted",
    submissionsCount: 1,
  },
  {
    id: "prj-traffic-optimizer",
    slug: "dhaka-traffic-flow",
    title: "Dhaka Smart Traffic Flow Optimizer",
    description: "Graph neural network and heuristic pathfinding system simulating traffic congestion mitigation for Dhaka intersections.",
    difficulty: "Intermediate",
    technologies: ["Go", "Graph Algorithms", "Redis", "Docker"],
    estimatedHours: 30,
    isEnrolled: true,
    enrollmentStatus: "graded",
    submissionsCount: 1,
  },
];

export function AssignmentsWidget() {
  const [projects, setProjects] = useState<ProjectItem[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "In Progress" | "Submitted" | "Graded">("All");

  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Submission Form State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittingProject, setSubmittingProject] = useState<ProjectItem | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/projects");
      if (!res.ok) {
        setProjects(FALLBACK_PROJECTS);
        return;
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setProjects(json.data);
      } else {
        setProjects(FALLBACK_PROJECTS);
      }
    } catch {
      setProjects(FALLBACK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const openProjectDetail = async (project: ProjectItem) => {
    try {
      setLoadingDetail(true);
      const res = await fetch(`/api/projects/${project.id}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setSelectedProject(json.data);
      }
    } catch (err) {
      console.error("Failed to load project details:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenSubmit = (project: ProjectItem) => {
    setSubmittingProject(project);
    setGithubUrl("");
    setLiveDemoUrl("");
    setNotes("");
    setSubmitError(null);
    setSubmitSuccess(null);
    setShowSubmitModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingProject) return;

    // Client-side regex pre-check matching API requirement
    const githubRegex = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/;
    if (!githubRegex.test(githubUrl.trim())) {
      setSubmitError("Please provide a valid GitHub repository URL (e.g. https://github.com/username/project)");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res = await fetch(`/api/projects/${submittingProject.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubRepoUrl: githubUrl.trim(),
          liveDemoUrl: liveDemoUrl.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Submission failed. Please check inputs.");
      }

      setSubmitSuccess("Assignment successfully submitted and queued for mentor review!");
      await loadProjects();

      setTimeout(() => {
        setShowSubmitModal(false);
        setSubmitSuccess(null);
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = projects.filter((p) => {
    if (filter === "All") return true;
    if (filter === "In Progress") return p.isEnrolled && p.enrollmentStatus !== "completed";
    if (filter === "Submitted") return (p.submissionsCount || 0) > 0 && p.enrollmentStatus !== "completed";
    if (filter === "Graded") return p.enrollmentStatus === "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-sky-500" />
            <span>Assignments & Project Deliverables</span>
          </h2>
          <p className="text-xs text-muted-foreground">Submit verified GitHub repositories, track mentor evaluations, and review grades.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl text-xs font-bold">
          {(["All", "In Progress", "Submitted", "Graded"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === tab
                  ? "bg-card text-sky-600 dark:text-sky-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 flex items-center justify-center space-x-2 text-muted-foreground text-xs font-heading">
          <RefreshCw className="h-5 w-5 animate-spin text-sky-500" />
          <span>Loading Project Assignments...</span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center space-y-3">
          <AlertCircle className="h-6 w-6 text-red-500 mx-auto" />
          <p className="text-xs text-muted-foreground">{error}</p>
          <button
            onClick={loadProjects}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-10 rounded-3xl border border-dashed border-border bg-card/60 text-center space-y-2">
          <p className="text-sm font-extrabold text-foreground font-heading">No assignments found</p>
          <p className="text-xs text-muted-foreground">There are no project deliverables matching the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const hasSubmission = (item.submissionsCount || 0) > 0;
            const isCompleted = item.enrollmentStatus === "completed";

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl border border-border bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sky-500/30 transition-all"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md font-heading ${
                      isCompleted
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : hasSubmission
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                    }`}>
                      {isCompleted ? "Completed & Approved" : hasSubmission ? "Pending Mentor Review" : "In Progress"}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {item.difficulty} • ~{item.estimatedHours} hrs
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-foreground font-heading">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.technologies.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/60 text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openProjectDetail(item)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-bold hover:bg-muted text-foreground transition-colors"
                  >
                    View Status
                  </button>

                  <button
                    onClick={() => handleOpenSubmit(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 text-white px-4 py-2 text-xs font-bold hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/20"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{hasSubmission ? "Resubmit Repository" : "Submit Repository"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail & Review History Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-extrabold text-lg text-foreground font-heading">{selectedProject.title}</h3>
              <button onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-foreground text-sm font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{selectedProject.description}</p>

              <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground font-heading">
                Submission History & Mentor Reviews ({selectedProject.submissions?.length || 0})
              </h4>

              {selectedProject.submissions?.length === 0 ? (
                <div className="p-4 rounded-2xl bg-muted/30 border border-border text-center text-xs text-muted-foreground">
                  No submissions recorded yet for this project.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedProject.submissions.map((sub, idx) => (
                    <div key={sub.id} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground font-heading">Attempt #{selectedProject.submissions.length - idx}</span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          sub.status === "reviewed" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                        }`}>
                          {sub.status}
                        </span>
                      </div>

                      <a
                        href={sub.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <GitBranch className="h-3 w-3" />
                        <span>{sub.githubRepoUrl}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>

                      {sub.reviews && sub.reviews.length > 0 && (
                        <div className="pt-2 border-t border-border/50 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-amber-500" />
                              <span>Score: {sub.reviews[0].score}/100</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              Reviewed by: {sub.reviews[0].reviewerName || "Mentor"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground bg-card p-3 rounded-xl border border-border/80">
                            {sub.reviews[0].feedbackMarkdown}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-muted/80"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Repository Submission Modal */}
      {showSubmitModal && submittingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-extrabold text-lg text-foreground font-heading">Submit Project Deliverable</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-muted-foreground hover:text-foreground text-sm font-bold">✕</button>
            </div>

            <p className="text-xs text-muted-foreground">
              Submitting verified repository for: <strong className="text-foreground">{submittingProject.title}</strong>
            </p>

            {submitError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground block">
                  GitHub Repository URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/repository"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full rounded-xl bg-muted/40 border border-border px-3.5 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Must be a valid, publicly accessible GitHub repository link.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Live Demo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://your-project.vercel.app"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full rounded-xl bg-muted/40 border border-border px-3.5 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground block">Notes & Implementation Comments (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Share details on your architectural decisions, test coverage, or areas you would like mentor feedback on..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl bg-muted/40 border border-border px-3.5 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-muted text-foreground hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !!submitSuccess}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 transition-colors shadow-md shadow-sky-500/20"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <span>Submit for Evaluation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
