"use client";

import { useState, useEffect } from "react";
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Megaphone,
  BookOpen,
  RefreshCw,
  GitBranch
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    enrolledCoursesCount: number;
    completedCoursesCount: number;
    completedLessonsCount: number;
    averageProgressPercent: number;
    activeProjectsCount: number;
    level: number;
    xp: number;
  };
  activeCourses: Array<{
    courseId: string;
    courseTitle: string;
    progressPercent: number;
  }>;
  activeProjects: Array<{
    projectId: string;
    projectTitle: string;
    status: string;
  }>;
  unreadNotifications: Array<{
    id: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
}

export function RightSidebar() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Local task checklist with localStorage persistence
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review next course lesson video", done: false, tag: "Curriculum" },
    { id: 2, text: "Commit code progress to GitHub", done: false, tag: "GitHub" },
    { id: 3, text: "Test knowledge check quiz assessment", done: false, tag: "Quiz" },
  ]);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("qbitx_student_checklist");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch {}

    async function fetchDashboardSummary() {
      try {
        setLoading(true);
        const res = await fetch("/api/student/dashboard");
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("RightSidebar fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardSummary();
  }, []);

  const toggleTask = (id: number) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(updated);
    try {
      localStorage.setItem("qbitx_student_checklist", JSON.stringify(updated));
    } catch {}
  };

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <aside className="hidden xl:block w-80 border-l border-border/40 bg-card/40 backdrop-blur-md p-4 space-y-6 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-20 overflow-y-auto custom-scrollbar">
      {/* 1. Academic Level & XP Card */}
      <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-500 font-bold text-sm font-heading">
            <Flame className="h-5 w-5 animate-pulse" />
            <span>Academic Level</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-sky-500 bg-sky-500/20 px-2.5 py-0.5 rounded-full font-heading">
            Level {data?.stats?.level || 1}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          Total Earned XP: <strong className="text-foreground">{data?.stats?.xp || 0} XP</strong> across{" "}
          <strong className="text-foreground">{data?.stats?.completedLessonsCount || 0}</strong> completed lessons.
        </p>
      </div>

      {/* 2. Today's Tasks Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 font-heading">
            <CheckCircle2 className="h-4 w-4 text-sky-500" />
            <span>Today&apos;s Focus Checklist</span>
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

      {/* 3. Active Enrolled Courses */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 font-heading">
          <BookOpen className="h-4 w-4 text-purple-500" />
          <span>Curriculum Progress</span>
        </h3>

        {loading ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-1 text-sky-500" />
            <span>Syncing progress...</span>
          </div>
        ) : !data?.activeCourses || data.activeCourses.length === 0 ? (
          <div className="p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground text-center">
            No active courses enrolled yet.
          </div>
        ) : (
          <div className="space-y-2">
            {data.activeCourses.slice(0, 3).map((c) => (
              <Link
                key={c.courseId}
                href={`/student/workspace?courseId=${c.courseId}`}
                className="block p-3 rounded-xl bg-card border border-border space-y-1.5 hover:border-sky-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground truncate max-w-[170px] font-heading">{c.courseTitle}</span>
                  <span className="text-[10px] font-bold text-sky-500">{c.progressPercent}%</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500"
                    style={{ width: `${c.progressPercent}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 4. Platform Announcements & Notifications */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-3.5 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400 font-heading">
          <Megaphone className="h-4 w-4" />
          <span>Platform Announcements</span>
        </div>
        {data?.unreadNotifications && data.unreadNotifications.length > 0 ? (
          <div className="space-y-1">
            <p className="font-bold text-foreground">{data.unreadNotifications[0].title}</p>
            <p className="text-muted-foreground leading-relaxed">{data.unreadNotifications[0].message}</p>
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            Welcome to QbitX! Build industry-grade software engineering projects with real-time AI mentoring.
          </p>
        )}
      </div>
    </aside>
  );
}
