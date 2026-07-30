"use client";

import Image from "next/image";
import { PlayCircle, BookOpen, CheckCircle2, Award, Sparkles } from "lucide-react";

interface RunningCourseCardProps {
  onContinueCourse: () => void;
  onViewOutline: () => void;
}

export function RunningCourseCard({ onContinueCourse, onViewOutline }: RunningCourseCardProps) {
  const course = {
    tag: "CS Fundamentals With QbitX: Spring 2026 | Semester 1",
    title: "Introduction to Programming Language",
    progress: 100,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    gradeStatus: "Check your Grade",
    completedMessage: "Congratulations, completed the course !!!",
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
            {/* Tag */}
            <span className="inline-block text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
              {course.tag}
            </span>

            {/* Title */}
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

          {/* Completion Status & Grade link */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs sm:text-sm font-extrabold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>{course.completedMessage}</span>
            </p>

            <button
              onClick={() => alert("Opening Grade Report: A+ (98/100)")}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1.5 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20"
            >
              <Award className="h-4 w-4" />
              <span>{course.gradeStatus}</span>
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onContinueCourse}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 text-xs font-extrabold transition-all shadow-md shadow-sky-500/20 hover:scale-[1.02]"
            >
              <PlayCircle className="h-4.5 w-4.5" />
              <span>Continue Course</span>
            </button>

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
    </div>
  );
}
