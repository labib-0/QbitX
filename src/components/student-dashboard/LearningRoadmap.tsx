"use client";

import { useState } from "react";
import { RoadmapStep } from "@/services/CourseService";
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Compass, 
  Award, 
  Sparkles,
  ChevronRight,
  Code,
  Database,
  Globe,
  Server,
  Layers,
  Briefcase,
  Cpu,
  GitBranch,
  Binary
} from "lucide-react";

interface LearningRoadmapProps {
  roadmap: RoadmapStep[];
}

export function LearningRoadmap({ roadmap }: LearningRoadmapProps) {
  const [selectedStep, setSelectedStep] = useState<RoadmapStep | null>(roadmap[4] || roadmap[0]);

  const getIcon = (name: string) => {
    switch (name) {
      case "Binary": return Binary;
      case "Code": return Code;
      case "Cpu": return Cpu;
      case "GitBranch": return GitBranch;
      case "Database": return Database;
      case "Globe": return Globe;
      case "Server": return Server;
      case "Layers": return Layers;
      case "Sparkles": return Sparkles;
      case "Briefcase": return Briefcase;
      default: return Code;
    }
  };

  const completedCount = roadmap.filter(r => r.status === "completed").length;
  const progressPercent = Math.round((completedCount / roadmap.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-500" />
            <span>Software Engineer Learning Roadmap</span>
          </h2>
          <p className="text-xs text-muted-foreground">Interactive curriculum map from Computer Science fundamentals to production deployment.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">
            Roadmap Completion: <strong className="text-sky-600 dark:text-sky-400 font-bold">{progressPercent}%</strong>
          </span>
        </div>
      </div>

      {/* Progress Connector Line */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm overflow-hidden">
        
        {/* Horizontal Node Track */}
        <div className="relative flex items-center justify-between overflow-x-auto pb-4 pt-2 px-2 custom-scrollbar gap-4">
          
          {/* Background Connecting Line */}
          <div className="absolute top-8 left-8 right-8 h-1 bg-muted -z-0" />
          <div 
            className="absolute top-8 left-8 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 transition-all duration-500 -z-0" 
            style={{ width: `${(completedCount / (roadmap.length - 1)) * 90}%` }}
          />

          {roadmap.map((step, idx) => {
            const IconComp = getIcon(step.iconName);
            const isSelected = selectedStep?.id === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group shrink-0 min-w-[90px]"
              >
                {/* Node Badge Button */}
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                    step.status === "completed"
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : step.status === "current"
                      ? "bg-gradient-to-tr from-sky-500 to-indigo-600 text-white ring-4 ring-sky-500/30 scale-110 shadow-sky-500/30"
                      : "bg-muted text-muted-foreground border border-border opacity-70"
                  } ${isSelected ? "ring-2 ring-primary" : ""}`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : step.status === "locked" ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <IconComp className="h-6 w-6 animate-pulse" />
                  )}
                </div>

                {/* Step Title Label */}
                <span className={`text-[11px] font-bold text-center leading-tight max-w-[100px] ${
                  isSelected ? "text-sky-600 dark:text-sky-400 font-extrabold" : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {step.title}
                </span>

                {step.status === "current" && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
            );
          })}

        </div>

        {/* Selected Step Detail Panel */}
        {selectedStep && (
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                  selectedStep.status === "completed"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : selectedStep.status === "current"
                    ? "bg-sky-500/20 text-sky-600 dark:text-sky-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {selectedStep.status} Module
                </span>
                <h3 className="font-bold text-base text-foreground">{selectedStep.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{selectedStep.description}</p>
              
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-semibold text-slate-400">Skills Acquired:</span>
                {selectedStep.skillsAcquired.map((skill, i) => (
                  <span key={i} className="text-[10px] font-bold bg-card border border-border text-foreground px-2 py-0.5 rounded-md">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              disabled={selectedStep.status === "locked"}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
                selectedStep.status === "locked"
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md hover:scale-105"
              }`}
            >
              <span>{selectedStep.status === "completed" ? "Review Module" : selectedStep.status === "current" ? "Continue Module" : "Locked Module"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
