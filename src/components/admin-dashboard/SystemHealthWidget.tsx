"use client";

import { AdminDataService } from "@/services/admin/AdminDataService";
import { Activity, Database, HardDrive, ShieldCheck, Zap, Server } from "lucide-react";

export function SystemHealthWidget() {
  const health = AdminDataService.getSystemHealth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <Activity className="h-6 w-6 text-amber-500" />
          <span>System Health & Security Monitor</span>
        </h2>
        <p className="text-xs text-muted-foreground">Live infrastructure status, API latency, storage capacity, and active session monitoring.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">API Edge Gateway</span>
            <Server className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-500 font-heading">99.98% Uptime</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Latency: {health.apiLatencyMs}ms avg</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">TiDB Cluster Status</span>
            <Database className="h-4 w-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-foreground font-heading">Healthy</p>
          <p className="text-[11px] font-semibold text-muted-foreground">0 query deadlocks</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Media Storage Usage</span>
            <HardDrive className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-foreground font-heading">{health.storageUsedGb} GB / {health.storageMaxGb} GB</p>
          <p className="text-[11px] font-semibold text-muted-foreground">8.4% total capacity used</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Active User Sessions</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500 font-heading">{health.activeSessionsCount}</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Error Rate: {health.errorRatePct}%</p>
        </div>
      </div>
    </div>
  );
}
