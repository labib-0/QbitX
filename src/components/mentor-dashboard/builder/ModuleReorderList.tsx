"use client";

import { useState } from "react";
import { Module, Lesson } from "@/types/content";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { Layers, ChevronUp, ChevronDown, Plus, Eye, EyeOff, Trash2, Edit2, PlayCircle, BookOpen, HelpCircle, FileText } from "lucide-react";

interface ModuleReorderListProps {
  courseId: string;
  onSelectLesson?: (lesson: Lesson) => void;
  onAddLesson?: (moduleId: string) => void;
  onAddModule?: () => void;
}

export function ModuleReorderList({ courseId, onSelectLesson, onAddLesson, onAddModule }: ModuleReorderListProps) {
  const [modules, setModules] = useState<Module[]>(ContentRetrievalService.getModulesForCourse(courseId, "mentor"));

  const handleMoveModule = (index: number, direction: "up" | "down") => {
    const updated = [...modules];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setModules(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-500" />
          <span>Curriculum Modules & Lessons Tree</span>
        </h3>
        {onAddModule && (
          <button
            onClick={onAddModule}
            className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 font-extrabold text-xs border border-purple-500/20 flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Module
          </button>
        )}
      </div>

      <div className="space-y-3">
        {modules.map((mod, idx) => {
          const lessons = ContentRetrievalService.getLessonsForModule(mod.id, "mentor");
          return (
            <div key={mod.id} className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="font-extrabold text-sm text-foreground font-heading">{mod.metadata.title}</h4>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => handleMoveModule(idx, "up")} disabled={idx === 0} className="p-1 rounded-lg hover:bg-muted disabled:opacity-30">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleMoveModule(idx, "down")} disabled={idx === modules.length - 1} className="p-1 rounded-lg hover:bg-muted disabled:opacity-30">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {onAddLesson && (
                    <button onClick={() => onAddLesson(mod.id)} className="p-1 px-2 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center gap-1 ml-2">
                      <Plus className="h-3 w-3" /> Lesson
                    </button>
                  )}
                </div>
              </div>

              {/* Lessons List inside Module */}
              <div className="pl-6 space-y-1.5 border-l-2 border-purple-500/20">
                {lessons.map((les) => (
                  <div
                    key={les.id}
                    onClick={() => {
                      if (onSelectLesson) onSelectLesson(les);
                    }}
                    className="p-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/80 hover:border-purple-500/40 text-xs font-medium cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <span className="truncate pr-2 text-foreground font-bold">{les.metadata.title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">{les.metadata.estimatedDurationMinutes} mins</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
