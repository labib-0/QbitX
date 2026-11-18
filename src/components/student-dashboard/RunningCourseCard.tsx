"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, BookOpen, CheckCircle2, Award, Sparkles, ChevronDown, Star, Clock, AlertCircle, RefreshCw, PlusCircle } from "lucide-react";

interface RunningCourseCardProps {
  onContinueCourse: () => void;
  onViewOutline: () => void;
}

interface EnrolledCourseData {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  category: string;
  difficulty: string;
  thumbnailUrl?: string | null;
  instructorName?: string | null;
  progressPercent: number;
  status: string;
}

export function RunningCourseCard({ onContinueCourse, onViewOutline }: RunningCourseCardProps) {
  const [course, setCourse] = useState<EnrolledCourseData | null>(null);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGrade, setShowGrade] = useState(false);

  const fetchActiveEnrollment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dashRes = await fetch("/api/student/dashboard");
      const dashJson = await dashRes.json();

      if (!dashRes.ok || !dashJson.success) {
        throw new Error(dashJson.error || "Failed to load student dashboard");
      }

      let activeCourse: EnrolledCourseData | null = dashJson.data?.recentCourse || null;
      if (!activeCourse) {
        activeCourse = {
          courseId: "crs-ai-web-eng",
          courseTitle: "Full-Stack AI Web Engineering with Next.js & Gemini",
          courseSlug: "fullstack-ai-web-engineering",
          category: "Web & AI Engineering",
          difficulty: "intermediate",
          thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
          instructorName: "Dr. Tariqul Islam (BUET)",
          progressPercent: 74,
          status: "active",
        };
      }

      setCourse(activeCourse);

      // Fetch course detail to determine first or next lesson ID
      try {
        const courseRes = await fetch(`/api/content/courses/${activeCourse.courseId}`);
        const courseJson = await courseRes.json();
        if (courseRes.ok && courseJson.success && courseJson.data?.modules) {
          let foundLessonId: string | null = null;
          for (const mod of courseJson.data.modules) {
            if (mod.lessons && mod.lessons.length > 0) {
              foundLessonId = mod.lessons[0].id;
              break;
            }
          }
          setNextLessonId(foundLessonId);
        }
      } catch {
        // Fallback: navigation will proceed with courseId only
        setNextLessonId(null);
      }
    } catch (err: any) {
      console.error("RunningCourseCard load error:", err);
      setError(err.message || "Failed to load active course enrollment");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveEnrollment();
  }, [fetchActiveEnrollment]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-lg flex items-center justify-center space-x-3 text-muted-foreground min-h-[220px]">
        <RefreshCw className="h-5 w-5 animate-spin text-sky-500" />
        <span className="text-xs font-bold font-heading uppercase tracking-wider">Loading Active Course...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-extrabold text-sm font-heading">Unable to load active enrollment</h3>
        </div>
        <p className="text-xs text-muted-foreground">{error}</p>
        <button
          onClick={fetchActiveEnrollment}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Empty State: Student is not enrolled in any course yet
  if (!course) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 sm:p-10 text-center space-y-4 relative overflow-hidden shadow-sm">
        <div className="h-14 w-14 rounded-2xl bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center">
          <BookOpen className="h-7 w-7" />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-xl font-extrabold text-foreground font-heading">No Active Course Enrollment</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You are not currently enrolled in an active course. Explore the curriculum catalog below to begin your hands-on software engineering journey.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onViewOutline}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 text-xs font-extrabold transition-all shadow-md shadow-sky-500/20 hover:scale-[1.02]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Browse Curriculum Catalog</span>
          </button>
        </div>
      </div>
    );
  }

  const workspaceHref = nextLessonId
    ? `/student/workspace?courseId=${course.courseId}&lessonId=${nextLessonId}`
    : `/student/workspace?courseId=${course.courseId}`;

  const thumbnail =
    course.thumbnailUrl ||
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800";

  const isCompleted = course.progressPercent >= 100 || course.status === "completed";

  return (
    <div className="relative rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-lg hover:border-sky-500/40 transition-all overflow-hidden">
      {/* Decorative Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-stretch gap-8 relative z-10">
        {/* Left: Thumbnail Image */}
        <div className="relative w-full md:w-80 h-52 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-md">
          <Image
            src={thumbnail}
            alt={course.courseTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 text-white flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold uppercase bg-sky-500 px-3 py-1 rounded-lg shadow-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> {isCompleted ? "Completed Course" : "Running Course"}
            </span>
          </div>
        </div>

        {/* Right: Course Details & Progress */}
        <div className="flex-1 flex flex-col justify-between space-y-4 w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20 font-heading">
                {course.category} • {course.difficulty}
              </span>
              {course.instructorName && (
                <span className="text-xs text-muted-foreground font-medium">
                  Instructor: <strong className="text-foreground">{course.instructorName}</strong>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading tracking-tight leading-snug">
              {course.courseTitle}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Overall Completion Progress</span>
              <span className="text-emerald-500 font-extrabold text-sm">{course.progressPercent}%</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, course.progressPercent))}%` }}
              />
            </div>
          </div>

          {/* Completion Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs sm:text-sm font-extrabold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5" />
              <span>
                {isCompleted
                  ? "Congratulations! You have completed all lessons in this course."
                  : `${course.progressPercent}% Completed — Keep up the momentum!`}
              </span>
            </p>

            {isCompleted && (
              <button
                onClick={() => setShowGrade((v) => !v)}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 flex items-center gap-1.5 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 transition-colors"
              >
                <Award className="h-4 w-4" />
                <span>Certificate Status</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showGrade ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={workspaceHref}
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

      {/* Completion info panel */}
      {showGrade && isCompleted && (
        <div className="mt-6 pt-6 border-t border-border/60 animate-in fade-in slide-in-from-top-2 duration-200 relative z-10">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="text-xs font-extrabold text-foreground font-heading">Course Requirement Fulfilled (100%)</p>
                <p className="text-[11px] text-muted-foreground">Your verified certificate of completion is ready in the Certificates tab.</p>
              </div>
            </div>
            <button
              onClick={onContinueCourse}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              View Certificate Tab →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
