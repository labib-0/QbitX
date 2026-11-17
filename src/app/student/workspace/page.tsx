"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LearningWorkspace } from "@/components/workspace/LearningWorkspace";
import { RefreshCw, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryCourseId = searchParams.get("courseId");
  const queryLessonId = searchParams.get("lessonId") || undefined;

  const [courseId, setCourseId] = useState<string | null>(queryCourseId);
  const [lessonId, setLessonId] = useState<string | undefined>(queryLessonId);
  const [resolvingEnrollment, setResolvingEnrollment] = useState(!queryCourseId);
  const [resolveError, setResolveError] = useState<string | null>(null);

  // If no courseId in URL, resolve from active student enrollment
  useEffect(() => {
    if (queryCourseId) {
      setCourseId(queryCourseId);
      setLessonId(queryLessonId);
      setResolvingEnrollment(false);
      return;
    }

    async function resolveActiveCourse() {
      try {
        setResolvingEnrollment(true);
        const res = await fetch("/api/student/dashboard");
        const json = await res.json();

        if (res.ok && json.success && json.data?.recentCourse?.courseId) {
          const resolvedCourseId = json.data.recentCourse.courseId;
          setCourseId(resolvedCourseId);
          setLessonId(undefined); // LearningWorkspace will resolve the first lesson
        } else {
          setCourseId(null);
        }
      } catch (err: any) {
        console.error("Failed to resolve active enrollment:", err);
        setResolveError("Unable to locate active course enrollment.");
      } finally {
        setResolvingEnrollment(false);
      }
    }

    resolveActiveCourse();
  }, [queryCourseId, queryLessonId]);

  if (resolvingEnrollment) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
          Locating Enrolled Course Workspace...
        </p>
      </div>
    );
  }

  if (resolveError || !courseId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-5">
        <div className="h-16 w-16 rounded-3xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
          <BookOpen className="h-8 w-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-extrabold text-foreground font-heading">No Course Selected</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You must select an enrolled course to access the interactive learning workspace.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/student/dashboard"
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
          >
            Go to Course Catalog
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2.5 rounded-xl border border-border text-foreground text-xs font-bold hover:bg-muted"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <LearningWorkspace initialCourseId={courseId} initialLessonId={lessonId} />;
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
            Initializing Learning Workspace...
          </p>
        </div>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
