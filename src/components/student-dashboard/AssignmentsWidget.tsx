"use client";

import { useState } from "react";
import { CheckSquare, Upload, Download, FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export function AssignmentsWidget() {
  const [filter, setFilter] = useState<"Upcoming" | "Submitted" | "Overdue" | "Grades">("Upcoming");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const assignments = [
    {
      id: "a1",
      title: "DSA Lab #4: Graph Traversal & Dijkstra",
      course: "DSA 201",
      dueDate: "Tomorrow @ 11:59 PM",
      status: "Upcoming",
      grade: null,
      maxScore: 100,
    },
    {
      id: "a2",
      title: "RAG Pipeline Next.js Integration",
      course: "Full-Stack AI",
      dueDate: "Friday @ 4:00 PM",
      status: "Upcoming",
      grade: null,
      maxScore: 100,
    },
    {
      id: "a3",
      title: "SQL Indexing & Query Optimization",
      course: "Databases 301",
      dueDate: "Jul 22, 2026",
      status: "Submitted",
      grade: "96 / 100",
      maxScore: 100,
    },
    {
      id: "a4",
      title: "Docker Container Orchestration Lab",
      course: "DevOps",
      dueDate: "Jul 18, 2026",
      status: "Submitted",
      grade: "98 / 100",
      maxScore: 100,
    },
    {
      id: "a5",
      title: "C++ Memory Leak & Valgrind Analysis",
      course: "Systems 201",
      dueDate: "Jul 10, 2026",
      status: "Overdue",
      grade: null,
      maxScore: 100,
    },
  ];

  const filtered = assignments.filter((a) => {
    if (filter === "Grades") return a.grade !== null;
    return a.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-sky-500" />
            <span>Assignments & Course Submissions</span>
          </h2>
          <p className="text-xs text-muted-foreground">Manage your lab reports, code repositories, and grading feedback.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl text-xs font-bold">
          {(["Upcoming", "Submitted", "Overdue", "Grades"] as const).map((tab) => (
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

      {/* Assignment List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-sky-500/30 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                  item.status === "Upcoming"
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                    : item.status === "Submitted"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/15 text-red-500"
                }`}>
                  {item.status}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">{item.course}</span>
              </div>

              <h3 className="font-bold text-base text-foreground font-heading">{item.title}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-500" />
                Due: <strong className="text-foreground font-mono">{item.dueDate}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {item.grade ? (
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block font-semibold">Grade Received</span>
                  <span className="text-base font-black text-emerald-500">{item.grade}</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedAssignment(item.title);
                    setShowUploadModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 text-white px-4 py-2 text-xs font-bold hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/20"
                >
                  <Upload className="h-4 w-4" />
                  <span>Submit Work</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Simulation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground">Submit Assignment</h3>
            <p className="text-xs text-muted-foreground">Uploading code package for: <strong>{selectedAssignment}</strong></p>

            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-2 cursor-pointer hover:border-sky-500 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-sky-500 animate-bounce" />
              <p className="text-xs font-bold text-foreground">Drag & Drop ZIP or PDF file here</p>
              <p className="text-[10px] text-muted-foreground">Max file size: 25MB (.zip, .pdf, .py, .ts)</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-muted text-foreground">Cancel</button>
              <button
                onClick={() => {
                  alert("Assignment uploaded successfully! Simulated submission saved.");
                  setShowUploadModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 text-white hover:bg-sky-600"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
