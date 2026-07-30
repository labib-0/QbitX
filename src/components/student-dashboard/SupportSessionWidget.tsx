"use client";

import { Clock, Video, ChevronRight } from "lucide-react";

export function SupportSessionWidget() {
  const sessions = [
    { day: "Thu", times: "11:00 AM | 04:00 PM | 09:00 PM - 2h", active: true },
    { day: "Fri", times: "11:00 AM | 04:00 PM | 09:00 PM - 2h", active: false },
    { day: "Sat", times: "04:00 PM | 09:00 PM - 2h", active: false },
    { day: "Sun", times: "11:00 AM | 04:00 PM | 09:00 PM - 2h", active: false },
    { day: "Mon", times: "11:00 AM | 04:00 PM | 09:00 PM - 2h", active: false },
    { day: "Tue", times: "11:00 AM | 04:00 PM | 09:00 PM - 2h", active: false },
    { day: "Wed", times: "11:00 AM | 04:00 PM | 09:00 PM - 2h", active: false },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-foreground font-heading flex items-center gap-2">
          <Clock className="h-4.5 w-4.5 text-emerald-500" />
          <span>Support Session</span>
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          Live Mentors Online
        </span>
      </div>

      <div className="space-y-2">
        {sessions.map((s, idx) => (
          <div
            key={idx}
            onClick={() => s.active && alert("Joining Live Support Session Zoom Room...")}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
              s.active
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-sm cursor-pointer hover:bg-emerald-500/20"
                : "bg-muted/30 border-border/50 text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold min-w-[28px]">{s.day}:</span>
              <span className="font-mono text-[11px]">{s.times}</span>
            </div>

            {s.active && (
              <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0">
                <Video className="h-3 w-3" /> Join Live
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
