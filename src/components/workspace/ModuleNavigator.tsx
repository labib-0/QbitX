"use client";

import { useState } from "react";
import {
  ChevronDown,
  CheckCircle2,
  PlayCircle,
  Lock,
  BookOpen,
  Code2,
  HelpCircle,
  FileText,
  Radio,
  Layers,
  Sparkles,
} from "lucide-react";
import { Module, Lesson, ActivityType } from "@/types/content";

interface ModuleNavigatorProps {
  modules: Module[];
  lessonsByModule: Record<string, Lesson[]>;
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
}

const LESSON_ICONS: Record<string, React.ElementType> = {
  video: PlayCircle,
  reading: BookOpen,
  interactive_slides: BookOpen,
  coding_lab: Code2,
  quiz: HelpCircle,
  assignment: FileText,
  project: Sparkles,
  live_session: Radio,
};

export function ModuleNavigator({
  modules,
  lessonsByModule,
  currentLessonId,
  onSelectLesson,
}: ModuleNavigatorProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": true,
    "mod-3": true,
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 border-r border-border/60 bg-card/40 backdrop-blur-md p-4 space-y-4 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="h-4.5 w-4.5 text-sky-500" />
          <h3 className="font-extrabold text-sm text-foreground">Course Content Navigator</h3>
        </div>
      </div>

      <div className="space-y-3">
        {modules.map((mod) => {
          const lessons = lessonsByModule[mod.id] || [];
          const isExpanded = expandedModules[mod.id] ?? true;

          return (
            <div key={mod.id} className="rounded-2xl border border-border bg-card overflow-hidden transition-all shadow-sm">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full p-3.5 flex items-center justify-between bg-muted/40 hover:bg-muted/70 text-left transition-colors font-heading"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] font-extrabold text-sky-500 uppercase tracking-wider block">
                    Module {mod.orderIndex}
                  </span>
                  <h4 className="font-extrabold text-xs text-foreground truncate">{mod.metadata.title}</h4>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </button>

              {/* Lesson Items List */}
              {isExpanded && (
                <div className="divide-y divide-border/40 p-1">
                  {lessons.map((les, idx) => {
                    const isSelected = les.id === currentLessonId;
                    const IconComp = LESSON_ICONS[les.metadata.category] || BookOpen;

                    return (
                      <button
                        key={les.id}
                        onClick={() => onSelectLesson(les.id)}
                        className={`w-full p-3 rounded-xl flex items-start gap-3 transition-all text-left group ${
                          isSelected
                            ? "bg-sky-500 text-white shadow-md shadow-sky-500/20 scale-[1.01]"
                            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? "bg-white/20 text-white" : "bg-sky-500/10 text-sky-500"}`}>
                          <IconComp className="h-4 w-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-extrabold line-clamp-2 leading-snug ${isSelected ? "text-white" : "text-foreground"}`}>
                            {les.metadata.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] opacity-80">
                            <span>{les.metadata.estimatedDurationMinutes} mins</span>
                            <span>•</span>
                            <span className="capitalize">{les.metadata.difficulty}</span>
                          </div>
                        </div>

                        {idx === 0 && !isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
