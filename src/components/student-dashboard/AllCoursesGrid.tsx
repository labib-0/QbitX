"use client";

import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";

interface CourseCardItem {
  id: string;
  category: "Main Courses" | "Conceptual Sessions" | "Advanced Track" | "Lab Mastery";
  title: string;
  thumbnail: string;
}

export function AllCoursesGrid() {
  const courses: CourseCardItem[] = [
    {
      id: "course-1",
      category: "Main Courses",
      title: "CS Fundamentals With QbitX: Spring 2026",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "course-2",
      category: "Conceptual Sessions",
      title: "CS Fundamentals With QbitX (Conceptual Sessions)",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "course-3",
      category: "Advanced Track",
      title: "Advanced Data Structures & System Architecture",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "course-4",
      category: "Lab Mastery",
      title: "Full-Stack Web Engineering & Cloud Deployment",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-sky-500" />
          <span>All Enrolled Courses</span>
        </h2>
        <span className="text-xs font-extrabold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
          4 Active Courses
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-500/40 transition-all flex flex-col justify-between"
          >
            {/* Thumbnail Header */}
            <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-lg text-white shadow-md ${
                  course.category === "Main Courses"
                    ? "bg-amber-600"
                    : course.category === "Conceptual Sessions"
                    ? "bg-emerald-600"
                    : course.category === "Advanced Track"
                    ? "bg-indigo-600"
                    : "bg-purple-600"
                }`}>
                  {course.category}
                </span>
              </div>
            </div>

            {/* Content & Action */}
            <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between">
              <h3 className="font-extrabold text-base text-foreground font-heading leading-snug">
                {course.title}
              </h3>

              <button
                onClick={() => alert(`Entering ${course.title}`)}
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
        ))}
      </div>
    </div>
  );
}
