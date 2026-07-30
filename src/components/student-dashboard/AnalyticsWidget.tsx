"use client";

import { useEffect, useState } from "react";
import { AnalyticsService } from "@/services/AnalyticsService";
import { BarChart3, TrendingUp, Zap, Clock, Activity, RefreshCw } from "lucide-react";

export function AnalyticsWidget() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    AnalyticsService.getAnalyticsData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
        <span>Loading analytics engine...</span>
      </div>
    );
  }

  const maxHours = Math.max(...data.weeklyHours.map((d: any) => d.hours));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sky-500" />
            <span>Learning Analytics & Performance Velocity</span>
          </h2>
          <p className="text-xs text-muted-foreground">Comprehensive insights into study time distribution, XP gains, and course completion speed.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Weekly Study Hours Bar Chart */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-foreground font-heading flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-sky-500" />
              <span>Weekly Study Time (Hours)</span>
            </span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">Total: 42.5h</span>
          </div>

          <div className="flex items-end justify-between h-48 pt-6 px-2 border-b border-border">
            {data.weeklyHours.map((item: any, idx: number) => {
              const heightPercent = Math.round((item.hours / maxHours) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </span>
                  <div
                    className="w-8 sm:w-10 rounded-t-xl bg-gradient-to-t from-sky-500 to-indigo-600 group-hover:scale-105 transition-all shadow-md"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-bold text-muted-foreground">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Gain Breakdown */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-foreground font-heading flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Weekly XP Gain Breakdown</span>
            </span>
            <span className="text-xs font-bold text-amber-500">8,450 XP Total</span>
          </div>

          <div className="space-y-3 pt-2">
            {data.xpBreakdown.map((xp: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground">{xp.category}</span>
                  <span className="text-amber-500 font-mono">+{xp.xp} XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                    style={{ width: `${(xp.xp / 3200) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
