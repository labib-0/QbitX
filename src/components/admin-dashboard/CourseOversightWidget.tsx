"use client";

import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { BookOpen, ShieldCheck, Eye, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CourseOversightWidget() {
  const courses = ContentRetrievalService.getCourses(undefined, "admin");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-amber-500" />
          <span>Course Quality Oversight & Governance</span>
        </h2>
        <p className="text-xs text-muted-foreground">Approve course publishing, review quality standards, transfer ownership, and manage version history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-muted">
              <Image src={course.metadata.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600"} alt={course.metadata.title} fill className="object-cover" />
              <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-lg">
                {course.metadata.category}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-foreground font-heading">{course.metadata.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{course.metadata.description}</p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Published v{course.metadata.version}
              </span>
              <Link href={`/mentor/builder/${course.id}`} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                <span>Inspect in Builder</span>
                <Eye className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
