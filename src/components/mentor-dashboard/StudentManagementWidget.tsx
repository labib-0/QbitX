"use client";

import { useState } from "react";
import Image from "next/image";
import { MentorService } from "@/services/mentor/MentorService";
import { StudentProfileSummary } from "@/types/mentor";
import { Users, Search, Flame, Award, BookOpen, CheckCircle2, ShieldCheck, X } from "lucide-react";

export function StudentManagementWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileSummary | null>(null);

  const students = MentorService.getStudents(searchQuery);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-500" />
            <span>Student Roster & Profiles</span>
          </h2>
          <p className="text-xs text-muted-foreground">Manage, search, and inspect enrolled student profiles across your active tracks.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name, email, track..."
            className="w-full rounded-2xl bg-muted/40 border border-border pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm hover:border-purple-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src={student.avatar}
                  alt={student.name}
                  width={48}
                  height={48}
                  className="rounded-2xl shrink-0 object-cover shadow-sm"
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base text-foreground font-heading truncate">{student.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Track:</span>
                  <span className="font-bold text-foreground truncate max-w-[170px]">{student.track}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Grade:</span>
                  <span className="font-extrabold text-emerald-500">{student.averageGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Streak:</span>
                  <span className="font-extrabold text-amber-500 flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 fill-amber-500" /> {student.streakDays} Days
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(student)}
              className="w-full py-2.5 rounded-xl border border-purple-500/30 text-purple-600 dark:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-extrabold transition-colors"
            >
              Inspect Student Profile
            </button>
          </div>
        ))}
      </div>

      {/* Student Inspector Drawer / Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudent(null); }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  width={44}
                  height={44}
                  className="rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-foreground font-heading">{selectedStudent.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedStudent.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                <BookOpen className="h-4 w-4 mx-auto mb-1 text-sky-500" />
                <p className="text-sm font-extrabold text-foreground">{selectedStudent.enrolledCoursesCount}</p>
                <p className="text-[10px] text-muted-foreground">Courses</p>
              </div>
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                <Award className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                <p className="text-sm font-extrabold text-foreground">{selectedStudent.certificatesCount}</p>
                <p className="text-[10px] text-muted-foreground">Certificates</p>
              </div>
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/50">
                <Flame className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                <p className="text-sm font-extrabold text-foreground">{selectedStudent.streakDays} Days</p>
                <p className="text-[10px] text-muted-foreground">Streak</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1 text-xs">
              <span className="font-extrabold text-purple-600 dark:text-purple-300 block">AI Student Health Status</span>
              <p className="text-muted-foreground">
                Status: <strong className="text-emerald-500 capitalize">{selectedStudent.healthStatus}</strong>. Student consistently submits assignments on time and demonstrates high engagement.
              </p>
            </div>

            <button onClick={() => setSelectedStudent(null)} className="w-full py-2.5 rounded-xl bg-muted text-foreground text-xs font-bold">
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
