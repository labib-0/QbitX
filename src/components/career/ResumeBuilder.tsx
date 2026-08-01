"use client";

import { useState } from "react";
import { StudentPortfolio } from "@/types/career";
import { ResumeGeneratorService, ResumeTemplateType } from "@/services/career/ResumeGeneratorService";
import { FileText, Printer, CheckCircle2, Sparkles } from "lucide-react";

export function ResumeBuilder({ portfolio }: { portfolio: StudentPortfolio }) {
  const [template, setTemplate] = useState<ResumeTemplateType>("software_engineer");
  const resume = ResumeGeneratorService.generateResume(portfolio, template);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <FileText className="h-6 w-6 text-sky-500" />
            <span>Intelligent ATS Resume Builder & PDF Export</span>
          </h2>
          <p className="text-xs text-muted-foreground">Auto-generates ATS-optimized professional resumes from your verified QbitX learning records.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as ResumeTemplateType)}
            className="rounded-xl bg-muted/40 border border-border px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
          >
            <option value="software_engineer">Software Engineer Template</option>
            <option value="ats">ATS Friendly Template</option>
            <option value="modern">Modern Glassmorphism Template</option>
            <option value="academic">Academic / University Template</option>
            <option value="internship">Internship Application Template</option>
          </select>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-md shadow-sky-500/20 flex items-center gap-1.5 shrink-0"
          >
            <Printer className="h-4 w-4" />
            <span>Export Resume PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive Printable Resume Canvas */}
      <div className="rounded-3xl border border-border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8 sm:p-12 space-y-6 shadow-xl max-w-4xl mx-auto font-sans border-t-8 border-t-sky-500">
        {/* Resume Header */}
        <div className="text-center space-y-1 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-black font-heading text-slate-900 dark:text-white uppercase tracking-wider">
            {resume.header.name}
          </h1>
          <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
            {resume.header.degree} • {resume.header.university} (GPA: {resume.header.gpa})
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Email: {resume.header.email} • Location: {resume.header.location} • Portfolio: qbitx.vercel.app/portfolio/alex-rivera
          </p>
        </div>

        {/* Summary */}
        <div className="space-y-1">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400 font-heading">
            Professional Summary
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{resume.summary}</p>
        </div>

        {/* Technical Skills */}
        <div className="space-y-1">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400 font-heading">
            Core Competencies & Verified Technical Skills
          </h3>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {resume.skills.join(" • ")}
          </p>
        </div>

        {/* Capstone Projects */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400 font-heading">
            Featured Capstone Projects
          </h3>
          <div className="space-y-2">
            {resume.projects.map((p, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>{p.title}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{p.tech}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Certifications */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400 font-heading">
            Verified Certifications
          </h3>
          {resume.certificates.map((c, i) => (
            <div key={i} className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>{c.title} — {c.issuer}</span>
              <span className="text-slate-500 font-mono text-[10px]">{c.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
