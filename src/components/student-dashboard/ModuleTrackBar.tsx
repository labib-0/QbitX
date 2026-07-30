"use client";

import { useState } from "react";
import { CheckCircle2, Layers } from "lucide-react";

export function ModuleTrackBar() {
  const modules = [
    { num: 1, name: "Intro to C / Programming", status: "completed" },
    { num: 2, name: "Variables & Data Types", status: "completed" },
    { num: 3, name: "Conditional Statements", status: "completed" },
    { num: 4, name: "Loops & Iterations", status: "completed" },
    { num: 5, name: "Arrays & Pointers", status: "completed" },
    { num: 6, name: "Strings & File I/O", status: "completed" },
    { num: 7, name: "Recursion & Functions", status: "completed" },
    { num: 8, name: "Structures & Unions", status: "completed" },
    { num: 9, name: "Data Structures Intro", status: "completed" },
    { num: 10, name: "Linked List Operations", status: "completed" },
    { num: 11, name: "Stack & Queue Systems", status: "completed" },
    { num: 12, name: "Final Project & Viva", status: "completed" },
  ];

  const [activeModule, setActiveModule] = useState(modules[11]);

  const completedCount = modules.filter(m => m.status === "completed").length;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 space-y-5 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
            <Layers className="h-5 w-5 text-sky-500" />
            <span>Module Finish Track</span>
          </h3>
          <p className="text-xs text-muted-foreground">Interactive module completion pipeline for your active semester.</p>
        </div>
        
        <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
          {completedCount} / {modules.length} Modules Finished (100%)
        </span>
      </div>

      {/* Dynamic Module Chips Grid / Scroll */}
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
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              <CheckCircle2 className={`h-4 w-4 ${isSelected ? "text-white" : "text-emerald-500"}`} />
              <span className="text-xs font-extrabold block">Mod {m.num}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Module Callout Bar */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-extrabold text-sky-500 uppercase tracking-wider block">Active Selected Module</span>
          <p className="font-bold text-sm text-foreground">Module {activeModule.num}: {activeModule.name}</p>
        </div>
        <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          ✓ Verified Module Finished
        </span>
      </div>

    </div>
  );
}
