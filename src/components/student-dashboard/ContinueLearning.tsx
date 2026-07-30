"use client";

import { Course } from "@/services/CourseService";
import { BookOpen, Clock, ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ContinueLearningProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export function ContinueLearning({ courses, onSelectCourse }: ContinueLearningProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sky-500" />
            <span>Continue Learning</span>
          </h2>
          <p className="text-xs text-muted-foreground">Pick up right where you left off in your enrolled courses.</p>
        </div>
        <span className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
          View All Enrolled ({courses.length})
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-sky-500/40 transition-all flex flex-col justify-between"
          >
            {/* Course Header Thumbnail */}
            <div className="relative h-36 w-full overflow-hidden bg-muted">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-sky-400 px-2.5 py-1 rounded-md border border-white/10">
                  {course.category}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-sm leading-snug line-clamp-1">{course.title}</h3>
                <p className="text-[11px] text-slate-300">Instructor: {course.instructor}</p>
              </div>
            </div>

            {/* Course Content Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-sky-500" />
                    {course.estimatedTimeLeft}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Opened {course.lastAccessed}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 text-xs">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Next Topic:</span>
                  <p className="font-semibold text-foreground text-xs leading-snug line-clamp-1">{course.nextTopic}</p>
                </div>
              </div>

              {/* Progress Bar & Action */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px] font-medium">
                    {course.completedModules}/{course.totalModules} Modules Done
                  </span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">{course.progress}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <button
                  onClick={() => onSelectCourse(course.id)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-300 hover:text-white border border-sky-500/20 py-2.5 text-xs font-bold transition-all group-hover:bg-sky-500 group-hover:text-white"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Continue Module</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
