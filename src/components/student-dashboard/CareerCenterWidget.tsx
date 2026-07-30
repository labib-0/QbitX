"use client";

import { useState } from "react";
import { Briefcase, Target, Award, PlayCircle, FileText, CheckCircle2, ArrowRight, Sparkles, Building2 } from "lucide-react";

export function CareerCenterWidget() {
  const [showMockModal, setShowMockModal] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);

  const careerData = {
    targetRole: "Full-Stack AI & Software Engineer",
    resumeScore: 94,
    interviewReadiness: 88,
    codingReadiness: 96,
    recommendedJobs: [
      { company: "OpenAI", role: "Frontend AI Systems Intern", location: "San Francisco / Remote", match: "98% Match" },
      { company: "Vercel", role: "Next.js Full-Stack Engineer", location: "Remote", match: "95% Match" },
      { company: "Google", role: "Software Engineering Scholar", location: "Mountain View, CA", match: "92% Match" },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-500" />
            <span>QbitX Career & Placement Center</span>
          </h2>
          <p className="text-xs text-muted-foreground">AI-driven career placement, mock technical interviews, and resume optimization.</p>
        </div>

        <span className="text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          Target Role: {careerData.targetRole}
        </span>
      </div>

      {/* Career Readiness Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Coding Readiness</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-sky-600 dark:text-sky-400 font-heading">{careerData.codingReadiness}%</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">LeetCode Ready</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${careerData.codingReadiness}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Interview Readiness</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 font-heading">{careerData.interviewReadiness}%</span>
            <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2.5 py-0.5 rounded-full">System Design</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${careerData.interviewReadiness}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">ATS Resume Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">{careerData.resumeScore}/100</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">Optimal</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${careerData.resumeScore}%` }} />
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setShowMockModal(true)}
          className="p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 transition-all text-left space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
              <PlayCircle className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-extrabold text-base text-foreground font-heading">Start AI Mock Technical Interview</h3>
          <p className="text-xs text-muted-foreground">Simulate real-time system design and coding interviews with voice AI feedback.</p>
        </button>

        <button
          onClick={() => setShowCVModal(true)}
          className="p-5 rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 hover:from-sky-500/20 hover:to-cyan-500/20 transition-all text-left space-y-2 group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-sky-500 text-white shadow-md">
              <FileText className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-sky-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-extrabold text-base text-foreground font-heading">Launch Intelligent CV Builder</h3>
          <p className="text-xs text-muted-foreground">Auto-populate your resume with QbitX verified projects, certificates & skills.</p>
        </button>
      </div>

      {/* Job Recommendations */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
          <Building2 className="h-4 w-4 text-sky-500" />
          <span>Recommended Internships & Opportunities</span>
        </h3>

        <div className="space-y-3">
          {careerData.recommendedJobs.map((j, i) => (
            <div key={i} className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-foreground">{j.company}</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">{j.match}</span>
                </div>
                <p className="text-xs font-bold text-sky-600 dark:text-sky-400">{j.role}</p>
                <span className="text-[11px] text-muted-foreground">{j.location}</span>
              </div>

              <button
                onClick={() => alert(`Applied to ${j.company} (${j.role}) using QbitX One-Click Resume!`)}
                className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 transition-colors shadow-sm shrink-0"
              >
                One-Click Apply
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mock Interview Modal */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4 text-center">
            <Sparkles className="h-10 w-10 mx-auto text-purple-500 animate-bounce" />
            <h3 className="font-extrabold text-lg text-foreground">AI Technical Interview Simulator</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your mock session for <strong>System Design & LeetCode Hard</strong> is starting. Prepare your microphone and code editor.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowMockModal(false)} className="flex-1 rounded-xl bg-muted py-2.5 text-xs font-bold text-foreground">Cancel</button>
              <button onClick={() => { alert("Mock interview launched!"); setShowMockModal(false); }} className="flex-1 rounded-xl bg-purple-600 text-white py-2.5 text-xs font-bold hover:bg-purple-700">Start Session</button>
            </div>
          </div>
        </div>
      )}

      {/* CV Builder Modal */}
      {showCVModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4 text-center">
            <FileText className="h-10 w-10 mx-auto text-sky-500" />
            <h3 className="font-extrabold text-lg text-foreground">CV & Resume Export</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generating ATS-friendly PDF with 6 verified projects, Stanford GPA 3.92, and 4 course certificates.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowCVModal(false)} className="flex-1 rounded-xl bg-muted py-2.5 text-xs font-bold text-foreground">Cancel</button>
              <button onClick={() => { alert("Resume PDF downloaded!"); setShowCVModal(false); }} className="flex-1 rounded-xl bg-sky-500 text-white py-2.5 text-xs font-bold hover:bg-sky-600">Export PDF</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
