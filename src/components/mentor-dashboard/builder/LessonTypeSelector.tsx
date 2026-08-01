"use client";

import { PlayCircle, BookOpen, Code2, HelpCircle, FileText, Radio, Sparkles, FolderCheck, Download, X } from "lucide-react";
import { ActivityType } from "@/types/content";

interface LessonTypeSelectorProps {
  onSelectType: (type: ActivityType) => void;
  onClose: () => void;
}

export function LessonTypeSelector({ onSelectType, onClose }: LessonTypeSelectorProps) {
  const types: { type: ActivityType; label: string; desc: string; icon: React.ElementType; color: string }[] = [
    { type: "video", label: "Video Lesson", desc: "Interactive video with timestamp markers & watch tracking", icon: PlayCircle, color: "text-sky-500" },
    { type: "reading", label: "Reading Article", desc: "Rich text, Markdown, code blocks & callout cards", icon: BookOpen, color: "text-emerald-500" },
    { type: "coding_lab", label: "Interactive Coding Lab", desc: "Python/Code editor with test suite runner & starter code", icon: Code2, color: "text-amber-500" },
    { type: "quiz", label: "Quiz Assessment", desc: "Multiple choice, True/False, Fill-in-blank, or Code quiz", icon: HelpCircle, color: "text-purple-500" },
    { type: "assignment", label: "Assignment & Lab", desc: "Project submission with rubric criteria & GitHub links", icon: FileText, color: "text-indigo-500" },
    { type: "project", label: "Capstone Milestone", desc: "Major portfolio project with architecture blueprints", icon: FolderCheck, color: "text-rose-500" },
    { type: "live_session", label: "Live Mentor Stream", desc: "Interactive webinar stream with live Q&A countdown", icon: Radio, color: "text-red-500" },
    { type: "resource", label: "Downloadable Resource", desc: "Attach PDFs, ZIP starter packages, or Datasets", icon: Download, color: "text-teal-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-extrabold text-lg text-foreground font-heading">Choose Lesson Format</h3>
            <p className="text-xs text-muted-foreground">Select the primary learning activity type for this new lesson.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
          {types.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => onSelectType(item.type)}
                className="p-4 rounded-2xl border border-border bg-muted/30 hover:bg-muted/80 hover:border-purple-500/40 text-left transition-all space-y-2 group"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-card border border-border ${item.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-extrabold text-sm text-foreground font-heading">{item.label}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
