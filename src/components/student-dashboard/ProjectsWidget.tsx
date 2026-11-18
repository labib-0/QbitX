"use client";

import { useState, useEffect } from "react";
import {
  FolderGit2,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Send,
  Code2,
  RefreshCw,
  Award,
  ChevronRight,
  MessageSquare
} from "lucide-react";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface Milestone {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  requirements: string[];
}

interface ProjectReview {
  id: string;
  reviewerName: string;
  score: number;
  feedbackMarkdown: string;
  status: "approved" | "changes_requested";
  reviewedAt: string;
}

interface ProjectSubmission {
  id: string;
  githubRepoUrl: string;
  liveDemoUrl?: string;
  notes?: string;
  status: "pending_review" | "reviewed" | "needs_changes";
  submittedAt: string;
  reviews?: ProjectReview[];
}

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  technologies: string[];
  learningObjectives: string[];
  starterRepoUrl?: string;
  estimatedHours: number;
  milestonesCount: number;
  enrollment?: {
    id: string;
    status: "in_progress" | "submitted" | "completed";
    currentMilestone: number;
    startedAt: string;
    completedAt?: string;
  } | null;
  submissionsCount: number;
}

const FALLBACK_PROJECT_ITEMS: ProjectItem[] = [
  {
    id: "proj-bkash-ledger",
    slug: "bkash-nagad-payment-ledger",
    title: "bKash/Nagad Real-Time Payment Gateway & Ledger Simulator",
    description: "High-concurrency digital wallet ledger simulating instant mobile financial services (MFS), idempotent webhook callbacks, and double-entry accounting reconciliation.",
    difficulty: "intermediate",
    technologies: ["Next.js", "TypeScript", "Neon PostgreSQL", "ACID Transactions", "Webhooks"],
    learningObjectives: [
      "Implement double-entry bookkeeping ledger with transactional row-level locks",
      "Author idempotent webhook dispatchers with SHA-256 HMAC signature verification",
      "Build merchant settlement workflows and real-time transaction reconciliation dashboards",
    ],
    starterRepoUrl: "https://github.com/tanvir-ahmed-buet/bkash-ledger-simulator",
    estimatedHours: 30,
    milestonesCount: 3,
    enrollment: {
      id: "penr-tanvir-bkash",
      status: "submitted",
      currentMilestone: 3,
      startedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    submissionsCount: 1,
  },
  {
    id: "proj-dhaka-traffic",
    slug: "dhaka-traffic-flow-optimizer",
    title: "Dhaka Smart Traffic Flow Optimizer & Route Planning Engine",
    description: "Real-time traffic congestion analysis and shortest-path routing optimization engine modeled on Dhaka's arterial road networks, flyovers, and elevated expressways.",
    difficulty: "advanced",
    technologies: ["Python", "FastAPI", "Graph Theory", "A* Search", "Next.js"],
    learningObjectives: [
      "Model multi-modal urban transit networks with weighted directed graphs",
      "Implement Dijkstra and A* pathfinding with real-time bottleneck weights",
      "Visualize route congestion heatmaps and simulated transit travel times",
    ],
    starterRepoUrl: "https://github.com/tanvir-ahmed-buet/dhaka-traffic-optimizer",
    estimatedHours: 40,
    milestonesCount: 3,
    enrollment: {
      id: "penr-tanvir-traffic",
      status: "in_progress",
      currentMilestone: 2,
      startedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    submissionsCount: 0,
  },
  {
    id: "proj-bangla-ocr",
    slug: "bangla-ocr-document-digitizer",
    title: "AI-Powered Bangla OCR & Document Digitizer Platform",
    description: "Computer vision and LLM-powered document intelligence platform for converting scanned Bengali academic textbooks, government circulars, and manuscripts into searchable text.",
    difficulty: "intermediate",
    technologies: ["Next.js", "TypeScript", "Google Gemini", "Tesseract", "Tailwind CSS"],
    learningObjectives: [
      "Process high-resolution Bengali document scans and apply adaptive thresholding",
      "Integrate Gemini Vision models for nuanced Bengali grammatical correction",
      "Export structured searchable PDF and Markdown outputs with citation anchors",
    ],
    starterRepoUrl: "https://github.com/qbitx/bangla-ocr-starter",
    estimatedHours: 28,
    milestonesCount: 3,
    enrollment: null,
    submissionsCount: 0,
  },
  {
    id: "proj-chaldal-inventory",
    slug: "chaldal-grocery-logistics-hub",
    title: "Chaldal-Style Real-Time Grocery Inventory & Cold-Chain Logistics Hub",
    description: "Full-stack warehousing inventory system featuring live stock reservation, FIFO warehouse dispatching, cold-chain temperature alerts, and delivery route tracking.",
    difficulty: "beginner",
    technologies: ["React", "TypeScript", "Neon PostgreSQL", "Drizzle ORM"],
    learningObjectives: [
      "Design normalized inventory tables with atomic reservation decrements",
      "Build batch packing lists and micro-fulfillment dispatch pipelines",
      "Implement real-time delivery status dashboards with driver assignment",
    ],
    starterRepoUrl: "https://github.com/qbitx/chaldal-inventory-starter",
    estimatedHours: 20,
    milestonesCount: 2,
    enrollment: null,
    submissionsCount: 0,
  },
];

export function ProjectsWidget() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [filter, setFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected project for detailed milestone / submission modal
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Submission Form State
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to load projects");
      }
      if (Array.isArray(data.data) && data.data.length > 0) {
        setProjects(data.data);
      } else {
        setProjects(FALLBACK_PROJECT_ITEMS);
      }
    } catch (err: any) {
      console.warn("Using fallback projects:", err);
      setProjects(FALLBACK_PROJECT_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch full details when opening modal
  const handleOpenProject = async (p: ProjectItem) => {
    try {
      setLoadingDetail(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      const res = await fetch(`/api/projects/${p.id}`);
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to load project details");
      }
      setSelectedProject(data.data);
    } catch (err: any) {
      alert(err.message || "Could not fetch project details");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Enroll in project
  const handleEnroll = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/enroll`, {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Enrollment failed");
      }
      await fetchProjects();
      if (selectedProject?.id === projectId) {
        await handleOpenProject(selectedProject);
      }
    } catch (err: any) {
      alert(err.message || "Failed to enroll");
    }
  };

  // Submit project
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      // Validate GitHub regex
      const ghRegex = /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/;
      if (!ghRegex.test(githubRepoUrl.trim())) {
        throw new Error("Please enter a valid GitHub repository URL (e.g. https://github.com/username/repository)");
      }

      const res = await fetch(`/api/projects/${selectedProject.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubRepoUrl: githubRepoUrl.trim(),
          liveDemoUrl: liveDemoUrl.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitSuccess("Project submitted successfully! Your mentor review is now pending.");
      setGithubRepoUrl("");
      setLiveDemoUrl("");
      setNotes("");

      // Refresh project detail & list
      await handleOpenProject(selectedProject);
      await fetchProjects();
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit project");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    return p.difficulty === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-sky-500" />
            <span>Capstone Projects & Sprints</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Production-grade software projects with multi-phase milestones, GitHub submissions, and mentor code reviews.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/80 self-start sm:self-auto text-xs font-semibold">
          {(["all", "beginner", "intermediate", "advanced"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilter(diff)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === diff
                  ? "bg-background text-foreground shadow-sm font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="h-7 w-7 text-sky-500 animate-spin" />
          <p className="text-xs text-muted-foreground font-semibold">Loading capstone projects from database...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchProjects} className="ml-auto underline font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Project Cards Grid */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="py-16 text-center rounded-3xl border border-dashed border-border p-8">
          <FolderGit2 className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm font-bold text-foreground">No projects found</p>
          <p className="text-xs text-muted-foreground mt-1">Check back later or adjust your filter.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((p) => {
          const isEnrolled = !!p.enrollment;
          const status = p.enrollment?.status;

          return (
            <div
              key={p.id}
              className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between hover:border-sky-500/40 transition-all shadow-sm space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      p.difficulty === "beginner"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : p.difficulty === "intermediate"
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {p.difficulty}
                  </span>

                  {/* Enrollment / Completion Badge */}
                  {isEnrolled ? (
                    status === "completed" ? (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Completed (+300 XP)</span>
                      </span>
                    ) : status === "submitted" ? (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
                        <Clock className="h-3 w-3 animate-pulse" />
                        <span>In Review</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold bg-sky-500/15 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-full border border-sky-500/30">
                        <GitBranch className="h-3 w-3" />
                        <span>In Progress (Milestone {p.enrollment?.currentMilestone})</span>
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {p.estimatedHours}h Estimated
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-foreground font-heading group-hover:text-sky-500 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {p.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-md border border-border/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <GitBranch className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>{p.milestonesCount} Milestones</span>
                </span>

                <div className="flex items-center gap-2">
                  {!isEnrolled ? (
                    <button
                      onClick={() => handleEnroll(p.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs transition-all shadow-sm"
                    >
                      <span>Start Project</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenProject(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-muted hover:bg-sky-500 hover:text-white text-foreground font-bold text-xs transition-all border border-border"
                    >
                      <span>Workspace & Submit</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Workspace & Submission Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-500">
                    {selectedProject.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    ~{selectedProject.estimatedHours} Hours
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading">
                  {selectedProject.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                ✕
              </button>
            </div>

            {/* Description & Starter Repo */}
            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>{selectedProject.description}</p>
              {selectedProject.starterRepoUrl && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-bold text-foreground">Starter Code:</span>
                  <a
                    href={selectedProject.starterRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sky-500 hover:underline font-bold"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>{selectedProject.starterRepoUrl}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Milestones List */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-foreground font-heading flex items-center gap-1.5">
                <GitBranch className="h-4 w-4 text-purple-500" />
                <span>Project Milestones & Deliverables</span>
              </h3>

              <div className="space-y-2.5">
                {selectedProject.milestones?.map((m: Milestone, idx: number) => (
                  <div
                    key={m.id || idx}
                    className="rounded-2xl border border-border bg-muted/30 p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {m.title}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        Phase {m.orderIndex}
                      </span>
                    </div>
                    {m.description && (
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    )}
                    {m.requirements && m.requirements.length > 0 && (
                      <ul className="list-disc pl-4 text-[11px] text-muted-foreground space-y-0.5 pt-1">
                        {m.requirements.map((r, rIdx) => (
                          <li key={rIdx}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Section */}
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-foreground font-heading flex items-center gap-1.5">
                <Send className="h-4 w-4 text-sky-500" />
                <span>Submit Your Capstone Project</span>
              </h3>

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProject} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    GitHub Repository URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/your-username/your-capstone-repo"
                      value={githubRepoUrl}
                      onChange={(e) => setGithubRepoUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Must be a public GitHub repository link containing your milestone implementations.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Live Demo / Deployment URL (Optional)
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://your-project.vercel.app"
                      value={liveDemoUrl}
                      onChange={(e) => setLiveDemoUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Submission Notes & Reflection
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any architectural tradeoffs, hurdles overcome, or instructions for the reviewer..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Validating & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit for Mentor Code Review</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Submission History & Mentor Reviews */}
            {selectedProject.submissions && selectedProject.submissions.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-extrabold text-foreground font-heading flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-emerald-500" />
                  <span>Submission History & Mentor Feedback</span>
                </h3>

                <div className="space-y-3">
                  {selectedProject.submissions.map((sub: ProjectSubmission) => (
                    <div
                      key={sub.id}
                      className="rounded-2xl border border-border bg-card p-4 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <a
                          href={sub.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-sky-500 hover:underline flex items-center gap-1 font-bold"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>{sub.githubRepoUrl}</span>
                        </a>

                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            sub.status === "reviewed"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : sub.status === "needs_changes"
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {sub.status.replace("_", " ")}
                        </span>
                      </div>

                      {sub.notes && (
                        <p className="text-muted-foreground italic">&ldquo;{sub.notes}&rdquo;</p>
                      )}

                      {/* Mentor Reviews */}
                      {sub.reviews && sub.reviews.length > 0 && (
                        <div className="pt-2 border-t border-border/60 space-y-2">
                          {sub.reviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground flex items-center gap-1.5">
                                  <Award className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Review by {rev.reviewerName || "Mentor"}</span>
                                </span>
                                <span className="font-black text-emerald-500">
                                  {rev.score} / 100
                                </span>
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {rev.feedbackMarkdown}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
