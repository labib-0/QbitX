"use client";

import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { BookOpen, Layers, Users, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function CourseManagementWidget() {
  const courses = ContentRetrievalService.getCourses(undefined, "mentor");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-500" />
            <span>Course Syllabus & Modules Browser (Read-Only)</span>
          </h2>
          <p className="text-xs text-muted-foreground">Inspect active curriculum, modules, lessons, and enrollment stats.</p>
        </div>
        <span className="text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
          {courses.length} Enrolled Courses
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const modules = ContentRetrievalService.getModulesForCourse(course.id, "mentor");
          return (
            <div key={course.id} className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm space-y-4 p-6">
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-muted">
                <Image src={course.metadata.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600"} alt={course.metadata.title} fill className="object-cover" />
                <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-lg">
                  {course.metadata.category}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-foreground font-heading">{course.metadata.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{course.metadata.description}</p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span className="flex items-center gap-1"><Layers className="h-4 w-4 text-purple-500" /> {modules.length} Modules</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-sky-500" /> {course.metadata.estimatedDurationMinutes} mins</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4 text-emerald-500" /> 142 Enrolled</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
