"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, FileText, Users, UserCheck, FolderCheck, Download, Award, X, CornerDownLeft } from "lucide-react";
import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { MentorService } from "@/services/mentor/MentorService";

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Course" | "Lesson" | "Assignment" | "Team" | "Student" | "Mentor" | "Resource" | "Certificate";
  href: string;
}

interface GlobalOmniboxSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalOmniboxSearch({ isOpen, onClose }: GlobalOmniboxSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const items: SearchResultItem[] = [];

    // Search Courses
    const courses = ContentRetrievalService.getCourses(undefined, "mentor");
    courses.forEach((c) => {
      if (c.metadata.title.toLowerCase().includes(q) || c.metadata.category.toLowerCase().includes(q)) {
        items.push({
          id: c.id,
          title: c.metadata.title,
          subtitle: `Course • ${c.metadata.category}`,
          category: "Course",
          href: `/student/workspace?courseId=${c.id}`,
        });
      }
    });

    // Search Lessons
    const lessons = ContentRetrievalService.getLessonsForModule("mod-1", "mentor");
    lessons.forEach((l) => {
      if (l.metadata.title.toLowerCase().includes(q)) {
        items.push({
          id: l.id,
          title: l.metadata.title,
          subtitle: `Lesson • ${l.metadata.estimatedDurationMinutes} mins`,
          category: "Lesson",
          href: `/student/workspace?courseId=crs-1&lessonId=${l.id}`,
        });
      }
    });

    // Search Students & Mentors
    const students = MentorService.getStudents(q);
    students.forEach((s) => {
      items.push({
        id: s.id,
        title: s.name,
        subtitle: `Student • ${s.track}`,
        category: "Student",
        href: `/mentor/students`,
      });
    });

    // Search Capstone Teams
    const teams = MentorService.getTeams();
    teams.forEach((t) => {
      if (t.name.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q)) {
        items.push({
          id: t.id,
          title: t.name,
          subtitle: `Capstone Team • ${t.projectName}`,
          category: "Team",
          href: `/mentor/teams`,
        });
      }
    });

    setResults(items);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectResult = (href: string) => {
    onClose();
    router.push(href);
  };

  const getBadgeColor = (cat: string) => {
    switch (cat) {
      case "Course": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Lesson": return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "Student": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Team": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Omnibox Search Input */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
          <Search className="h-5 w-5 text-purple-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, lessons, students, teams, resources... (Press Esc to close)"
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none font-medium"
          />
          <span className="text-[10px] font-mono font-bold bg-muted border border-border px-2 py-1 rounded-lg text-muted-foreground">
            ESC
          </span>
          <button onClick={onClose} className="p-1 rounded-xl text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {results.length > 0 ? (
            results.map((res) => (
              <div
                key={res.id}
                onClick={() => handleSelectResult(res.href)}
                className="p-3 rounded-2xl border border-border/50 hover:border-purple-500/40 hover:bg-muted/60 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="font-extrabold text-sm text-foreground group-hover:text-purple-500 transition-colors truncate">
                    {res.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{res.subtitle}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${getBadgeColor(res.category)}`}>
                    {res.category}
                  </span>
                  <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          ) : query.trim() ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No platform items found matching &quot;{query}&quot;. Try searching for &quot;Python&quot;, &quot;Binary Search&quot;, or &quot;Alex&quot;.
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-bold text-foreground">Global QbitX Omnibox Search</p>
              <p>Type any course title, student name, capstone project, or lesson to navigate instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
