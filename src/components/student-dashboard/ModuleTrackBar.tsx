"use client";

import { useState } from "react";
import { CheckCircle2, Layers, Circle } from "lucide-react";
import { MOCK_COURSES } from "@/lib/dashboardData";

export function ModuleTrackBar() {
  // Pull modules from the active course (first enrolled course)
  const activeCourse = MOCK_COURSES[0];

  const modules = Array.from({ length: activeCourse.totalModules }, (_, i) => ({
    num: i + 1,
    name: getModuleName(i + 1),
    status: i < activeCourse.completedModules ? "completed" : i === activeCourse.completedModules ? "active" : "locked",
  }));

  const [activeModule, setActiveModule] = useState(
    modules.find(m => m.status === "active") || modules[modules.length - 1]
  );

  const completedCount = modules.filter(m => m.status === "completed").length;
  const pct = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 space-y-5 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
            <Layers className="h-5 w-5 text-sky-500" />
            <span>Module Finish Track</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {activeCourse.title} — interactive module completion pipeline.
          </p>
        </div>
        
        <span className={`text-xs font-extrabold px-4 py-1.5 rounded-full border ${
          pct === 100
            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
            : "text-sky-500 bg-sky-500/10 border-sky-500/20"
        }`}>
          {completedCount} / {modules.length} Modules — {pct}%
        </span>
      </div>

      {/* Dynamic Module Chips Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 pt-1">
        {modules.map((m) => {
          const isSelected = activeModule.num === m.num;
          return (
            <button
              key={m.num}
              onClick={() => setActiveModule(m)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20 scale-105"
                  : m.status === "completed"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  : m.status === "active"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                  : "bg-muted text-muted-foreground border-border opacity-60 cursor-not-allowed"
              }`}
              disabled={m.status === "locked"}
            >
              {m.status === "completed" ? (
                <CheckCircle2 className={`h-4 w-4 ${isSelected ? "text-white" : "text-emerald-500"}`} />
              ) : (
                <Circle className={`h-4 w-4 ${isSelected ? "text-white" : m.status === "active" ? "text-amber-500" : "text-muted-foreground"}`} />
              )}
              <span className="text-xs font-extrabold block">Mod {m.num}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Module Callout Bar */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-extrabold text-sky-500 uppercase tracking-wider block">
            {activeModule.status === "completed" ? "Completed Module" : activeModule.status === "active" ? "Currently Active Module" : "Locked Module"}
          </span>
          <p className="font-bold text-sm text-foreground">Module {activeModule.num}: {activeModule.name}</p>
        </div>
        <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border ${
          activeModule.status === "completed"
            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
            : activeModule.status === "active"
            ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
            : "text-muted-foreground bg-muted border-border"
        }`}>
          {activeModule.status === "completed" ? "✓ Verified Finished" : activeModule.status === "active" ? "▶ In Progress" : "🔒 Locked"}
        </span>
      </div>
    </div>
  );
}

// Module names mapped to position — matches dashboardData course structure
function getModuleName(num: number): string {
  const names: Record<number, string> = {
    1: "Intro to C / Programming",
    2: "Variables & Data Types",
    3: "Conditional Statements",
    4: "Loops & Iterations",
    5: "Arrays & Pointers",
    6: "Strings & File I/O",
    7: "Recursion & Functions",
    8: "Structures & Unions",
    9: "Data Structures Intro",
    10: "Linked List Operations",
    11: "Stack & Queue Systems",
    12: "Final Project & Viva",
    13: "Advanced Algorithms",
    14: "Graph Theory",
    15: "Dynamic Programming",
    16: "System Design Basics",
    17: "API Architecture",
    18: "Cloud Fundamentals",
    19: "Security Essentials",
    20: "Capstone Project",
  };
  return names[num] || `Module ${num}`;
}
