"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, BookOpen, CheckCircle2, Award, Sparkles, ChevronDown, Star, Clock } from "lucide-react";

interface RunningCourseCardProps {
  onContinueCourse: () => void;
  onViewOutline: () => void;
}

export function RunningCourseCard({ onContinueCourse, onViewOutline }: RunningCourseCardProps) {
  const [showGrade, setShowGrade] = useState(false);

  const course = {
    tag: "CS Fundamentals With QbitX: Spring 2026 | Semester 1",
    title: "Introduction to Programming Language",
    progress: 100,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    gradeStatus: "Check your Grade",
    completedMessage: "Congratulations, completed the course !!!",
  };

  const gradeDetails = {
    overall: "A+",
    score: 98,
    total: 100,
    breakdown: [
      { label: "Assignments", score: 49, total: 50, pct: 98 },
      { label: "Midterm Exam", score: 24, total: 25, pct: 96 },
      { label: "Final Project", score: 18, total: 20, pct: 90 },
      { label: "Participation", score: 7, total: 5, pct: 100, bonus: true },
    ],
    instructor: "Dr. Sarah Chen",
    issuedDate: "Jul 15, 2026",
    credentialId: "QBITX-PY-2026-0042",
  };

  return (
    <div className="relative rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-lg hover:border-sky-500/40 transition-all overflow-hidden">
      
      {/* Decorative Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-stretch gap-8 relative z-10">
        
        {/* Left: Thumbnail Image */}
        <div className="relative w-full md:w-80 h-52 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-md">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 text-white flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold uppercase bg-sky-500 px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Running Course
            </span>
          </div>
        </div>

        {/* Right: Course Details & Progress */}
        <div className="flex-1 flex flex-col justify-between space-y-4 w-full">
          
          <div className="space-y-2">
            <span className="inline-block text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
              {course.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading tracking-tight leading-snug">
              {course.title}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Overall Completion Progress</span>
              <span className="text-emerald-500 font-extrabold text-sm">{course.progress}%</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* Completion Status & Grade toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs sm:text-sm font-extrabold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>{course.completedMessage}</span>
            </p>

            <button
              onClick={() => setShowGrade((v) => !v)}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 flex items-center gap-1.5 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 transition-colors"
            >
              <Award className="h-4 w-4" />
              <span>{course.gradeStatus}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showGrade ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/student/workspace?courseId=crs-1&lessonId=les-1"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 text-xs font-extrabold transition-all shadow-md shadow-sky-500/20 hover:scale-[1.02]"
            >
              <PlayCircle className="h-4.5 w-4.5" />
              <span>Continue Course Workspace</span>
            </Link>

            <button
              onClick={onViewOutline}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 px-6 py-3 text-xs font-extrabold transition-all"
            >
              <BookOpen className="h-4.5 w-4.5" />
              <span>Course Outline</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Grade Details Panel (expands inside card, no alert) ── */}
      {showGrade && (
        <div className="mt-6 pt-6 border-t border-border/60 animate-in fade-in slide-in-from-top-2 duration-200 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            
            {/* Overall grade badge */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 min-w-[80px]">
                <Star className="h-5 w-5 text-emerald-500 mb-1" />
                <span className="text-3xl font-black text-emerald-500">{gradeDetails.overall}</span>
                <span className="text-[10px] font-bold text-muted-foreground mt-0.5">{gradeDetails.score}/{gradeDetails.total}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Graded by</p>
                <p className="text-sm font-bold text-foreground">{gradeDetails.instructor}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Issued: {gradeDetails.issuedDate}
                </p>
                <p className="text-[10px] font-mono text-sky-500 mt-0.5">ID: {gradeDetails.credentialId}</p>
              </div>
            </div>

            {/* Score breakdown bars */}
            <div className="flex-1 space-y-2.5 min-w-0">
              <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wide">Score Breakdown</p>
              {gradeDetails.breakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-muted-foreground w-28 shrink-0 truncate">
                    {item.label}
                    {item.bonus && <span className="text-emerald-500 ml-1">(+bonus)</span>}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, item.pct)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-extrabold text-foreground w-12 text-right shrink-0">
                    {item.score}/{item.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
