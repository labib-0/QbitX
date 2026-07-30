"use client";

import { Megaphone, Calendar, ChevronRight } from "lucide-react";

export function NoticePanel() {
  const notice = {
    date: "Jun 28th 2026, 1:49 am",
    title: "Special Academic Holiday & Upcoming Hackathon Announcement",
    body: "Regarding upcoming academic schedules and QbitX Annual AI Hackathon 2026 preparation sessions.",
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
      
      {/* Date & View Details */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-sky-500" />
          {notice.date}
        </span>
        <button
          onClick={() => alert(`Showing Notice Details:\n${notice.title}\n\n${notice.body}`)}
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
        >
          View Details
        </button>
      </div>

      {/* Notice Card */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
          <Megaphone className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{notice.title}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {notice.body}
        </p>
      </div>

      {/* See All Announcements Button */}
      <button
        onClick={() => alert("Opening All System Announcements")}
        className="w-full py-2.5 rounded-xl border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 text-xs font-bold transition-all flex items-center justify-center gap-1"
      >
        <span>See All Announcements</span>
        <ChevronRight className="h-4 w-4" />
      </button>

    </div>
  );
}
