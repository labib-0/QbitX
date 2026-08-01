"use client";

import { useState } from "react";
import { Megaphone, Send, CheckCircle2, Users, Bell } from "lucide-react";

export function GlobalNotificationWidget() {
  const [broadcastText, setBroadcastText] = useState("");
  const [audience, setAudience] = useState("all");
  const [dispatched, setDispatched] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setBroadcastText("");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-amber-500" />
          <span>Global Broadcast & Notification Center</span>
        </h2>
        <p className="text-xs text-muted-foreground">Dispatch platform announcements, maintenance notices, and emergency alerts to target audiences.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Target Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full sm:w-64 rounded-xl bg-muted/40 border border-border px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
            >
              <option value="all">Entire Platform (Students & Mentors)</option>
              <option value="students">Students Only</option>
              <option value="mentors">Senior Mentors Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Announcement Message Body</label>
            <textarea
              rows={4}
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="Write global broadcast notification..."
              className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {dispatched ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-extrabold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Global Broadcast Dispatched to {audience.toUpperCase()} Audience!</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!broadcastText.trim()}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Dispatch Platform Broadcast</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
