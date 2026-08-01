"use client";

import { BarChart2, TrendingUp, Users, Award, BookOpen } from "lucide-react";

export function MentorAnalyticsWidget() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-purple-500" />
          <span>Class Performance & Engagement Analytics</span>
        </h2>
        <p className="text-xs text-muted-foreground">Aggregated learning trends, weekly active students, and grade distribution metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold text-muted-foreground">Average Completion Rate</span>
          <p className="text-3xl font-black text-purple-500 font-heading">84.2%</p>
          <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> +6.4% from last semester
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold text-muted-foreground">Weekly Active Learners</span>
          <p className="text-3xl font-black text-sky-500 font-heading">128 / 142</p>
          <p className="text-xs text-muted-foreground font-medium">90.1% weekly active rate</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold text-muted-foreground">Assignments Graded On-Time</span>
          <p className="text-3xl font-black text-emerald-500 font-heading">98.5%</p>
          <p className="text-xs text-muted-foreground font-medium">Avg response &lt; 15 mins</p>
        </div>
      </div>

      {/* Grade Distribution Bar Visualizer */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-base text-foreground font-heading">Grade Distribution Overview</h3>
        <div className="space-y-3">
          {[
            { grade: "A+ / A (90% - 100%)", count: 68, pct: 48, color: "bg-emerald-500" },
            { grade: "B+ / B (80% - 89%)", count: 45, pct: 32, color: "bg-sky-500" },
            { grade: "C+ / C (70% - 79%)", count: 20, pct: 14, color: "bg-amber-500" },
            { grade: "Below 70% (At Risk)", count: 9, pct: 6, color: "bg-red-500" },
          ].map((item, i) => (
            <div key={i} className="space-y-1 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-foreground">{item.grade}</span>
                <span className="text-muted-foreground">{item.count} Students ({item.pct}%)</span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
