"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LearningWorkspace } from "@/components/workspace/LearningWorkspace";
import { RefreshCw } from "lucide-react";

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "crs-1";
  const lessonId = searchParams.get("lessonId") || "les-1";

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
