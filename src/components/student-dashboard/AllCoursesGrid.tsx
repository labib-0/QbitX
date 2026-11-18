"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, X, PlayCircle, Clock, CheckCircle2, BarChart2, PlusCircle, RefreshCw } from "lucide-react";

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  thumbnailUrl?: string | null;
  instructorName?: string | null;
  durationHours?: number | null;
  isEnrolled?: boolean;
  progressPercent?: number;
}

const FALLBACK_ALL_COURSES: CourseItem[] = [
  {
    id: "crs-ai-web-eng",
    slug: "fullstack-ai-web-engineering",
    title: "Full-Stack AI Web Engineering with Next.js & Gemini",
    description: "Learn to build production-grade, AI-powered web applications from scratch using Next.js App Router, TypeScript, Drizzle ORM, Neon PostgreSQL, and Google Gemini LLMs.",
    category: "Web & AI Engineering",
    difficulty: "intermediate",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    instructorName: "Dr. Tariqul Islam (BUET)",
    durationHours: 24,
    isEnrolled: true,
    progressPercent: 74,
  },
  {
    id: "crs-dsa-mastery",
    slug: "dsa-practical-mastery",
    title: "Practical Data Structures & Algorithms for Software Engineers",
    description: "A hands-on algorithmic problem-solving course designed to prepare university students for technical interviews and clean software engineering.",
    category: "Computer Science",
    difficulty: "beginner",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    instructorName: "Eng. Mahbubur Rahman",
    durationHours: 32,
    isEnrolled: true,
    progressPercent: 88,
  },
  {
    id: "crs-cloud-backend",
    slug: "cloud-backend-microservices",
    title: "Production Cloud Backend & Microservices Architecture",
    description: "Design fault-tolerant backend services, Dockerized microservices, PostgreSQL connection pooling, and REST/gRPC APIs.",
    category: "Cloud & Systems",
    difficulty: "advanced",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    instructorName: "Nusrat Jahan",
    durationHours: 28,
    isEnrolled: false,
    progressPercent: 0,
  },
];

export function AllCoursesGrid() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const res = await fetch("/api/content/courses");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCourses(json.data);
        } else {
          setCourses(FALLBACK_ALL_COURSES);
        }
      } catch (err) {
        console.warn("Using fallback courses for grid:", err);
        setCourses(FALLBACK_ALL_COURSES);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);
      const res = await fetch("/api/content/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const json = await res.json();
      if (json.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: true } : c))
        );
        if (selectedCourse?.id === courseId) {
          setSelectedCourse({ ...selectedCourse, isEnrolled: true });
        }
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setEnrollingId(null);
    }
  };

  const categories = ["All", ...Array.from(new Set(courses.map((c) => c.category)))];
  const filteredCourses = activeCategory === "All"
    ? courses
    : courses.filter((c) => c.category === activeCategory);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center space-x-2 text-muted-foreground text-xs font-heading">
        <RefreshCw className="h-5 w-5 animate-spin text-sky-500" />
        <span>Loading Curriculum Catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeCategory === cat
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const thumbnail =
            course.thumbnailUrl ||
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600";

          return (
            <div
              key={course.id}
              className="group rounded-3xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-500/40 transition-all flex flex-col"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <Image
                  src={thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-sky-500 text-white font-heading">
                    {course.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-black/60 text-slate-300 font-heading">
                    {course.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-foreground font-heading line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    Instructor: <span className="font-bold text-foreground">{course.instructorName || "Faculty"}</span>
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/student/workspace?courseId=${course.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/20 font-heading"
                  >
                    <span>Start Learning</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollingId === course.id}
                    title="Quick Enroll"
                    className="p-2.5 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {enrollingId === course.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
