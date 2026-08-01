"use client";

import { useState } from "react";
import { InternshipOpportunity } from "@/types/career";
import { Building2, ArrowUpRight, Clock, CheckCircle2, Bookmark } from "lucide-react";

export function InternshipCenterWidget({ internships }: { internships: InternshipOpportunity[] }) {
  const [items, setItems] = useState<InternshipOpportunity[]>(internships);

  const handleApply = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "applied" } : item))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sky-500" />
            <span>Internship Application Hub & Placement Tracker</span>
          </h2>
          <p className="text-xs text-muted-foreground">Track saved internships, deadline reminders, and one-click portfolio application submissions.</p>
        </div>

        <span className="text-xs font-extrabold bg-sky-500/10 text-sky-600 dark:text-sky-400 px-3.5 py-1.5 rounded-full border border-sky-500/20">
          {items.filter((i) => i.status === "interviewing").length} Active Interviews
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-foreground font-heading">{item.company}</h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {item.matchPercentage}% Match
                </span>
              </div>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400">{item.role}</p>
              <p className="text-xs text-muted-foreground">{item.location} • Deadline: <strong>{item.deadline}</strong></p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border capitalize ${
                item.status === "interviewing"
                  ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                  : item.status === "applied"
                  ? "bg-sky-500/10 text-sky-500 border-sky-500/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}>
                {item.status}
              </span>

              {item.status === "saved" && (
                <button
                  onClick={() => handleApply(item.id)}
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-sm flex items-center gap-1"
                >
                  <span>1-Click Apply</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
