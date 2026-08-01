"use client";

import { useAuth } from "@/context/authContext";
import { AdminDataService } from "@/services/admin/AdminDataService";
import { AuditLogService } from "@/services/mentor/AuditLogService";
import { Users, UserCheck, BookOpen, Crown, DollarSign, Activity, FileSpreadsheet, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export function PlatformOverviewWidget() {
  const { user } = useAuth();
  const name = user?.name || "System Admin";
  const logs = AuditLogService.getLogs();

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 p-6 sm:p-8 border border-amber-500/20 shadow-md space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-500/20 px-3.5 py-1 rounded-full w-fit border border-amber-500/30">
          <Crown className="h-3.5 w-3.5 text-amber-500" />
          <span>Platform Executive Operations Control Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
          Executive Control Panel, <span className="text-amber-600 dark:text-amber-400">{name}</span>!
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          QbitX Platform Ecosystem is operating at <strong>99.98% uptime</strong> across <strong>1,420 enrolled students</strong>, <strong>24 verified senior mentors</strong>, and <strong>2 multi-tenant university partners</strong>.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Platform Users", value: "1,444", desc: "1,420 Students • 24 Mentors", icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Active Enrolled Courses", value: "4 Courses", desc: "100% published status", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Monthly Platform Revenue", value: "$24,800 USD", desc: "+14.2% MRR growth", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "System Health & Uptime", value: "99.98%", desc: "Avg API latency: 14ms", icon: Activity, color: "text-sky-500", bg: "bg-sky-500/10" },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-2xl font-black text-foreground font-heading">{card.value}</p>
              <p className="text-[11px] font-semibold text-muted-foreground">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Live Audit Stream & Quick Control Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-Time System Audit Log Feed */}
        <div className="lg:col-span-8 rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-amber-500" />
              <span>Real-Time Platform Audit Stream</span>
            </h3>
            <Link href="/admin/audit" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              <span>View Full Audit Log</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider block">{log.actionType}</span>
                  <p className="font-bold text-foreground">{log.details}</p>
                  <p className="text-[10px] text-muted-foreground">Actor: <strong>{log.actorName}</strong> ({log.actorRole})</p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="lg:col-span-4 rounded-3xl border border-amber-500/30 bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-300 block">Quick Administrative Actions</span>
            <h4 className="font-extrabold text-sm text-foreground">Platform Governance Controls</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review mentor applications, issue global broadcasts, configure feature flags, or inspect tenant health.
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/admin/mentors" className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 text-center block">
              Review Mentor Applications
            </Link>
            <Link href="/admin/settings" className="w-full py-2.5 rounded-xl bg-muted text-foreground text-xs font-bold text-center block hover:bg-muted/80">
              Manage Feature Flags
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
