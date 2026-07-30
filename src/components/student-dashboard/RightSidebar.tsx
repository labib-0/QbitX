"use client";

import { useState } from "react";
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Megaphone, 
  Sparkles, 
  ChevronRight,
  Plus
} from "lucide-react";

export function RightSidebar() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Watch Full-Stack AI Web Lecture #4", done: true, tag: "Video" },
    { id: 2, text: "Complete Graph Traversal Quiz #2", done: true, tag: "Quiz" },
    { id: 3, text: "Submit DSA Lab #4 Source Code", done: false, tag: "Assignment" },
    { id: 4, text: "Push GitHub Commit for RAG Pipeline", done: false, tag: "GitHub" },
    { id: 5, text: "Attend PASS Mentor Meeting at 4 PM", done: false, tag: "Meeting" },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;

  return (
    <aside className="hidden xl:block w-80 border-l border-border/40 bg-card/40 backdrop-blur-md p-4 space-y-6 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-20 overflow-y-auto custom-scrollbar">
      
      {/* 1. Learning Streak Card */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Flame className="h-5 w-5 animate-pulse" />
            <span>Learning Streak</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-amber-500 bg-amber-500/20 px-2.5 py-0.5 rounded-full">
            14 Days
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          You are <strong>1 day away</strong> from earning the 15-Day Master Streaker badge & +300 bonus XP!
        </p>
        <div className="grid grid-cols-7 gap-1 pt-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
            <div key={idx} className="text-center">
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold mx-auto ${
                idx < 5 ? "bg-amber-500 text-slate-950 font-black shadow-sm" : "bg-muted text-muted-foreground"
              }`}>
                {idx < 5 ? "✓" : day}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Today's Tasks Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-sky-500" />
            <span>Today&apos;s Tasks</span>
          </h3>
          <span className="text-xs font-semibold text-muted-foreground">
            {completedCount}/{tasks.length} Done
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>

        <div className="space-y-2 pt-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                task.done
                  ? "bg-emerald-500/5 border-emerald-500/20 text-muted-foreground line-through opacity-80"
                  : "bg-card hover:bg-muted/60 border-border text-foreground"
              }`}
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => {}}
                className="mt-0.5 h-4 w-4 rounded border-border text-sky-500 focus:ring-sky-500 cursor-pointer"
              />
              <div className="flex-1 text-xs font-medium leading-snug">
                <span>{task.text}</span>
                <span className="block text-[10px] text-muted-foreground mt-0.5 no-underline font-normal">
                  {task.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Upcoming Deadlines */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-500" />
          <span>Upcoming Deadlines</span>
        </h3>

        <div className="space-y-2">
          {[
            { title: "DSA Lab #4 Submission", course: "DSA 201", due: "Tomorrow, 11:59 PM", urgency: "high" },
            { title: "RAG Pipeline Sprint Review", course: "AI Web Eng", due: "Friday, 4:00 PM", urgency: "medium" },
            { title: "Docker Container Lab Quiz", course: "DevOps", due: "Sunday, 6:00 PM", urgency: "normal" },
          ].map((d, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-card border border-border space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground truncate max-w-[170px]">{d.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  d.urgency === "high" ? "bg-red-500/15 text-red-500" : "bg-purple-500/15 text-purple-500"
                }`}>
                  {d.due.split(",")[0]}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>{d.course}</span>
                <span className="font-mono text-[10px] text-slate-400">{d.due}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Platform Announcements */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-3.5 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400">
          <Megaphone className="h-4 w-4" />
          <span>QbitX Announcement</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Annual Hackathon 2026 registration is live! Team up with your Learning Family to compete for $5,000 in prizes.
        </p>
      </div>

    </aside>
  );
}
