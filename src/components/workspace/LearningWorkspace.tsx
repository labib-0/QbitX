"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { YouTubeVideoPlayer } from "./YouTubeVideoPlayer";
import { NotesPanel } from "./NotesPanel";
import { BookmarksPanel } from "./BookmarksPanel";
import { DiscussionsPanel } from "./DiscussionsPanel";
import { AIWorkspaceAssistant } from "./AIWorkspaceAssistant";
import { RefreshCw, CheckCircle2, ChevronRight, BookOpen, Video, Code2, HelpCircle } from "lucide-react";

interface LearningWorkspaceProps {
  initialCourseId?: string;
  initialLessonId?: string;
}

export function LearningWorkspace({
  initialCourseId = "crs-ai-web-eng",
  initialLessonId,
}: LearningWorkspaceProps) {
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<"notes" | "bookmarks" | "discussions" | "ai" | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // 1. Fetch Course Data
  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        const res = await fetch(`/api/content/courses/${initialCourseId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setCourse(json.data);
          setProgressPercent(json.data.enrollmentProgress || 0);

          // Find first lesson or initialLessonId
          let targetLesson = null;
          if (json.data.modules) {
            for (const mod of json.data.modules) {
              if (mod.lessons && mod.lessons.length > 0) {
                if (initialLessonId) {
                  const match = mod.lessons.find((l: any) => l.id === initialLessonId);
                  if (match) {
                    targetLesson = match;
                    break;
                  }
                }
                if (!targetLesson) {
                  targetLesson = mod.lessons[0];
                }
              }
            }
          }

          if (targetLesson) {
            loadLesson(targetLesson.id);
          }
        }
      } catch (err) {
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [initialCourseId, initialLessonId]);

  // 2. Fetch Detailed Lesson Data
  async function loadLesson(lessonId: string) {
    try {
      const res = await fetch(`/api/content/lessons/${lessonId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCurrentLesson(json.data);
        if (json.data.userProgress?.isCompleted) {
          setCompletedLessonIds((prev) => new Set(prev).add(lessonId));
        }
      }
    } catch (err) {
      console.error("Error loading lesson:", err);
    }
  }

  // 3. Mark Lesson Complete
  async function handleCompleteLesson() {
    if (!currentLesson || !course) return;

    try {
      const res = await fetch("/api/content/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          courseId: course.id,
          isCompleted: true,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCompletedLessonIds((prev) => new Set(prev).add(currentLesson.id));
        setProgressPercent(json.data.courseProgressPercent);

        // Find next lesson automatically
        if (course.modules) {
          let foundCurrent = false;
          let nextLesson = null;
          for (const mod of course.modules) {
            for (const l of mod.lessons || []) {
              if (foundCurrent) {
                nextLesson = l;
                break;
              }
              if (l.id === currentLesson.id) {
                foundCurrent = true;
              }
            }
            if (nextLesson) break;
          }

          if (nextLesson) {
            loadLesson(nextLesson.id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }
  }

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
          Loading Learning Workspace...
        </p>
      </div>
    );
  }

  const isCurrentCompleted = currentLesson ? completedLessonIds.has(currentLesson.id) : false;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      {/* Workspace Header */}
      <WorkspaceHeader
        courseTitle={course.title}
        moduleTitle={
          course?.modules?.find((m: any) =>
            m.lessons?.some((l: any) => l.id === currentLesson?.id)
          )?.title || "Course Curriculum"
        }
        lessonTitle={currentLesson?.title || "Lesson Overview"}
        overallProgressPct={progressPercent}
        activePanel={activePanel}
        onTogglePanel={(p: any) => setActivePanel(activePanel === p ? null : p)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Lesson Title & Type Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-500 border border-sky-500/20 font-heading">
                      {currentLesson.lessonType}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {currentLesson.durationMinutes} mins duration
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading">
                    {currentLesson.title}
                  </h1>
                </div>

                <button
                  onClick={handleCompleteLesson}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md font-heading ${
                    isCurrentCompleted
                      ? "bg-emerald-500 text-white shadow-emerald-500/20 cursor-default"
                      : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isCurrentCompleted ? "Completed" : "Mark as Complete"}</span>
                </button>
              </div>

              {/* Video Player or Reading Stage */}
              {currentLesson.lessonType === "video" && currentLesson.youtubeVideoId ? (
                <YouTubeVideoPlayer
                  videoId={currentLesson.youtubeVideoId}
                  title={currentLesson.title}
                  isCompleted={isCurrentCompleted}
                  onComplete={handleCompleteLesson}
                />
              ) : null}

              {/* Markdown Content Notes */}
              {currentLesson.contentMarkdown && (
                <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 prose prose-sm dark:prose-invert max-w-none">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-muted-foreground tracking-wider font-heading">
                    <BookOpen className="h-4 w-4 text-sky-500" />
                    <span>Lesson Notes & Curriculum Guide</span>
                  </div>
                  <div className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {currentLesson.contentMarkdown}
                  </div>
                </div>
              )}

              {/* Assessment / Quiz Section if available */}
              {currentLesson.assessment && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-sky-500" />
                    <h3 className="text-sm font-bold text-foreground font-heading">
                      Knowledge Check: {currentLesson.assessment.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentLesson.assessment.description || "Verify your understanding of this topic to solidify your learning."}
                  </p>
                  <p className="text-xs font-semibold text-sky-500">
                    Passing score required: {currentLesson.assessment.passingScore}%
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Select a lesson from the outline to begin.</p>
            </div>
          )}
        </div>

        {/* Course Modules & Lessons Outline Drawer (Right Side) */}
        <aside className="w-80 border-l border-border bg-card/60 backdrop-blur-md flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-border">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground font-heading">
              Course Outline
            </h2>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{course.totalLessonsCount || 0} Lessons</span>
              <span className="font-bold text-sky-500">{progressPercent}% complete</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-sky-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {(course.modules || []).map((mod: any, mIdx: number) => (
              <div key={mod.id} className="space-y-1.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-heading px-2">
                  Module {mIdx + 1}
                </span>
                <p className="text-xs font-bold text-foreground px-2 line-clamp-1">
                  {mod.title}
                </p>

                <div className="space-y-1 mt-1">
                  {(mod.lessons || []).map((l: any) => {
                    const isSelected = currentLesson?.id === l.id;
                    const isDone = completedLessonIds.has(l.id);

                    return (
                      <button
                        key={l.id}
                        onClick={() => loadLesson(l.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                          isSelected
                            ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : l.lessonType === "video" ? (
                            <Video className="h-4 w-4 text-sky-500 shrink-0" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-purple-500 shrink-0" />
                          )}
                          <span className="truncate">{l.title}</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Side Drawers (Notes, Bookmarks, Discussions, AI Mentor) */}
        {activePanel === "notes" && (
          <NotesPanel
            userId={user?.id || ""}
            courseId={course.id}
            lessonId={currentLesson?.id || ""}
            onClose={() => setActivePanel(null)}
          />
        )}
        {activePanel === "bookmarks" && (
          <BookmarksPanel
            userId={user?.id || ""}
            lessonId={currentLesson?.id || ""}
            onClose={() => setActivePanel(null)}
          />
        )}
        {activePanel === "discussions" && (
          <DiscussionsPanel
            lessonId={currentLesson?.id || ""}
            userId={user?.id || ""}
            userName={user?.name || "Student"}
            onClose={() => setActivePanel(null)}
          />
        )}
        {activePanel === "ai" && (
          <AIWorkspaceAssistant
            lessonTitle={currentLesson?.title || "Current Lesson"}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>
    </div>
  );
}
