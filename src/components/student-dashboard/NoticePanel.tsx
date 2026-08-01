"use client";

import { useState, useEffect } from "react";
import { Megaphone, Calendar, ChevronRight, AlertCircle, Sparkles } from "lucide-react";
import type { Announcement } from "@/lib/dashboardData";

const CATEGORY_STYLES: Record<string, { label: string; style: string }> = {
  academic: { label: "Academic", style: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" },
  event: { label: "Event", style: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400" },
  deadline: { label: "Deadline", style: "bg-red-500/10 border-red-500/20 text-red-500" },
  general: { label: "General", style: "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400" },
};

export function NoticePanel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setAnnouncements(json.data.announcements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayed = showAll ? announcements : announcements.slice(0, 2);

  return (
    <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <Megaphone className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-sm font-extrabold text-foreground">Notices & Announcements</h3>
        </div>
        {announcements.some((a) => a.urgent) && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
            <AlertCircle className="h-3 w-3" />
            Urgent
          </span>
        )}
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 rounded-2xl bg-muted" />
          <div className="h-16 rounded-2xl bg-muted" />
        </div>
      ) : (
        <>
          {/* Announcement Cards */}
          <div className="space-y-3">
            {displayed.map((an) => {
              const style = CATEGORY_STYLES[an.category] || CATEGORY_STYLES.general;
              const isExpanded = expanded === an.id;
              return (
                <button
                  key={an.id}
                  onClick={() => setExpanded(isExpanded ? null : an.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all space-y-1.5 ${style.style}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span className={`font-extrabold text-xs line-clamp-1`}>{an.title}</span>
                    </div>
                    {an.urgent && (
                      <span className="shrink-0 text-[9px] font-bold bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded-full">URGENT</span>
                    )}
                  </div>

                  <p className={`text-[11px] text-muted-foreground leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                    {an.body}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(an.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="ml-auto font-semibold">{isExpanded ? "Show less" : "Read more"}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* See All / Collapse Button */}
          {announcements.length > 2 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-2.5 rounded-xl border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 text-xs font-bold transition-all flex items-center justify-center gap-1"
            >
              <span>{showAll ? "Show Less" : `See All ${announcements.length} Announcements`}</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
