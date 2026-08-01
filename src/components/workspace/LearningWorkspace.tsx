"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { ProgressService } from "@/services/content/ProgressService";
import { Course, Module, Lesson, LearningResource } from "@/types/content";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { ModuleNavigator } from "./ModuleNavigator";
import { LessonRenderer } from "./LessonRenderer";
import { NotesPanel } from "./NotesPanel";
import { BookmarksPanel } from "./BookmarksPanel";
import { DiscussionsPanel } from "./DiscussionsPanel";
import { ResourceSidebar } from "./ResourceSidebar";
import { AIWorkspaceAssistant } from "./AIWorkspaceAssistant";
import { RefreshCw } from "lucide-react";

interface LearningWorkspaceProps {
  initialCourseId?: string;
  initialLessonId?: string;
}

export function LearningWorkspace({
  initialCourseId = "crs-1",
  initialLessonId = "les-1",
}: LearningWorkspaceProps) {
  const { user } = useAuth();
  const userId = user?.id || "usr-student-demo";

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessonsByModule, setLessonsByModule] = useState<Record<string, Lesson[]>>({});
  const [currentLessonId, setCurrentLessonId] = useState<string>(initialLessonId);
  const [lessonDetails, setLessonDetails] = useState<{
    lesson: Lesson;
    activities: any[];
    resources: LearningResource[];
    assessments: any[];
  } | null>(null);

  const [activePanel, setActivePanel] = useState<"notes" | "bookmarks" | "discussions" | "resources" | "ai" | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Course Hierarchy
  useEffect(() => {
    const c = ContentRetrievalService.getCourseByIdOrSlug(initialCourseId, "student");
    if (c) {
      setCourse(c);
      const mods = ContentRetrievalService.getModulesForCourse(c.id, "student");
      setModules(mods);

      const lesMap: Record<string, Lesson[]> = {};
      mods.forEach((m) => {
        lesMap[m.id] = ContentRetrievalService.getLessonsForModule(m.id, "student");
      });
      setLessonsByModule(lesMap);
    }
    setLoading(false);
  }, [initialCourseId]);

  // Load Lesson Details when currentLessonId changes
  useEffect(() => {
    if (currentLessonId) {
      const details = ContentRetrievalService.getLessonById(currentLessonId, "student");
      if (details) {
        setLessonDetails(details);
        // Record progress: started
        ProgressService.recordProgress({
          userId,
          entityId: currentLessonId,
          entityType: "lesson",
          status: "started",
          additionalTimeSeconds: 60,
        });
      }
    }
  }, [currentLessonId, userId]);

  const handleTogglePanel = (panel: string) => {
    setActivePanel((prev) => (prev === panel ? null : (panel as any)));
  };

  const handleLessonComplete = () => {
    if (currentLessonId) {
      ProgressService.recordProgress({
        userId,
        entityId: currentLessonId,
        entityType: "lesson",
        status: "completed",
        scorePercentage: 100,
      });
    }
  };

  if (loading || !course || !lessonDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
          Loading QbitX Learning Workspace...
        </p>
      </div>
    );
  }

  const activeModule = modules.find((m) => m.id === lessonDetails.lesson.moduleId) || modules[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased relative overflow-hidden">
      {/* Header */}
      <WorkspaceHeader
        courseTitle={course.metadata.title}
        moduleTitle={activeModule?.metadata.title || "Module"}
        lessonTitle={lessonDetails.lesson.metadata.title}
        overallProgressPct={68}
        activePanel={activePanel}
        onTogglePanel={handleTogglePanel}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex w-full overflow-hidden h-[calc(100vh-4rem)]">
        {/* Module Content Navigator (Collapsible) */}
        <ModuleNavigator
          modules={modules}
          lessonsByModule={lessonsByModule}
          currentLessonId={currentLessonId}
          onSelectLesson={(lesId) => setCurrentLessonId(lesId)}
        />

        {/* Central Lesson Content Renderer Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar space-y-6">
          <LessonRenderer
            lesson={lessonDetails.lesson}
            activity={lessonDetails.activities[0]}
            courseId={course.id}
            userId={userId}
            onBookmarkTimestamp={() => handleTogglePanel("bookmarks")}
            onBookmarkSnippet={() => handleTogglePanel("bookmarks")}
            onCompleteLesson={handleLessonComplete}
          />
        </main>

        {/* Dynamic Side Drawers */}
        {activePanel === "notes" && (
          <NotesPanel
            userId={userId}
            courseId={course.id}
            lessonId={currentLessonId}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "bookmarks" && (
          <BookmarksPanel
            userId={userId}
            lessonId={currentLessonId}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "discussions" && (
          <DiscussionsPanel
            userId={userId}
            userName={user?.name || "Student"}
            lessonId={currentLessonId}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "resources" && (
          <ResourceSidebar
            resources={lessonDetails.resources}
            onClose={() => setActivePanel(null)}
          />
        )}

        {activePanel === "ai" && (
          <AIWorkspaceAssistant
            lessonTitle={lessonDetails.lesson.metadata.title}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>
    </div>
  );
}
