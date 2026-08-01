"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle2, EyeOff, AlertTriangle } from "lucide-react";
import { ModerationItem } from "@/types/admin";

export function ModerationWidget() {
  const [items, setItems] = useState<ModerationItem[]>([
    {
      id: "mod-1",
      contentType: "discussion",
      authorName: "Anonymous User",
      contentSnippet: "Pasted unverified external link in discussion forum...",
      flaggedReason: "Potential spam / unverified external URL",
      reportedAt: "Today, 11:20 AM",
      status: "pending",
    },
  ]);

  const handleAction = (id: string, newStatus: "approved" | "hidden") => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <span>Content Moderation & Flagged Reports Center</span>
          </h2>
          <p className="text-xs text-muted-foreground">Review reported discussion posts, public resources, and student announcements.</p>
        </div>

        <span className="text-xs font-extrabold bg-red-500/10 text-red-500 px-3.5 py-1.5 rounded-full border border-red-500/20">
          {items.filter((i) => i.status === "pending").length} Reports Awaiting Review
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-wider block">Flagged {item.contentType}</span>
              <p className="font-bold text-sm text-foreground">&quot;{item.contentSnippet}&quot;</p>
              <p className="text-xs text-muted-foreground">Reported by system • Reason: <strong className="text-red-500">{item.flaggedReason}</strong></p>
            </div>

            {item.status !== "pending" ? (
              <span className="text-xs font-extrabold px-4 py-2 rounded-xl border bg-muted text-muted-foreground capitalize">
                Status: {item.status}
              </span>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleAction(item.id, "hidden")} className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-sm">
                  Hide Content
                </button>
                <button onClick={() => handleAction(item.id, "approved")} className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold">
                  Dismiss Report
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
