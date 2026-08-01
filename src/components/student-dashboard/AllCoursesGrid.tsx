"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, BookOpen, X, PlayCircle, Clock, CheckCircle2, BarChart2 } from "lucide-react";

interface CourseCardItem {
  id: string;
  category: "Main Courses" | "Conceptual Sessions" | "Advanced Track" | "Lab Mastery";
  title: string;
  thumbnail: string;
  instructor: string;
  modules: number;
  completedModules: number;
  duration: string;
}

export function AllCoursesGrid() {
  const [selectedCourse, setSelectedCourse] = useState<CourseCardItem | null>(null);

  const courses: CourseCardItem[] = [
    {
      id: "course-1",
      category: "Main Courses",
      title: "CS Fundamentals With QbitX: Spring 2026",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
      instructor: "Dr. Sarah Chen",
      modules: 12,
      completedModules: 12,
      duration: "8 weeks",
    },
    {
      id: "course-2",
      category: "Conceptual Sessions",
      title: "CS Fundamentals With QbitX (Conceptual Sessions)",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
      instructor: "Dr. Sarah Chen",
      modules: 16,
      completedModules: 8,
      duration: "6 weeks",
    },
    {
      id: "course-3",
      category: "Advanced Track",
      title: "Advanced Data Structures & System Architecture",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
      instructor: "Prof. Alex Kim",
      modules: 14,
      completedModules: 4,
      duration: "10 weeks",
    },
    {
      id: "course-4",
      category: "Lab Mastery",
      title: "Full-Stack Web Engineering & Cloud Deployment",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
      instructor: "Dr. Maya Patel",
      modules: 20,
      completedModules: 4,
      duration: "12 weeks",
    },
  ];

  const CATEGORY_COLORS: Record<string, string> = {
    "Main Courses": "bg-amber-600",
    "Conceptual Sessions": "bg-emerald-600",
    "Advanced Track": "bg-indigo-600",
    "Lab Mastery": "bg-purple-600",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-sky-500" />
          <span>All Enrolled Courses</span>
        </h2>
        <span className="text-xs font-extrabold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          {courses.length} Active Courses
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {courses.map((course) => {
          const progress = Math.round((course.completedModules / course.modules) * 100);
          return (
            <div
              key={course.id}
              className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-lg text-white shadow-md ${CATEGORY_COLORS[course.category]}`}>
                    {course.category}
                  </span>
                </div>
                {/* Progress pill on thumbnail */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white text-[11px] font-bold">
                  {progress}% done
                </div>
              </div>

              {/* Content & Action */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-base text-foreground font-heading leading-snug">
                    {course.title}
                  </h3>
                  {/* Mini progress bar */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress === 100 ? "bg-emerald-500" : "bg-sky-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {course.completedModules}/{course.modules} modules
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold transition-all shadow-md ${
                    course.category === "Main Courses"
                      ? "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20"
                      : "border border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10"
                  }`}
                >
                  <span>Continue Course</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Course Detail Modal (replaces alert) ── */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedCourse(null); }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Thumbnail */}
            <div className="relative h-48 w-full">
              <Image
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg text-white mb-2 inline-block ${CATEGORY_COLORS[selectedCourse.category]}`}>
                  {selectedCourse.category}
                </span>
                <h2 className="text-lg font-extrabold text-white font-heading leading-snug">
                  {selectedCourse.title}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: BarChart2, label: "Progress", value: `${Math.round((selectedCourse.completedModules / selectedCourse.modules) * 100)}%`, color: "text-sky-500" },
                  { icon: CheckCircle2, label: "Modules", value: `${selectedCourse.completedModules}/${selectedCourse.modules}`, color: "text-emerald-500" },
                  { icon: Clock, label: "Duration", value: selectedCourse.duration, color: "text-purple-500" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="text-center p-3 rounded-2xl bg-muted/40 border border-border/50">
                      <Icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
                      <p className="text-sm font-extrabold text-foreground">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Overall Progress</span>
                  <span>{Math.round((selectedCourse.completedModules / selectedCourse.modules) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${Math.round((selectedCourse.completedModules / selectedCourse.modules) * 100)}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Instructor: <span className="font-bold text-foreground">{selectedCourse.instructor}</span>
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-sky-500 hover:bg-sky-600 text-white transition-colors flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
                >
                  <PlayCircle className="h-4 w-4" />
                  Resume Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
