"use client";

import { useState } from "react";
import { AuditLogService } from "@/services/mentor/AuditLogService";
import { FileSpreadsheet, Search, Filter } from "lucide-react";

export function AuditLogViewerWidget() {
  const [query, setQuery] = useState("");
  const logs = AuditLogService.getLogs();

  const filtered = logs.filter(
    (l) => !query || l.details.toLowerCase().includes(query.toLowerCase()) || l.actorName.toLowerCase().includes(query.toLowerCase()) || l.actionType.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-amber-500" />
            <span>System Audit Logs & Governance Stream</span>
          </h2>
          <p className="text-xs text-muted-foreground">Searchable record of all administrative, grading, course publishing, and user actions.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search action, actor, or details..."
            className="w-full rounded-2xl bg-muted/40 border border-border pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((log) => (
          <div key={log.id} className="p-4 rounded-3xl border border-border bg-card flex items-center justify-between gap-4 text-xs shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider block">{log.actionType}</span>
              <p className="font-bold text-foreground text-sm">{log.details}</p>
              <p className="text-muted-foreground text-[11px]">Actor: <strong className="text-foreground">{log.actorName}</strong> ({log.actorRole})</p>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
