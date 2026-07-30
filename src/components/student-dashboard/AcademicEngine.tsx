"use client";

import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Award, 
  Activity,
  Flame
} from "lucide-react";

export function AcademicEngine() {
  const academicData = {
    semester: "Semester 6 (Spring 2026)",
    cgpa: "3.92 / 4.00",
    attendance: "96.4%",
    assignmentsDue: 2,
    upcomingQuiz: "Graph Algorithms - Tomorrow 10 AM",
    labProgress: "92% (8/9 Labs Complete)",
    todaysClass: "10:30 AM - Computer Networks & Distributed Systems",
    upcomingViva: "System Design Viva (Aug 3)",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-500" />
            <span>Academic Engine Progress</span>
          </h2>
          <p className="text-xs text-muted-foreground">University GPA tracking, attendance records, and daily academic tasks.</p>
        </div>
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          {academicData.semester}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* GPA Card */}
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Cumulative GPA</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground font-heading">{academicData.cgpa}</p>
          <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Top 2% of Stanford CS Cohort
          </p>
        </div>

        {/* Attendance Card */}
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Class Attendance</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground font-heading">{academicData.attendance}</p>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full w-[96%]" />
          </div>
        </div>

        {/* Lab Progress Card */}
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">CS Lab Progress</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground font-heading">{academicData.labProgress.split(" ")[0]}</p>
          <p className="text-[11px] text-muted-foreground">{academicData.labProgress.split(" ")[1]} {academicData.labProgress.split(" ")[2]}</p>
        </div>

        {/* Next Class & Quiz */}
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Today&apos;s Class</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xs font-bold text-foreground line-clamp-1">{academicData.todaysClass}</p>
          <span className="inline-block text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
            Starts in 1h 20m
          </span>
        </div>

      </div>
    </div>
  );
}
