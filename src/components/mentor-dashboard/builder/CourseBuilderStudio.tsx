"use client";

import { useState } from "react";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { ContentAuthoringService } from "@/services/content/ContentAuthoringService";
import { PublishingValidationEngine } from "@/services/content/PublishingValidationEngine";
import { Course, Lesson, ActivityType } from "@/types/content";
import { ModuleReorderList } from "./ModuleReorderList";
import { RichContentEditor } from "./RichContentEditor";
import { LessonTypeSelector } from "./LessonTypeSelector";
import { VisualQuizBuilder } from "./VisualQuizBuilder";
import { VisualAssignmentBuilder } from "./VisualAssignmentBuilder";
import { MediaLibraryModal } from "./MediaLibraryModal";
import { PublishingValidationModal } from "./PublishingValidationModal";
import { AuthoringAIAssistant } from "./AuthoringAIAssistant";
import { Hammer, Play, Upload, ShieldCheck, Plus, Sparkles, CheckCircle2, Eye } from "lucide-react";
import Link from "next/link";

interface CourseBuilderStudioProps {
  courseId?: string;
}

export function CourseBuilderStudio({ courseId = "crs-1" }: CourseBuilderStudioProps) {
  const [course, setCourse] = useState<Course>(
    ContentRetrievalService.getCourseById(courseId, "mentor") || ContentRetrievalService.getCourses(undefined, "mentor")[0]
  );

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [showAssignBuilder, setShowAssignBuilder] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishedLive, setPublishedLive] = useState(false);

  const validationResult = PublishingValidationEngine.validateCourse(course);

  const handleAddModule = () => {
    ContentAuthoringService.addModule(course.id, `New Module ${course.moduleIds.length + 1}`);
    setCourse({ ...ContentRetrievalService.getCourseById(course.id, "mentor")! });
  };

  const handleSelectLessonType = (type: ActivityType) => {
    setShowTypeSelector(false);
    if (type === "quiz") setShowQuizBuilder(true);
    else if (type === "assignment") setShowAssignBuilder(true);
  };

  const handleConfirmPublish = () => {
    course.metadata.status = "published";
    setPublishedLive(true);
    setShowPublishModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold bg-purple-500/20 text-purple-600 dark:text-purple-300 px-3 py-0.5 rounded-full uppercase">
              {course.metadata.status} Mode
            </span>
            <span className="text-xs text-muted-foreground font-mono">v{course.metadata.version}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground font-heading">{course.metadata.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowMediaModal(true)}
            className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5 text-purple-500" /> Media Library
          </button>

          <Link
            href={`/student/workspace?courseId=${course.id}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5"
          >
            <Eye className="h-3.5 w-3.5 text-sky-500" /> Student Preview
          </Link>

          <button
            onClick={() => setShowPublishModal(true)}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 flex items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4" /> Publish Course
          </button>
        </div>
      </div>

      {publishedLive && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-extrabold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" /> Course is now Live & Published to enrolled students!
          </span>
          <button onClick={() => setPublishedLive(false)} className="text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Main Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Modules & Lesson Tree */}
        <div className="lg:col-span-5 space-y-6">
          <ModuleReorderList
            courseId={course.id}
            onSelectLesson={(les) => setActiveLesson(les)}
            onAddLesson={() => setShowTypeSelector(true)}
            onAddModule={handleAddModule}
          />
          <AuthoringAIAssistant />
        </div>

        {/* Right Column: Notion-style Rich Editor Workspace */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-foreground font-heading">
              {activeLesson ? activeLesson.metadata.title : "Lesson Content Editor"}
            </h3>
            <span className="text-xs font-bold text-muted-foreground">Notion Markdown Engine</span>
          </div>

          <RichContentEditor />
        </div>
      </div>

      {/* Modals */}
      {showTypeSelector && <LessonTypeSelector onSelectType={handleSelectLessonType} onClose={() => setShowTypeSelector(false)} />}
      {showQuizBuilder && <VisualQuizBuilder onClose={() => setShowQuizBuilder(false)} onSave={() => {}} />}
      {showAssignBuilder && <VisualAssignmentBuilder onClose={() => setShowAssignBuilder(false)} onSave={() => {}} />}
      {showMediaModal && <MediaLibraryModal onClose={() => setShowMediaModal(false)} />}
      {showPublishModal && <PublishingValidationModal result={validationResult} onPublish={handleConfirmPublish} onClose={() => setShowPublishModal(false)} />}
    </div>
  );
}
